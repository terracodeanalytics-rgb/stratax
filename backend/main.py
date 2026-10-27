import hashlib
import json
import logging
import os
import time
import uuid
from typing import Literal
from urllib.parse import parse_qs, urlencode, urlparse

import firebase_admin
from fastapi import Depends, FastAPI, HTTPException, Request
from fastapi.exceptions import RequestValidationError
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse, Response
from firebase_admin import auth
from google.cloud import firestore
from pydantic import BaseModel, ConfigDict, EmailStr, Field

from mailer import send_email, smtp_ready
from policies import POLICY_VERSIONS, acceptance_current

PROJECT = os.environ.get("GOOGLE_CLOUD_PROJECT", "project-9afac")
SITE_ORIGIN = os.environ.get("STRATAX_SITE_ORIGIN", "https://stratax-workbench.cometcrab258.chatgpt.site").rstrip("/")
logger = logging.getLogger("stratax")
app = FastAPI(title="StrataX account API", docs_url=None, redoc_url=None, openapi_url=None)
app.add_middleware(CORSMiddleware, allow_origins=[SITE_ORIGIN], allow_methods=["GET", "POST", "PUT", "OPTIONS"], allow_headers=["Authorization", "Content-Type", "X-File-Name"], expose_headers=["Retry-After", "X-Request-ID"])
_db = None

def database():
    global _db
    if _db is None:
        _db = firestore.Client(project=PROJECT)
    return _db

def firebase():
    if not firebase_admin._apps:
        firebase_admin.initialize_app(options={"projectId": PROJECT})

def fail(status, code, message):
    raise HTTPException(status_code=status, detail={"code": code, "message": message})

@app.exception_handler(HTTPException)
async def friendly_http(request, error):
    detail = error.detail if isinstance(error.detail, dict) else {"code": "request_failed", "message": "The request could not be completed."}
    return JSONResponse(detail, status_code=error.status_code, headers=error.headers)

@app.exception_handler(RequestValidationError)
async def invalid_request(request, error):
    return JSONResponse({"code": "invalid_request", "message": "Check the form fields and try again."}, status_code=400)

@app.middleware("http")
async def boundaries(request: Request, call_next):
    request.state.request_id = uuid.uuid4().hex
    try:
        origin = request.headers.get("origin")
        if origin and origin != SITE_ORIGIN:
            return JSONResponse({"code": "origin_not_allowed", "message": "This request origin is not supported."}, status_code=403)
        if request.method in ("POST", "PUT") and not (request.url.path.startswith("/api/projects/") and "/files/" in request.url.path):
            if request.headers.get("content-type", "").split(";")[0] != "application/json":
                return JSONResponse({"code": "json_required", "message": "Send a JSON request."}, status_code=415)
            limit = 524288 if request.url.path.startswith("/api/projects/") else 8192
            if int(request.headers.get("content-length", "0")) > limit:
                return JSONResponse({"code": "request_too_large", "message": "The request is too large."}, status_code=413)
            body = await request.body()
            if len(body) > limit:
                return JSONResponse({"code": "request_too_large", "message": "The request is too large."}, status_code=413)
        response = await call_next(request)
    except Exception as error:
        logger.error(json.dumps({"event": "request_failed", "request_id": request.state.request_id, "kind": type(error).__name__}))
        response = JSONResponse({"code": "service_unavailable", "message": "StrataX is temporarily unavailable. Please try again."}, status_code=503)
    response.headers["Cache-Control"] = "no-store"
    response.headers["X-Content-Type-Options"] = "nosniff"
    response.headers["Referrer-Policy"] = "no-referrer"
    response.headers["X-Request-ID"] = request.state.request_id
    return response

def current_user(request: Request):
    bearer = request.headers.get("authorization", "")
    if not bearer.startswith("Bearer "):
        fail(401, "sign_in_required", "Sign in to continue.")
    try:
        firebase()
        user = auth.verify_id_token(bearer[7:], check_revoked=False)
    except Exception:
        fail(401, "session_expired", "Your session has expired. Sign in again.")
    if not user.get("email_verified"):
        fail(403, "email_not_verified", "Verify your email address before continuing.")
    return user

class StrictModel(BaseModel):
    model_config = ConfigDict(extra="forbid")

class EmailRequest(StrictModel):
    email: EmailStr
    purpose: Literal["signup", "recovery", "verification"]
    name: str = Field(default="", max_length=120)

class Acceptance(StrictModel):
    accepted: bool
    accepted_versions: dict[str, str]

class Profile(StrictModel):
    display_name: str = Field(default="", max_length=120)
    organization: str = Field(default="", max_length=150)

@firestore.transactional
def consume_window(transaction, ref, now, limit, seconds):
    snapshot = ref.get(transaction=transaction)
    data = snapshot.to_dict() or {}
    active = data.get("expires_at", 0) > now
    count = data.get("count", 0) if active else 0
    if count >= limit:
        return False
    transaction.set(ref, {"count": count + 1, "expires_at": data["expires_at"] if active else now + seconds})
    return True

