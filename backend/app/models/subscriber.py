from datetime import datetime

from sqlalchemy import DateTime, String
from sqlalchemy.orm import Mapped, mapped_column

from app.database import Base, UUIDPrimaryKeyMixin, utc_now


class Subscriber(UUIDPrimaryKeyMixin, Base):
    __tablename__ = "subscribers"

    email: Mapped[str] = mapped_column(String(255), unique=True, index=True, nullable=False)
    subscribed_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=utc_now, nullable=False)
    unsubscribed_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True), nullable=True)

