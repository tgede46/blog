import asyncio
import html
import logging
import smtplib
from email.message import EmailMessage

from app.config import settings

logger = logging.getLogger(__name__)


def smtp_configured() -> bool:
    return bool(settings.smtp_host and (settings.smtp_from_email or settings.smtp_user))


def build_brutalist_email(
    *,
    title: str,
    badge: str,
    badge_bg: str,
    body_html: str,
    footer_note: str = "Java · TypeScript · Python",
) -> str:
    safe_title = html.escape(title)
    safe_badge = html.escape(badge)
    safe_footer = html.escape(footer_note)
    return f"""<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>{safe_title}</title>
</head>
<body style="margin:0;padding:0;background:#fcf9f8;font-family:Arial,Helvetica,sans-serif;color:#212121;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:#fcf9f8;padding:32px 16px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:560px;background:#ffffff;border:3px solid #212121;box-shadow:6px 6px 0 #212121;">
          <tr>
            <td style="padding:18px 24px;background:#FDE047;border-bottom:3px solid #212121;">
              <p style="margin:0;font-size:12px;font-weight:800;letter-spacing:.16em;text-transform:uppercase;">Gedeon.</p>
            </td>
          </tr>
          <tr>
            <td style="padding:28px 24px 8px;">
              <p style="margin:0 0 16px;display:inline-block;padding:6px 12px;border:2px solid #212121;background:{badge_bg};font-size:11px;font-weight:800;letter-spacing:.14em;text-transform:uppercase;">{safe_badge}</p>
              <h1 style="margin:16px 0 0;font-size:28px;line-height:1.15;font-weight:900;">{safe_title}</h1>
            </td>
          </tr>
          <tr>
            <td style="padding:12px 24px 24px;">
              {body_html}
            </td>
          </tr>
          <tr>
            <td style="padding:16px 24px;border-top:3px solid #212121;background:#E0F2FE;">
              <p style="margin:0;font-size:13px;font-weight:700;">— Gedeon Kpara</p>
              <p style="margin:6px 0 0;font-size:12px;color:#4b5563;">{safe_footer}</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>"""


def _send_message(
    subject: str,
    body: str,
    recipient: str,
    reply_to: str | None = None,
    html_body: str | None = None,
) -> None:
    message = EmailMessage()
    message["Subject"] = subject
    message["From"] = settings.smtp_from_email or settings.smtp_user
    message["To"] = recipient
    if reply_to:
        message["Reply-To"] = reply_to
    message.set_content(body)
    if html_body:
        message.add_alternative(html_body, subtype="html")

    try:
        with smtplib.SMTP(settings.smtp_host, settings.smtp_port, timeout=15) as smtp:
            if settings.smtp_use_tls:
                smtp.starttls()
            if settings.smtp_user and settings.smtp_password:
                smtp.login(settings.smtp_user, settings.smtp_password)
            smtp.send_message(message)
    except (smtplib.SMTPException, OSError) as exc:
        raise RuntimeError(f"Failed to send email: {exc}") from exc


async def send_email(
    subject: str,
    body: str,
    recipient: str,
    reply_to: str | None = None,
    html_body: str | None = None,
) -> None:
    if not smtp_configured():
        raise RuntimeError("Email is not configured")
    await asyncio.to_thread(_send_message, subject, body, recipient, reply_to, html_body)
