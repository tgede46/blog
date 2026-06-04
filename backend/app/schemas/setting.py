from pydantic import BaseModel


class SettingsOut(BaseModel):
    site_name: str = "Blog"
    site_description: str = ""


class SettingsUpdate(BaseModel):
    site_name: str | None = None
    site_description: str | None = None

