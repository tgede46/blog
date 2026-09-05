from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.setting import Setting
from app.schemas.setting import SettingsOut, SettingsUpdate

DEFAULT_SETTINGS = {
    "site_name": "Blog",
    "site_description": "",
    "author_name": "Gedeon Kpara",
    "author_bio": "",
    "hero_title": "Apprenez le Java, TypeScript et Python à travers différents articles",
    "hero_description": "",
    "about_content": "",
    "contact_email": None,
    "github_url": "https://github.com/tgede46/",
    "linkedin_url": "https://linkedin.com/in/g%C3%A9d%C3%A9on-kpara",
    "x_url": "https://x.com/kparaGedeon",
    "legal_name": "",
    "address": "",
    "legal_content": "",
}


async def get_settings_values(db: AsyncSession) -> SettingsOut:
    result = await db.execute(select(Setting).where(Setting.key.in_(DEFAULT_SETTINGS.keys())))
    values = DEFAULT_SETTINGS | {setting.key: setting.value for setting in result.scalars().all()}
    return SettingsOut(**values)


async def update_settings_values(db: AsyncSession, data: SettingsUpdate) -> SettingsOut:
    changes = data.model_dump(exclude_unset=True)
    for key, value in changes.items():
        setting = await db.get(Setting, key)
        if value is None:
            if setting is not None:
                await db.delete(setting)
            continue
        value = str(value)
        if setting is None:
            db.add(Setting(key=key, value=value))
        else:
            setting.value = value
    await db.commit()
    return await get_settings_values(db)

