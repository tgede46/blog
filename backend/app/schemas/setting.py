from pydantic import BaseModel, EmailStr, Field, HttpUrl


class SettingsOut(BaseModel):
    site_name: str = "Blog"
    site_description: str = ""
    author_name: str = "Gedeon Kpara"
    author_bio: str = ""
    hero_title: str = ""
    hero_description: str = ""
    about_content: str = ""
    contact_email: EmailStr | None = None
    github_url: HttpUrl | None = None
    linkedin_url: HttpUrl | None = None
    x_url: HttpUrl | None = None
    legal_name: str = ""
    address: str = ""
    legal_content: str = ""


class SettingsUpdate(BaseModel):
    site_name: str | None = Field(default=None, min_length=1, max_length=120)
    site_description: str | None = Field(default=None, max_length=500)
    author_name: str | None = Field(default=None, min_length=1, max_length=120)
    author_bio: str | None = Field(default=None, max_length=2000)
    hero_title: str | None = Field(default=None, max_length=200)
    hero_description: str | None = Field(default=None, max_length=1000)
    about_content: str | None = Field(default=None, max_length=20000)
    contact_email: EmailStr | None = None
    github_url: HttpUrl | None = None
    linkedin_url: HttpUrl | None = None
    x_url: HttpUrl | None = None
    legal_name: str | None = Field(default=None, max_length=200)
    address: str | None = Field(default=None, max_length=500)
    legal_content: str | None = Field(default=None, max_length=50000)

