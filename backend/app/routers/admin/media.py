from pathlib import Path
from uuid import UUID

from fastapi import APIRouter, Depends, File, HTTPException, UploadFile
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.config import settings
from app.deps import get_current_user, get_db
from app.models.media import MediaFile
from app.models.user import User
from app.schemas.article import DeleteResponse
from app.schemas.media import MediaListResponse, MediaOut, MediaUploadResponse
from app.services.media import save_upload


router = APIRouter()


@router.get("", response_model=MediaListResponse)
async def get_media(
    db: AsyncSession = Depends(get_db),
    _: User = Depends(get_current_user),
) -> MediaListResponse:
    result = await db.execute(select(MediaFile).order_by(MediaFile.created_at.desc()))
    return MediaListResponse(media=list(result.scalars().all()))


@router.post("/upload", response_model=MediaUploadResponse, status_code=201)
async def upload_media(
    file: UploadFile = File(...),
    db: AsyncSession = Depends(get_db),
    user: User = Depends(get_current_user),
) -> MediaFile:
    return await save_upload(db, file, user)


@router.delete("/{media_id}", response_model=DeleteResponse)
async def delete_media(
    media_id: UUID,
    db: AsyncSession = Depends(get_db),
    _: User = Depends(get_current_user),
) -> DeleteResponse:
    media = await db.get(MediaFile, media_id)
    if media is None:
        raise HTTPException(status_code=404, detail="Media not found")

    if media.url.startswith("/uploads/"):
        path = Path(settings.upload_dir) / Path(media.url).name
        path.unlink(missing_ok=True)

    await db.delete(media)
    await db.commit()
    return DeleteResponse()

