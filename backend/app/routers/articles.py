from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy import select, update
from sqlalchemy.ext.asyncio import AsyncSession

from app.deps import get_db
from app.models.article import Article, ArticleStatus
from app.schemas.article import ArticleDetail, ArticleListResponse, ArticleSummary
from app.services.article import list_articles


router = APIRouter()


@router.get("", response_model=ArticleListResponse)
async def get_articles(
    page: int = Query(1, ge=1),
    limit: int = Query(10, ge=1, le=100),
    category: str | None = None,
    search: str | None = None,
    db: AsyncSession = Depends(get_db),
) -> ArticleListResponse:
    articles, total, pages = await list_articles(db, page, limit, category, search, ArticleStatus.published)
    return ArticleListResponse(articles=articles, total=total, page=page, pages=pages)


@router.get("/{slug}", response_model=ArticleDetail)
async def get_article(slug: str, db: AsyncSession = Depends(get_db)) -> Article:
    result = await db.execute(select(Article).where(Article.slug == slug, Article.status == ArticleStatus.published))
    article = result.scalar_one_or_none()
    if article is None:
        raise HTTPException(status_code=404, detail="Article not found")
    await db.execute(update(Article).where(Article.id == article.id).values(views=Article.views + 1))
    await db.commit()
    await db.refresh(article)
    return article


@router.get("/{slug}/related", response_model=list[ArticleSummary])
async def get_related_articles(slug: str, db: AsyncSession = Depends(get_db)) -> list[Article]:
    result = await db.execute(select(Article).where(Article.slug == slug, Article.status == ArticleStatus.published))
    article = result.scalar_one_or_none()
    if article is None:
        raise HTTPException(status_code=404, detail="Article not found")

    related = await db.execute(
        select(Article)
        .where(
            Article.slug != slug,
            Article.status == ArticleStatus.published,
            Article.category == article.category,
        )
        .order_by(Article.published_at.desc().nullslast(), Article.created_at.desc())
        .limit(3)
    )
    return list(related.scalars().all())

