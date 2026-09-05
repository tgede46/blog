from datetime import datetime
from enum import StrEnum
from typing import Any
from uuid import UUID

from sqlalchemy import JSON, DateTime, Enum, ForeignKey, Integer, String, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database import Base, UpdatedTimestampMixin, UUIDPrimaryKeyMixin


class ArticleStatus(StrEnum):
    published = "published"
    draft = "draft"


class Article(UUIDPrimaryKeyMixin, UpdatedTimestampMixin, Base):
    __tablename__ = "articles"

    slug: Mapped[str] = mapped_column(String(255), unique=True, index=True, nullable=False)
    title: Mapped[str] = mapped_column(String(255), nullable=False)
    excerpt: Mapped[str] = mapped_column(Text, nullable=False)
    content: Mapped[list[dict[str, Any]]] = mapped_column(JSON, nullable=False, default=list)
    category: Mapped[str] = mapped_column(String(120), index=True, nullable=False)
    tag: Mapped[str] = mapped_column(String(80), nullable=False)
    author_id: Mapped[UUID] = mapped_column(ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    status: Mapped[ArticleStatus] = mapped_column(
        Enum(ArticleStatus, name="article_status"),
        default=ArticleStatus.draft,
        index=True,
        nullable=False,
    )
    read_minutes: Mapped[int] = mapped_column(Integer, default=5, nullable=False)
    views: Mapped[int] = mapped_column(Integer, default=0, nullable=False)
    published_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True), nullable=True)

    author = relationship("User", back_populates="articles")

