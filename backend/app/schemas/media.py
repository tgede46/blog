from datetime import datetime
from uuid import UUID

from pydantic import BaseModel, ConfigDict


class MediaOut(BaseModel):
    id: UUID
    url: str
    filename: str
    size: int
    mime_type: str
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)


class MediaListResponse(BaseModel):
    media: list[MediaOut]


class MediaUploadResponse(BaseModel):
    id: UUID
    url: str
    filename: str

