import asyncio
import logging
import smtplib
from email.message import EmailMessage

from app.config import settings

logger = logging.getLogger(__name__)


def smtp_configured() -> bool:
    return bool(settings.smtp_host and (settings.smtp_from_email or settings.smtp_user))


def _send_message(subject: str, body: str, recipient: str, reply_to: str | None = None) -> None:
    message = EmailMessage()
    message["Subject"] = subject
    message["From"] = settings.smtp_from_email or settings.smtp_user
    message["To"] = recipient
    if reply_to:
        message["Reply-To"] = reply_to
    message.set_content(body)

    with smtplib.SMTP(settings.smtp_host, settings.smtp_port, timeout=15) as smtp:
        if settings.smtp_use_tls:
            smtp.starttls()
        if settings.smtp_user and settings.smtp_password:
            smtp.login(settings.smtp_user, settings.smtp_password)
        smtp.send_message(message)


async def send_email(subject: str, body: str, recipient: str, reply_to: str | None = None) -> None:
    if not smtp_configured():
        raise RuntimeError("Email is not configured")
    await asyncio.to_thread(_send_message, subject, body, recipient, reply_to)
