from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from app.deps import get_db, require_admin
from app.models.user import User
from app.schemas.setting import SettingsOut, SettingsUpdate
from app.services.setting import get_settings_values, update_settings_values

router = APIRouter()


@router.get("", response_model=SettingsOut)
async def get_settings(
    db: AsyncSession = Depends(get_db),
    _: User = Depends(require_admin),
) -> SettingsOut:
    return await get_settings_values(db)


@router.put("", response_model=SettingsOut)
async def update_settings(
    payload: SettingsUpdate,
    db: AsyncSession = Depends(get_db),
    _: User = Depends(require_admin),
) -> SettingsOut:
    return await update_settings_values(db, payload)

