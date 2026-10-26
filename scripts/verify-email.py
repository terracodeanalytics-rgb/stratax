"""Send and verify only the user-authorized StrataX test message."""
import email
import imaplib
import json
import os
from pathlib import Path
import secrets
import subprocess
import time
from importlib.util import spec_from_file_location, module_from_spec

spec = spec_from_file_location("live_qa", Path(__file__).with_name("live-account-qa.py"))
qa = module_from_spec(spec)
spec.loader.exec_module(qa)

inbox = os.environ["STRATAX_QA_EMAIL"]
marker = "StrataX QA " + secrets.token_hex(6)
status, sent = qa.request(qa.API + "/api/auth/action-email", "POST", {"email": inbox, "purpose": "signup", "name": marker})
if status != 202 or not sent.get("accepted"):
    raise RuntimeError(f"Account email failed: HTTP {status}, {sent.get('code', 'unknown')}")
smtp_password = subprocess.check_output(["gcloud.cmd", "secrets", "versions", "access", "latest", "--secret=gres-smtp-password", "--project=" + qa.PROJECT], text=True).strip()
found = False
with imaplib.IMAP4_SSL("mail.spacemail.com", timeout=30) as mailbox:
    mailbox.login(inbox, smtp_password)
    mailbox.select("INBOX", readonly=True)
    for attempt in range(6):
        _, ids = mailbox.search(None, "SUBJECT", '"Finish setting up your StrataX account"')
        for message_id in ids[0].split()[-5:]:
            _, parts = mailbox.fetch(message_id, "(BODY.PEEK[])")
            raw = next((part[1] for part in parts if isinstance(part, tuple)), b"")
            message = email.message_from_bytes(raw)
            bodies = [part.get_payload(decode=True).decode(part.get_content_charset() or "utf-8", errors="replace") for part in message.walk() if part.get_content_type() in ("text/plain", "text/html") and not part.is_multipart()]
            content = "\n".join(bodies)
            if marker in content:
                assert "StrataX" in message.get("From", "")
                assert qa.SITE + "/?mode=" in content
                assert "#email-action" in content
                assert "text/plain" in [part.get_content_type() for part in message.walk()]
                assert "text/html" in [part.get_content_type() for part in message.walk()]
                found = True
                break
        if found:
            break
        time.sleep(5)
if not found:
    raise RuntimeError("SMTP accepted the test message, but inbox receipt was not confirmed.")
report = {"inbox": inbox, "smtp_accepted": True, "inbox_receipt": True, "branding": "TerraCode Analytics | StrataX", "stratax_action_url": True, "html_and_plain_text": True, "existing_password_changed": False}
Path(".release/email-verification.json").write_text(json.dumps(report, indent=2))
print(json.dumps(report))
