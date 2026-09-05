from datetime import datetime
from typing import Annotated, Literal
from uuid import UUID

from pydantic import BaseModel, ConfigDict, Field, computed_field

from app.models.article import ArticleStatus


class StrictBlock(BaseModel):
    model_config = ConfigDict(extra="forbid")


class ParagraphBlock(StrictBlock):
    type: Literal["paragraph"]
    text: str = Field(min_length=1)


class HeadingBlock(StrictBlock):
    type: Literal["heading"]
    text: str = Field(min_length=1)


class CalloutBlock(StrictBlock):
    type: Literal["callout"]
    text: str = Field(min_length=1)


class CodeBlock(StrictBlock):
    type: Literal["code"]
    code: str = Field(min_length=1)
    filename: str | None = None


class ImageBlock(StrictBlock):
    type: Literal["image"]
    text: str = Field(min_length=1)
    caption: str | None = None


ContentBlock = Annotated[
    ParagraphBlock | HeadingBlock | CalloutBlock | CodeBlock | ImageBlock,
    Field(discriminator="type"),
]


class ArticleCreate(BaseModel):
    title: str = Field(min_length=1, max_length=255)
    slug: str | None = Field(default=None, min_length=1, max_length=255, pattern=r"^[a-z0-9]+(?:-[a-z0-9]+)*$")
    excerpt: str = Field(min_length=1)
    content: list[ContentBlock] = Field(min_length=1)
    category: str = Field(min_length=1, max_length=120)
    tag: str = Field(min_length=1, max_length=80)
    status: ArticleStatus = ArticleStatus.draft
    read_minutes: int = Field(default=5, ge=1)


class ArticleUpdate(BaseModel):
    title: str | None = Field(default=None, min_length=1, max_length=255)
    slug: str | None = Field(default=None, min_length=1, max_length=255, pattern=r"^[a-z0-9]+(?:-[a-z0-9]+)*$")
    excerpt: str | None = Field(default=None, min_length=1)
    content: list[ContentBlock] | None = Field(default=None, min_length=1)
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
    views: int = 0

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
    categories: list[str] = Field(default_factory=list)


class PostOut(ArticleDetail):
    id: UUID
    status: ArticleStatus
    updated_at: datetime


class PostListResponse(BaseModel):
    posts: list[PostOut]
    total: int


class DeleteResponse(BaseModel):
    success: bool = True
