from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession

from app.deps import get_db
from app.schemas.contact import ContactRequest, ContactResponse
from app.services.contact import deliver_contact
from app.services.setting import get_settings_values


router = APIRouter()


@router.post("", response_model=ContactResponse, status_code=202)
async def send_contact(
    payload: ContactRequest,
    db: AsyncSession = Depends(get_db),
) -> ContactResponse:
    public_settings = await get_settings_values(db)
    try:
        await deliver_contact(payload, str(public_settings.contact_email) if public_settings.contact_email else None)
    except Exception as exc:
        raise HTTPException(status_code=503, detail="Contact delivery is temporarily unavailable") from exc
    return ContactResponse()
