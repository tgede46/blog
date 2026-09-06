from fastapi import APIRouter, Depends
from sqlalchemy import func, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.deps import get_db, require_editor
from app.models.article import Article, ArticleStatus
from app.models.subscriber import Subscriber
from app.models.user import User, UserRole
from app.schemas.stats import ActivityItem, StatsResponse

router = APIRouter()


@router.get("", response_model=StatsResponse)
async def get_stats(
    db: AsyncSession = Depends(get_db),
    _: User = Depends(require_editor),
) -> StatsResponse:
    subscribers = await db.scalar(select(func.count()).select_from(Subscriber).where(Subscriber.unsubscribed_at.is_(None))) or 0
    admins = await db.scalar(select(func.count()).select_from(User).where(User.role == UserRole.admin)) or 0
    editors = await db.scalar(select(func.count()).select_from(User).where(User.role == UserRole.editor)) or 0
    drafts = await db.scalar(select(func.count()).select_from(Article).where(Article.status == ArticleStatus.draft)) or 0
    published = await db.scalar(select(func.count()).select_from(Article).where(Article.status == ArticleStatus.published)) or 0
    total_views = await db.scalar(select(func.coalesce(func.sum(Article.views), 0))) or 0

    recent_result = await db.execute(select(Article).order_by(Article.created_at.desc()).limit(5))
    recent_posts = list(recent_result.scalars().all())
    activity = [
        ActivityItem(type="post", label=f"Post updated: {post.title}", created_at=post.updated_at)
        for post in recent_posts
    ]

    return StatsResponse(
        total_views=total_views,
        total_users=admins + editors + subscribers,
        admins=admins,
        editors=editors,
        subscribers=subscribers,
        drafts=drafts,
        published=published,
        recent_posts=recent_posts,
        activity=activity,
    )
