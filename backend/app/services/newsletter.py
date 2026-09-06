import logging

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.config import settings
from app.database import utc_now
from app.models.article import Article
from app.models.subscriber import Subscriber
from app.services.email import send_email, smtp_configured

logger = logging.getLogger(__name__)


async def subscribe(db: AsyncSession, email: str) -> tuple[Subscriber, bool]:
    result = await db.execute(select(Subscriber).where(Subscriber.email == email))
    subscriber = result.scalar_one_or_none()
    if subscriber:
        if subscriber.unsubscribed_at is not None:
            subscriber.unsubscribed_at = None
            subscriber.subscribed_at = utc_now()
            await db.commit()
            await db.refresh(subscriber)
        return subscriber, False

    subscriber = Subscriber(email=email)
    db.add(subscriber)
    await db.commit()
    await db.refresh(subscriber)
    return subscriber, True


async def unsubscribe(db: AsyncSession, email: str) -> bool:
    result = await db.execute(select(Subscriber).where(Subscriber.email == email))
    subscriber = result.scalar_one_or_none()
    if subscriber is None:
        return False
    subscriber.unsubscribed_at = utc_now()
    await db.commit()
    return True


async def list_active_subscriber_emails(db: AsyncSession) -> list[str]:
    result = await db.execute(
        select(Subscriber.email).where(Subscriber.unsubscribed_at.is_(None)).order_by(Subscriber.subscribed_at.desc())
    )
    return [email for email in result.scalars().all()]


def article_public_url(slug: str) -> str:
    return f"{settings.frontend_url.rstrip('/')}/articles/{slug}"


def build_publish_email(article: Article) -> tuple[str, str]:
    url = article_public_url(article.slug)
    subject = f"Nouvel article : {article.title}"
    body = (
        f"Bonjour,\n\n"
        f"Un nouvel article vient d’être publié.\n\n"
        f"{article.title}\n\n"
        f"{article.excerpt}\n\n"
        f"Lire l’article :\n{url}\n\n"
        f"— Gedeon Kpara"
    )
    return subject, body


async def notify_subscribers_of_article(db: AsyncSession, article: Article) -> int:
    if not smtp_configured():
        logger.info("publish_notification_skipped", extra={"reason": "smtp_not_configured", "slug": article.slug})
        return 0

    emails = await list_active_subscriber_emails(db)
    if not emails:
        return 0

    subject, body = build_publish_email(article)
    sent = 0
    for email in emails:
        try:
            await send_email(subject, body, email)
            sent += 1
        except Exception:
            logger.exception("publish_notification_failed", extra={"subscriber_email": email, "slug": article.slug})
    return sent
