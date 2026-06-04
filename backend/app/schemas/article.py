from datetime import datetime
from typing import Literal
from uuid import UUID

from pydantic import BaseModel, ConfigDict, Field, computed_field

from app.models.article import ArticleStatus


class ContentBlock(BaseModel):
    type: Literal["paragraph", "heading", "code", "callout", "image"]
    text: str | None = None
    code: str | None = None
    filename: str | None = None
    caption: str | None = None


class ArticleCreate(BaseModel):
    title: str = Field(min_length=1, max_length=255)
    excerpt: str = Field(min_length=1)
    content: list[ContentBlock]
    category: str = Field(min_length=1, max_length=120)
    tag: str = Field(min_length=1, max_length=80)
    status: ArticleStatus = ArticleStatus.draft
    read_minutes: int = Field(default=5, ge=1)


class ArticleUpdate(BaseModel):
    title: str | None = Field(default=None, min_length=1, max_length=255)
    excerpt: str | None = Field(default=None, min_length=1)
    content: list[ContentBlock] | None = None
    category: str | None = Field(default=None, min_length=1, max_length=120)
    tag: str | None = Field(default=None, min_length=1, max_length=80)
    status: ArticleStatus | None = None
    read_minutes: int | None = Field(default=None, ge=1)


class ArticleSummary(BaseModel):
    slug: str
    title: str
    excerpt: str
    tag: str
    read_minutes: int = Field(exclude=True)
    published_at: datetime | None = Field(default=None, exclude=True)
    created_at: datetime = Field(exclude=True)

    model_config = ConfigDict(from_attributes=True)

    @computed_field
    @property
    def date(self) -> str:
        value = self.published_at or self.created_at
        return value.date().isoformat()

    @computed_field
    @property
    def minutes(self) -> str:
        return f"{self.read_minutes} min"


class ArticleDetail(ArticleSummary):
    category: str
    content: list[ContentBlock]

    @computed_field
    @property
    def intro(self) -> str:
        return self.excerpt


class ArticleListResponse(BaseModel):
    articles: list[ArticleSummary]
    total: int
    page: int
    pages: int


class PostOut(ArticleDetail):
    id: UUID
    status: ArticleStatus
    updated_at: datetime


class PostListResponse(BaseModel):
    posts: list[PostOut]
    total: int


class DeleteResponse(BaseModel):
    success: bool = True
