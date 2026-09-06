import html
import logging

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.config import settings
from app.database import utc_now
from app.models.article import Article
from app.models.subscriber import Subscriber
from app.services.email import build_brutalist_email, send_email, smtp_configured

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


def build_publish_email(article: Article) -> tuple[str, str, str]:
    url = article_public_url(article.slug)
    title = article.title
    excerpt = article.excerpt
    subject = f"Nouvel article : {title}"

    text_body = (
        f"Bonjour,\n\n"
        f"Un nouvel article vient d’être publié.\n\n"
        f"{title}\n\n"
        f"{excerpt}\n\n"
        f"Lire l’article :\n{url}\n\n"
        f"— Gedeon Kpara"
    )

    safe_excerpt = html.escape(excerpt)
    safe_url = html.escape(url, quote=True)
    body_html = f"""
              <p style="margin:0 0 24px;font-size:16px;line-height:1.7;color:#4b5563;">{safe_excerpt}</p>
              <a href="{safe_url}" style="display:inline-block;padding:14px 22px;border:3px solid #212121;background:#d0bcff;color:#212121;text-decoration:none;font-size:14px;font-weight:900;letter-spacing:.06em;text-transform:uppercase;box-shadow:4px 4px 0 #212121;">Lire l’article</a>
              <p style="margin:18px 0 0;font-size:12px;line-height:1.6;color:#6b7280;word-break:break-all;">
                Ou ouvre ce lien :<br />
                <a href="{safe_url}" style="color:#6b38d4;">{safe_url}</a>
              </p>
    """
    html_body = build_brutalist_email(
        title=title,
        badge="Nouvel article",
        badge_bg="#DCFCE7",
        body_html=body_html,
    )
    return subject, text_body, html_body


async def notify_subscribers_of_article(db: AsyncSession, article: Article) -> int:
    if not smtp_configured():
        logger.info("publish_notification_skipped", extra={"reason": "smtp_not_configured", "slug": article.slug})
        return 0

    emails = await list_active_subscriber_emails(db)
    if not emails:
        return 0

    subject, text_body, html_body = build_publish_email(article)
    sent = 0
    for email in emails:
        try:
            await send_email(subject, text_body, email, html_body=html_body)
            sent += 1
        except Exception:
            logger.exception("publish_notification_failed", extra={"subscriber_email": email, "slug": article.slug})
    return sent
