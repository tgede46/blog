from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from app.deps import get_db
from app.schemas.setting import SettingsOut
from app.services.setting import get_settings_values

router = APIRouter()


@router.get("", response_model=SettingsOut)
async def get_public_settings(db: AsyncSession = Depends(get_db)) -> SettingsOut:
    return await get_settings_values(db)
