from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.database import utc_now
from app.models.subscriber import Subscriber


async def subscribe(db: AsyncSession, email: str) -> tuple[Subscriber, bool]:
    result = await db.execute(select(Subscriber).where(Subscriber.email == email))
    subscriber = result.scalar_one_or_none()
    if subscriber:
        if subscriber.unsubscribed_at is not None:
            subscriber.unsubscribed_at = None
            subscriber.subscribed_at = utc_now()
            await db.commit()
            await db.refresh(subscriber)
        return subscriber, False

    subscriber = Subscriber(email=email)
    db.add(subscriber)
    await db.commit()
    await db.refresh(subscriber)
    return subscriber, True


async def unsubscribe(db: AsyncSession, email: str) -> bool:
    result = await db.execute(select(Subscriber).where(Subscriber.email == email))
    subscriber = result.scalar_one_or_none()
    if subscriber is None:
        return False
    subscriber.unsubscribed_at = utc_now()
    await db.commit()
    return True

