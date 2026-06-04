from pathlib import Path
from uuid import uuid4

from fastapi import UploadFile
from sqlalchemy.ext.asyncio import AsyncSession

from app.config import settings
from app.models.media import MediaFile
from app.models.user import User


async def save_upload(db: AsyncSession, file: UploadFile, user: User) -> MediaFile:
    upload_dir = Path(settings.upload_dir)
    upload_dir.mkdir(parents=True, exist_ok=True)

    suffix = Path(file.filename or "").suffix
    stored_name = f"{uuid4()}{suffix}"
    destination = upload_dir / stored_name

    size = 0
    with destination.open("wb") as buffer:
        while chunk := await file.read(1024 * 1024):
            size += len(chunk)
            buffer.write(chunk)

    media = MediaFile(
        url=f"/uploads/{stored_name}",
        filename=file.filename or stored_name,
        size=size,
        mime_type=file.content_type or "application/octet-stream",
        uploaded_by=user.id,
    )
    db.add(media)
    await db.commit()
    await db.refresh(media)
    return media