def rate_limit(request, email):
    db = database()
    # Cloud Run appends the connecting address to X-Forwarded-For; do not trust its first entry.
    forwarded = request.headers.get("x-forwarded-for", "").split(",")
    peer = forwarded[-1].strip() or (request.client.host if request.client else "unknown")
    now = int(time.time())
    for kind, value, limit, seconds in (("email", email, 3, 900), ("ip", peer, 12, 900), ("global", "all", 100, 3600)):
        digest = hashlib.sha256(f"stratax:{kind}:{value}".encode()).hexdigest()
        ref = db.collection("stratax_auth_rate_limits").document(digest)
        if not consume_window(db.transaction(), ref, now, limit, seconds):
            raise HTTPException(429, {"code": "too_many_requests", "message": "Too many requests. Please wait before requesting another email."}, headers={"Retry-After": "900"})

def account_link(email, purpose):
    firebase()
    if purpose == "verification":
        generated = auth.generate_email_verification_link(email, auth.ActionCodeSettings(url=SITE_ORIGIN + "/#email-action", handle_code_in_app=False))
    else:
        generated = auth.generate_sign_in_with_email_link(email, auth.ActionCodeSettings(url=SITE_ORIGIN + "/#email-action", handle_code_in_app=True))
    # Give this app its own action handler without changing shared Firebase email templates.
    params = parse_qs(urlparse(generated).query)
    query = {key: params[key][0] for key in ("mode", "oobCode", "apiKey") if key in params}
    if not query.get("oobCode") or not query.get("mode"):
        raise RuntimeError("Invalid generated action link")
    query["purpose"] = purpose
    return SITE_ORIGIN + "/?" + urlencode(query) + "#email-action"

@app.get("/healthz")
@app.get("/api/health")
def health():
    return {"status": "ok", "service": "stratax-api"}

@app.get("/readyz")
def ready():
    if not smtp_ready() or not os.environ.get("FIREBASE_APP_ID") or not os.environ.get("FIREBASE_API_KEY"):
        fail(503, "configuration_unavailable", "Account services are not ready.")
    return {"status": "ready"}

@app.get("/api/runtime-config")
def runtime_config():
    return {"firebase": {"apiKey": os.environ.get("FIREBASE_API_KEY", ""), "authDomain": f"{PROJECT}.firebaseapp.com", "projectId": PROJECT, "appId": os.environ.get("FIREBASE_APP_ID", ""), "messagingSenderId": "227436363119"}, "policy_versions": POLICY_VERSIONS, "remember_days": 30, "maps_api_key": os.environ.get("GOOGLE_MAPS_API_KEY", "")}

@app.post("/api/auth/action-email", status_code=202)
def action_email(body: EmailRequest, request: Request):
    email = str(body.email).strip().lower()
    rate_limit(request, email)
    try:
        link = account_link(email, body.purpose)
        send_email(email, body.purpose, body.name, link, "https://stratax-api-227436363119.us-central1.run.app/assets/logo.png")
    except auth.UserNotFoundError:
        # Recovery/verification must not disclose whether an account exists.
        pass
    except Exception as error:
        logger.error(json.dumps({"event": "auth_email_failed", "request_id": request.state.request_id, "kind": type(error).__name__}))
        fail(503, "email_unavailable", "We could not send the account email. Please try again shortly.")
    return {"accepted": True, "message": "If this address is eligible, an account email will arrive shortly."}

@app.get("/api/legal-acceptance")
def get_acceptance(user=Depends(current_user)):
    stored = database().collection("stratax_legal_acceptance").document(user["uid"]).get().to_dict()
    return {"accepted": acceptance_current(stored), "versions": (stored or {}).get("versions", {}), "required_versions": POLICY_VERSIONS}

@app.post("/api/legal-acceptance")
def accept(body: Acceptance, user=Depends(current_user)):
    if not body.accepted or body.accepted_versions != POLICY_VERSIONS:
        fail(400, "policy_versions_changed", "Review and accept the current StrataX policies before continuing.")
    database().collection("stratax_legal_acceptance").document(user["uid"]).set({"uid": user["uid"], "versions": POLICY_VERSIONS, "accepted_at": firestore.SERVER_TIMESTAMP})
    return {"accepted": True, "versions": POLICY_VERSIONS}

@app.get("/api/account")
def get_account(user=Depends(current_user)):
    stored = database().collection("stratax_accounts").document(user["uid"]).get().to_dict() or {}
    return {"uid": user["uid"], "email": user.get("email", ""), "display_name": stored.get("display_name", ""), "organization": stored.get("organization", "")}

@app.put("/api/account")
def put_account(body: Profile, user=Depends(current_user)):
    if not acceptance_current(database().collection("stratax_legal_acceptance").document(user["uid"]).get().to_dict()):
        fail(403, "policies_required", "Accept the current StrataX policies before saving your profile.")
    profile = {"display_name": body.display_name.strip(), "organization": body.organization.strip()}
    database().collection("stratax_accounts").document(user["uid"]).set({**profile, "updated_at": firestore.SERVER_TIMESTAMP}, merge=True)
    return {"uid": user["uid"], "email": user.get("email", ""), **profile}

@app.get("/assets/logo.png")
def email_logo():
    from pathlib import Path
    return Response(Path(__file__).with_name("logo.png").read_bytes(), media_type="image/png", headers={"Cache-Control": "public, max-age=86400"})

from projects import install_projects
install_projects(app, database, current_user, fail, acceptance_current)
