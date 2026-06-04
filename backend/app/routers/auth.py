from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.deps import get_current_user, get_db
from app.models.user import User
from app.schemas.auth import LoginRequest, MessageResponse, TokenResponse, UserOut
from app.services.auth import authenticate_user, create_access_token


router = APIRouter()


@router.post("/login", response_model=TokenResponse)
async def login(payload: LoginRequest, db: AsyncSession = Depends(get_db)) -> TokenResponse:
    user = await authenticate_user(db, payload.email, payload.password)
    if user is None:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid email or password")

    return TokenResponse(access_token=create_access_token(user.id), user=UserOut.model_validate(user))


@router.post("/logout", response_model=MessageResponse)
async def logout(_: User = Depends(get_current_user)) -> MessageResponse:
    return MessageResponse(message="ok")


@router.get("/me", response_model=UserOut)
async def me(user: User = Depends(get_current_user)) -> User:
    return user

