import asyncio
from pathlib import Path
from uuid import uuid4

from fastapi import HTTPException, UploadFile
from sqlalchemy.ext.asyncio import AsyncSession

from app.config import settings
from app.models.media import MediaFile
from app.models.user import User


async def save_upload(db: AsyncSession, file: UploadFile, user: User) -> MediaFile:
    upload_dir = Path(settings.upload_dir)
    upload_dir.mkdir(parents=True, exist_ok=True)

    suffix = Path(file.filename or "").suffix.lower()
    mime_type = (file.content_type or "").lower()
    if suffix not in settings.upload_extensions or mime_type not in settings.upload_mime_types:
        raise HTTPException(status_code=415, detail="Unsupported media type")
    stored_name = f"{uuid4()}{suffix}"
    destination = upload_dir / stored_name

    size = 0
    try:
        with destination.open("wb") as buffer:
            while chunk := await file.read(1024 * 1024):
                size += len(chunk)
                if size > settings.max_upload_bytes:
                    raise HTTPException(status_code=413, detail="File is too large")
                buffer.write(chunk)
        url = f"/uploads/{stored_name}"
        if settings.s3_bucket:
            import boto3

            key = f"media/{stored_name}"
            client = boto3.client(
                "s3",
                region_name=settings.s3_region,
                endpoint_url=settings.s3_endpoint_url,
                aws_access_key_id=settings.aws_access_key_id,
                aws_secret_access_key=settings.aws_secret_access_key,
            )
            await asyncio.to_thread(
                client.upload_file,
                str(destination),
                settings.s3_bucket,
                key,
                ExtraArgs={"ContentType": mime_type},
            )
            base_url = settings.s3_public_base_url or (
                f"https://{settings.s3_bucket}.s3.{settings.s3_region}.amazonaws.com"
                if settings.s3_region
                else f"https://{settings.s3_bucket}.s3.amazonaws.com"
            )
            url = f"{base_url.rstrip('/')}/{key}"
            destination.unlink(missing_ok=True)
    except Exception:
        destination.unlink(missing_ok=True)
        raise

    media = MediaFile(
        url=url,
        filename=file.filename or stored_name,
        size=size,
        mime_type=mime_type,
        uploaded_by=user.id,
    )
    db.add(media)
    await db.commit()
    await db.refresh(media)
    return media


async def delete_stored_media(media: MediaFile) -> None:
    if media.url.startswith("/uploads/"):
        (Path(settings.upload_dir) / Path(media.url).name).unlink(missing_ok=True)
        return
    if settings.s3_bucket and "/media/" in media.url:
        import boto3

        key = f"media/{media.url.rsplit('/media/', 1)[1]}"
        client = boto3.client(
            "s3",
            region_name=settings.s3_region,
            endpoint_url=settings.s3_endpoint_url,
            aws_access_key_id=settings.aws_access_key_id,
            aws_secret_access_key=settings.aws_secret_access_key,
        )
        await asyncio.to_thread(client.delete_object, Bucket=settings.s3_bucket, Key=key)

