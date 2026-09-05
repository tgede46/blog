import asyncio
import logging
import smtplib
from email.message import EmailMessage

from app.config import settings
from app.schemas.contact import ContactRequest


logger = logging.getLogger(__name__)


def _send_smtp(payload: ContactRequest, recipient: str) -> None:
    message = EmailMessage()
    message["Subject"] = f"[Blog contact] {payload.subject}"
    message["From"] = settings.smtp_from_email or settings.smtp_user or payload.email
    message["To"] = recipient
    message["Reply-To"] = payload.email
    message.set_content(f"From: {payload.name} <{payload.email}>\n\n{payload.message}")

    with smtplib.SMTP(settings.smtp_host, settings.smtp_port, timeout=15) as smtp:
        if settings.smtp_use_tls:
            smtp.starttls()
        if settings.smtp_user and settings.smtp_password:
            smtp.login(settings.smtp_user, settings.smtp_password)
        smtp.send_message(message)


async def deliver_contact(payload: ContactRequest, recipient: str | None) -> None:
    target = settings.smtp_to_email or recipient
    if not settings.smtp_host:
        logger.info(
            "contact_message_received",
            extra={"contact_email": str(payload.email), "contact_subject": payload.subject},
        )
        return
    if not target:
        raise RuntimeError("SMTP_TO_EMAIL or contact_email setting is required when SMTP is enabled")
    await asyncio.to_thread(_send_smtp, payload, target)
