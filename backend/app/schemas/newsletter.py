from pydantic import BaseModel, EmailStr


class NewsletterRequest(BaseModel):
    email: EmailStr


class SubscribeResponse(BaseModel):
    success: bool
    message: str


class UnsubscribeResponse(BaseModel):
    success: bool

