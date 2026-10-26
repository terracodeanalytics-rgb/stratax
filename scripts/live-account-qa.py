"""Exercise isolated Firebase accounts and the deployed StrataX API; never print credentials."""
import hashlib
import email as email_parser
import imaplib
import json
import os
from pathlib import Path
import secrets
import subprocess
import time
import urllib.error
import urllib.parse
import urllib.request

PROJECT = "project-9afac"
API = "https://stratax-api-227436363119.us-central1.run.app"
SITE = "https://stratax-workbench.cometcrab258.chatgpt.site"


def request(url, method="GET", body=None, token=None, quota=False):
    headers = {"Content-Type": "application/json"}
    if token:
        headers["Authorization"] = "Bearer " + token
    if quota:
        headers["x-goog-user-project"] = PROJECT
    data = None if body is None else json.dumps(body).encode()
    req = urllib.request.Request(url, data=data, headers=headers, method=method)
    try:
        with urllib.request.urlopen(req, timeout=60) as response:
            raw = response.read()
            return response.status, json.loads(raw) if raw else {}
    except urllib.error.HTTPError as error:
        raw = error.read()
        try:
            payload = json.loads(raw)
        except ValueError:
            payload = {"code": "non_json_response"}
        return error.code, payload


def main():
    admin = subprocess.check_output(["gcloud.cmd", "auth", "print-access-token"], text=True).strip()
    status, config = request(API + "/api/runtime-config")
    assert status == 200
    api_key = config["firebase"]["apiKey"]
    versions = config["policy_versions"]
    id_base = "https://identitytoolkit.googleapis.com/v1/"
    fixtures = []
    checks = []
    def check(name, condition):
        if not condition:
            raise RuntimeError("Live check failed: " + name)
        checks.append(name)
    def provider(action, body, use_admin=False):
        return request(id_base + action + ("?key=" + api_key if not use_admin else ""), "POST", body, admin if use_admin else None, use_admin)
    def fixture():
        email = "stratax-qa-" + secrets.token_hex(8) + "@example.com"
        status, generated = provider("projects/" + PROJECT + "/accounts:sendOobCode", {"requestType": "EMAIL_SIGNIN", "email": email, "returnOobLink": True, "continueUrl": SITE + "/#email-action", "canHandleCodeInApp": True}, True)
        check("Generate isolated Firebase email link", status == 200)
        code = urllib.parse.parse_qs(urllib.parse.urlparse(generated["oobLink"]).query)["oobCode"][0]
        status, signed = provider("accounts:signInWithEmailLink", {"email": email, "oobCode": code})
        check("Verify isolated email ownership", status == 200)
        fixtures.append({"uid": signed["localId"], "token": signed["idToken"], "email": email})
        return fixtures[-1], code
    try:
        if os.environ.get("STRATAX_QA_SKIP_HEALTH") != "1":
            check("Health", request(API + "/api/health")[0] == 200)
        check("Readiness", request(API + "/readyz")[0] == 200)
        check("Anonymous account blocked", request(API + "/api/account")[0] == 401)
        check("Anonymous policies blocked", request(API + "/api/legal-acceptance")[0] == 401)
        a, code = fixture()
        password = "StrataX!" + secrets.token_hex(16) + "Aa1"
        status, changed = provider("accounts:update", {"idToken": a["token"], "password": password, "returnSecureToken": True})
        check("Save isolated account password", status == 200)
        a["token"] = changed["idToken"]
        status, signed = provider("accounts:signInWithPassword", {"email": a["email"], "password": password, "returnSecureToken": True})
        check("Real password sign-in", status == 200)
        a["token"] = signed["idToken"]
        check("New account policies absent", request(API + "/api/legal-acceptance", token=a["token"])[1].get("accepted") is False)
        check("Stale policies rejected", request(API + "/api/legal-acceptance", "POST", {"accepted": True, "accepted_versions": {}}, a["token"])[0] == 400)
        check("Accept policies", request(API + "/api/legal-acceptance", "POST", {"accepted": True, "accepted_versions": versions}, a["token"])[0] == 200)
        check("Policies persist", request(API + "/api/legal-acceptance", token=a["token"])[1].get("accepted") is True)
        check("Save profile", request(API + "/api/account", "PUT", {"display_name": "StrataX QA", "organization": "Isolated test"}, a["token"])[0] == 200)
        check("Profile persists", request(API + "/api/account", token=a["token"])[1].get("display_name") == "StrataX QA")
        b, _ = fixture()
        check("Account isolation", request(API + "/api/account", token=b["token"])[1].get("display_name") == "")
        check("Acceptance isolation", request(API + "/api/legal-acceptance", token=b["token"])[1].get("accepted") is False)
        check("Reused link rejected", provider("accounts:signInWithEmailLink", {"email": a["email"], "oobCode": code})[0] == 400)
        # Independently verify a real recovery link against the isolated account.
        status, recovered = provider("projects/" + PROJECT + "/accounts:sendOobCode", {"requestType": "EMAIL_SIGNIN", "email": a["email"], "returnOobLink": True, "continueUrl": SITE + "/#email-action", "canHandleCodeInApp": True}, True)
        recovery_code = urllib.parse.parse_qs(urllib.parse.urlparse(recovered["oobLink"]).query)["oobCode"][0]
        status, recovered_user = provider("accounts:signInWithEmailLink", {"email": a["email"], "oobCode": recovery_code})
        check("Real isolated recovery link", status == 200 and recovered_user["localId"] == a["uid"])
        a["token"] = recovered_user["idToken"]
        status, changed = provider("accounts:update", {"idToken": a["token"], "password": "Changed!" + secrets.token_hex(16) + "Aa1", "returnSecureToken": True})
        check("Real isolated password recovery", status == 200)
        a["token"] = changed["idToken"]
        # The user explicitly authorized this inbox for one test email.
        if os.environ.get("STRATAX_QA_EMAIL"):
            marker = "StrataX QA " + secrets.token_hex(6)
            status, sent = request(API + "/api/auth/action-email", "POST", {"email": os.environ["STRATAX_QA_EMAIL"], "purpose": "signup", "name": marker})
            check("Authorized branded email accepted by SMTP", status == 202 and sent.get("accepted") is True)
            if os.environ.get("STRATAX_QA_INBOX") == "1":
                smtp_password = subprocess.check_output(["gcloud.cmd", "secrets", "versions", "access", "latest", "--secret=gres-smtp-password", "--project=" + PROJECT], text=True).strip()
                found = False
                with imaplib.IMAP4_SSL("mail.spacemail.com", timeout=30) as mailbox:
                    mailbox.login(os.environ["STRATAX_QA_EMAIL"], smtp_password)
                    mailbox.select("INBOX", readonly=True)
                    for attempt in range(6):
                        _, ids = mailbox.search(None, 'SUBJECT', '"Finish setting up your StrataX account"')
                        for message_id in ids[0].split()[-5:]:
                            _, parts = mailbox.fetch(message_id, "(BODY.PEEK[])")
                            raw = next((part[1] for part in parts if isinstance(part, tuple)), b"")
                            message = email_parser.message_from_bytes(raw)
                            bodies = [part.get_payload(decode=True).decode(part.get_content_charset() or "utf-8", errors="replace") for part in message.walk() if part.get_content_type() in ("text/plain", "text/html") and not part.is_multipart()]
                            content = "\n".join(bodies)
                            if marker in content:
                                check("Inbox sender branding", "StrataX" in message.get("From", ""))
                                check("Inbox link points to StrataX", SITE + "/?mode=" in content)
                                found = True
                                break
                        if found:
                            break
                        time.sleep(5)
                check("Authorized inbox receipt", found)
        report = {"checked_at": time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime()), "api": API, "checks": checks, "passed": len(checks), "smtp_delivery": "accepted by SMTP" if os.environ.get("STRATAX_QA_EMAIL") else "not requested", "limits": "Inbox receipt and Google-popup completion require browser/inbox verification."}
        Path(".release/live-account-verification.json").write_text(json.dumps(report, indent=2))
        print(json.dumps(report))
    finally:
        cleaned = 0
        for fixture in fixtures:
            status, _ = provider("accounts:delete", {"idToken": fixture["token"]})
            if status != 200:
                # The admin path is limited to the exact fixture UID created by this run.
                status, _ = provider("projects/" + PROJECT + "/accounts:delete", {"localId": fixture["uid"]}, True)
            if status == 200:
                cleaned += 1
            for collection in ("stratax_accounts", "stratax_legal_acceptance"):
                request(f"https://firestore.googleapis.com/v1/projects/{PROJECT}/databases/(default)/documents/{collection}/{fixture['uid']}", "DELETE", token=admin, quota=True)
        print(json.dumps({"isolated_accounts_removed": cleaned, "isolated_accounts_created": len(fixtures)}))


if __name__ == "__main__":
    main()
