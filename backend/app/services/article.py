from math import ceil
from uuid import UUID

from slugify import slugify
from sqlalchemy import Select, func, or_, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.database import utc_now
from app.models.article import Article, ArticleStatus
from app.models.user import User
from app.schemas.article import ArticleCreate, ArticleUpdate


def _content_to_dicts(content: list) -> list[dict]:
    return [block.model_dump(exclude_none=True) for block in content]


async def generate_unique_slug(db: AsyncSession, title: str, article_id: UUID | None = None) -> str:
    base_slug = slugify(title) or "article"
    slug = base_slug
    index = 2
    while True:
        stmt = select(Article.id).where(Article.slug == slug)
        if article_id is not None:
            stmt = stmt.where(Article.id != article_id)
        existing = await db.scalar(stmt)
        if existing is None:
            return slug
        slug = f"{base_slug}-{index}"
        index += 1


def apply_article_filters(
    stmt: Select,
    category: str | None = None,
    search: str | None = None,
    status: ArticleStatus | None = None,
) -> Select:
    if category:
        stmt = stmt.where(Article.category == category)
    if status:
        stmt = stmt.where(Article.status == status)
    if search:
        pattern = f"%{search}%"
        stmt = stmt.where(or_(Article.title.ilike(pattern), Article.excerpt.ilike(pattern), Article.category.ilike(pattern)))
    return stmt


async def list_articles(
    db: AsyncSession,
    page: int,
    limit: int,
    category: str | None = None,
    search: str | None = None,
    status: ArticleStatus | None = ArticleStatus.published,
) -> tuple[list[Article], int, int]:
    base = apply_article_filters(select(Article), category=category, search=search, status=status)
    total = await db.scalar(select(func.count()).select_from(base.subquery())) or 0
    pages = ceil(total / limit) if total else 0
    result = await db.execute(
        base.order_by(Article.published_at.desc().nullslast(), Article.created_at.desc())
        .offset((page - 1) * limit)
        .limit(limit)
    )
    return list(result.scalars().all()), total, pages


async def create_article(db: AsyncSession, data: ArticleCreate, author: User) -> Article:
    published_at = utc_now() if data.status == ArticleStatus.published else None
    article = Article(
        slug=await generate_unique_slug(db, data.slug or data.title),
        title=data.title,
        excerpt=data.excerpt,
        content=_content_to_dicts(data.content),
        category=data.category,
        tag=data.tag,
        author_id=author.id,
        status=data.status,
        read_minutes=data.read_minutes,
        published_at=published_at,
    )
    db.add(article)
    await db.commit()
    await db.refresh(article)
    return article


async def update_article(db: AsyncSession, article: Article, data: ArticleUpdate) -> Article:
    changes = data.model_dump(exclude_unset=True)
    if "content" in changes and data.content is not None:
        changes["content"] = _content_to_dicts(data.content)
    if data.slug:
        changes["slug"] = await generate_unique_slug(db, data.slug, article.id)
    elif "title" in changes and data.title:
        changes["slug"] = await generate_unique_slug(db, data.title, article.id)
    if changes.get("status") == ArticleStatus.published and article.published_at is None:
        changes["published_at"] = utc_now()
    if changes.get("status") == ArticleStatus.draft:
        changes["published_at"] = None

    for key, value in changes.items():
        setattr(article, key, value)
    await db.commit()
    await db.refresh(article)
    return article

