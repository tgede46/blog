from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.deps import get_db, get_current_user
from app.models.article import Article, ArticleStatus
from app.models.user import User
from app.schemas.article import ArticleCreate, ArticleUpdate, DeleteResponse, PostListResponse, PostOut
from app.services.article import create_article, list_articles, update_article


router = APIRouter()


@router.get("", response_model=PostListResponse)
async def get_posts(
    page: int = Query(1, ge=1),
    limit: int = Query(10, ge=1, le=100),
    status: ArticleStatus | None = None,
    search: str | None = None,
    db: AsyncSession = Depends(get_db),
    _: User = Depends(get_current_user),
) -> PostListResponse:
    posts, total, _ = await list_articles(db, page, limit, search=search, status=status)
    return PostListResponse(posts=posts, total=total)


@router.post("", response_model=PostOut, status_code=201)
async def create_post(
    payload: ArticleCreate,
    db: AsyncSession = Depends(get_db),
    user: User = Depends(get_current_user),
) -> Article:
    return await create_article(db, payload, user)


@router.put("/{post_id}", response_model=PostOut)
async def update_post(
    post_id: UUID,
    payload: ArticleUpdate,
    db: AsyncSession = Depends(get_db),
    _: User = Depends(get_current_user),
) -> Article:
    article = await db.get(Article, post_id)
    if article is None:
        raise HTTPException(status_code=404, detail="Post not found")
    return await update_article(db, article, payload)


@router.delete("/{post_id}", response_model=DeleteResponse)
async def delete_post(
    post_id: UUID,
    db: AsyncSession = Depends(get_db),
    _: User = Depends(get_current_user),
) -> DeleteResponse:
    article = await db.get(Article, post_id)
    if article is None:
        raise HTTPException(status_code=404, detail="Post not found")
    await db.delete(article)
    await db.commit()
    return DeleteResponse()

