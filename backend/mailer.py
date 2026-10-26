import html
import os
import smtplib
import ssl
from email.message import EmailMessage
from email.utils import formataddr
from urllib.parse import urlparse

TEMPLATE_VERSION = "terracode-stratax-2026-10-v1"
SUPPORT_EMAIL = "contact@terracodeanalytics.com"


def render_email(purpose, name, link, logo_url):
    if urlparse(link).scheme != "https":
        raise ValueError("Account links require HTTPS")
    title, body, button = {
        "signup": ("Finish setting up your StrataX account", "Verify your email address, then create your password to finish setting up your StrataX account.", "Complete account setup"),
        "recovery": ("Reset your StrataX password", "Use this secure one-time link to verify your email and choose a new password. Your password is shared across TerraCode apps using this account.", "Reset password"),
        "verification": ("Verify your StrataX email", "Confirm that this email address belongs to you before continuing to StrataX.", "Verify email"),
    }[purpose]
    greeting = "Hello " + (name.strip()[:100] or "there") + ","
    note = "This one-time link expires automatically. If you did not request it, you can safely ignore this email."
    text = f"TERRACODE ANALYTICS | STRATAX\n\n{title}\n\n{greeting}\n\n{body}\n\n{button}: {link}\n\n{note}\n\nQuestions? {SUPPORT_EMAIL}"
    e = html.escape
    markup = f'''<!doctype html><html lang="en"><head><meta name="viewport" content="width=device-width,initial-scale=1"><title>{e(title)}</title></head>
<body style="margin:0;background:#f6f2e8;color:#18352d;font-family:Arial,Helvetica,sans-serif"><table role="presentation" width="100%" cellpadding="0" cellspacing="0"><tr><td align="center" style="padding:28px 14px"><table role="presentation" width="100%" style="max-width:640px;background:#fffdf8;border:1px solid #dfe5df;border-radius:12px" cellpadding="0" cellspacing="0"><tr><td style="padding:24px 30px;background:#113b30;color:white"><img src="{e(logo_url)}" alt="StrataX" width="48" height="48" style="vertical-align:middle;background:white;border-radius:8px;margin-right:14px"><strong>TerraCode Analytics | StrataX</strong></td></tr><tr><td style="padding:32px 30px"><p style="font-size:11px;letter-spacing:2px;color:#087c73">SUBSURFACE INTERPRETATION</p><h1 style="font-size:27px">{e(title)}</h1><p>{e(greeting)}</p><p style="line-height:1.7">{e(body)}</p><p style="margin:30px 0"><a href="{e(link)}" style="display:inline-block;padding:14px 22px;background:#087c73;color:white;text-decoration:none;border-radius:6px;font-weight:bold">{e(button)}</a></p><p style="font-size:13px;line-height:1.7">{e(note)}</p><p style="font-size:12px;line-height:1.7;color:#63776f">If the button does not open, copy this link into your browser:<br><a href="{e(link)}" style="overflow-wrap:anywhere;color:#087c73">{e(link)}</a></p><p style="border-top:1px solid #e2e9e4;padding-top:20px;font-size:12px">Questions? <a href="mailto:{SUPPORT_EMAIL}">{SUPPORT_EMAIL}</a><br>TerraCode Analytics · Geoscience software built for defensible decisions.</p></td></tr></table><p style="font-size:10px;color:#71827b">{TEMPLATE_VERSION}</p></td></tr></table></body></html>'''
    return title, text, markup


def smtp_ready():
    return all(os.environ.get(key) for key in ("SMTP_HOST", "SMTP_USER", "SMTP_PASSWORD", "SMTP_FROM_EMAIL"))


def send_email(email, purpose, name, link, logo_url):
    if not smtp_ready():
        raise RuntimeError("Email delivery is unavailable")
    subject, text, markup = render_email(purpose, name, link, logo_url)
    message = EmailMessage()
    message["Subject"] = subject
    message["From"] = formataddr(("TerraCode Analytics | StrataX", os.environ["SMTP_FROM_EMAIL"]))
    message["To"] = email
    message["Reply-To"] = SUPPORT_EMAIL
    message.set_content(text)
    message.add_alternative(markup, subtype="html")
    with smtplib.SMTP_SSL(os.environ["SMTP_HOST"], int(os.environ.get("SMTP_PORT", "465")), timeout=20, context=ssl.create_default_context()) as client:
        client.login(os.environ["SMTP_USER"], os.environ["SMTP_PASSWORD"].strip())
        refused = client.send_message(message)
        if refused:
            raise RuntimeError("Email delivery was rejected")
