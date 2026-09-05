from fastapi import APIRouter, Depends, HTTPException, Response, status
from app.config import settings
from sqlalchemy.ext.asyncio import AsyncSession

from app.deps import get_current_user, get_db
from app.models.user import User
from app.schemas.auth import LoginRequest, MessageResponse, TokenResponse, UserOut
from app.services.auth import authenticate_user, create_access_token


router = APIRouter()


@router.post("/login", response_model=TokenResponse)
async def login(payload: LoginRequest, response: Response, db: AsyncSession = Depends(get_db)) -> TokenResponse:
    user = await authenticate_user(db, payload.email, payload.password)
    if user is None:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid email or password")

    token = create_access_token(user.id)
    response.set_cookie(
        key=settings.auth_cookie_name,
        value=token,
        max_age=settings.access_token_expire_minutes * 60,
        httponly=True,
        secure=settings.cookie_secure,
        samesite=settings.effective_cookie_samesite,
        domain=settings.cookie_domain,
        path="/",
    )
    return TokenResponse(access_token=token, user=UserOut.model_validate(user))


@router.post("/logout", response_model=MessageResponse)
async def logout(response: Response, _: User = Depends(get_current_user)) -> MessageResponse:
    response.delete_cookie(
        settings.auth_cookie_name,
        domain=settings.cookie_domain,
        path="/",
        secure=settings.cookie_secure,
        httponly=True,
        samesite=settings.effective_cookie_samesite,
    )
    return MessageResponse(message="ok")


@router.get("/me", response_model=UserOut)
async def me(user: User = Depends(get_current_user)) -> User:
    return user

