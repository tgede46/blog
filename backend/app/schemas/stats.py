from datetime import datetime

from pydantic import BaseModel

from app.schemas.article import PostOut


class ActivityItem(BaseModel):
    type: str
    label: str
    created_at: datetime


class StatsResponse(BaseModel):
    total_views: int
    subscribers: int
    drafts: int
    published: int
    recent_posts: list[PostOut]
    activity: list[ActivityItem]

