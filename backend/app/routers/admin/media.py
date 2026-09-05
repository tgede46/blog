from uuid import UUID

from fastapi import APIRouter, Depends, File, HTTPException, UploadFile
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.deps import get_db, require_editor
from app.models.media import MediaFile
from app.models.user import User
from app.schemas.article import DeleteResponse
from app.schemas.media import MediaListResponse, MediaOut, MediaUploadResponse
from app.services.media import delete_stored_media, save_upload


router = APIRouter()


@router.get("", response_model=MediaListResponse)
async def get_media(
    db: AsyncSession = Depends(get_db),
    _: User = Depends(require_editor),
) -> MediaListResponse:
    result = await db.execute(select(MediaFile).order_by(MediaFile.created_at.desc()))
    return MediaListResponse(media=list(result.scalars().all()))


@router.post("/upload", response_model=MediaUploadResponse, status_code=201)
async def upload_media(
    file: UploadFile = File(...),
    db: AsyncSession = Depends(get_db),
    user: User = Depends(require_editor),
) -> MediaFile:
    return await save_upload(db, file, user)


@router.delete("/{media_id}", response_model=DeleteResponse)
async def delete_media(
    media_id: UUID,
    db: AsyncSession = Depends(get_db),
    _: User = Depends(require_editor),
) -> DeleteResponse:
    media = await db.get(MediaFile, media_id)
    if media is None:
        raise HTTPException(status_code=404, detail="Media not found")

    await delete_stored_media(media)
    await db.delete(media)
    await db.commit()
    return DeleteResponse()

