from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from app.deps import get_db
from app.schemas.newsletter import NewsletterRequest, SubscribeResponse, UnsubscribeResponse
from app.services.newsletter import subscribe, unsubscribe


router = APIRouter()


@router.post("/subscribe", response_model=SubscribeResponse)
async def subscribe_to_newsletter(
    payload: NewsletterRequest,
    db: AsyncSession = Depends(get_db),
) -> SubscribeResponse:
    _, created = await subscribe(db, payload.email)
    message = "subscribed" if created else "already subscribed"
    return SubscribeResponse(success=True, message=message)


@router.post("/unsubscribe", response_model=UnsubscribeResponse)
async def unsubscribe_from_newsletter(
    payload: NewsletterRequest,
    db: AsyncSession = Depends(get_db),
) -> UnsubscribeResponse:
    success = await unsubscribe(db, payload.email)
    return UnsubscribeResponse(success=success)

