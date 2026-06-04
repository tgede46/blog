import argparse
import asyncio
import sys
from pathlib import Path

sys.path.append(str(Path(__file__).resolve().parents[1]))

from sqlalchemy import select

from app.database import SessionLocal
from app.models.user import User, UserRole
from app.services.auth import hash_password


async def create_admin(email: str, password: str, name: str) -> None:
    async with SessionLocal() as db:
        result = await db.execute(select(User).where(User.email == email))
        user = result.scalar_one_or_none()
        if user is None:
            db.add(
                User(
                    email=email,
                    password_hash=hash_password(password),
                    name=name,
                    role=UserRole.admin,
                )
            )
            await db.commit()
            print(f"Admin created: {email}")
            return

        user.password_hash = hash_password(password)
        user.name = name
        user.role = UserRole.admin
        await db.commit()
        print(f"Admin updated: {email}")


def main() -> None:
    parser = argparse.ArgumentParser(description="Create or update an admin user.")
    parser.add_argument("--email", required=True)
    parser.add_argument("--password", required=True)
    parser.add_argument("--name", default="Admin")
    args = parser.parse_args()

    asyncio.run(create_admin(args.email, args.password, args.name))


if __name__ == "__main__":
    main()
