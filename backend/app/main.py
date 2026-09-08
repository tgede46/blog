import logging
from contextlib import asynccontextmanager
from pathlib import Path

from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from fastapi.staticfiles import StaticFiles
from sqlalchemy import text

from app.config import settings
from app.database import SessionLocal
from app.logging_config import configure_logging
from app.middleware import RateLimitMiddleware
from app.routers import articles, auth, contact, newsletter
from app.routers import settings as public_settings
from app.routers.admin import media, posts, stats
from app.routers.admin import settings as admin_settings

configure_logging()
logger = logging.getLogger(__name__)


@asynccontextmanager
async def lifespan(application: FastAPI):
    try:
        async with SessionLocal() as db:
            await db.execute(text("SELECT 1"))
        logger.info("database_connection_ok")
    except Exception:
        logger.exception("database_startup_check_failed")
    yield


app = FastAPI(title="Blog API", version="1.0.0", lifespan=lifespan)
Path(settings.upload_dir).mkdir(parents=True, exist_ok=True)

app.add_middleware(RateLimitMiddleware)
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.mount("/uploads", StaticFiles(directory=settings.upload_dir), name="uploads")

app.include_router(auth.router, prefix="/api/auth", tags=["auth"])
app.include_router(articles.router, prefix="/api/articles", tags=["articles"])
app.include_router(newsletter.router, prefix="/api/newsletter", tags=["newsletter"])
app.include_router(contact.router, prefix="/api/contact", tags=["contact"])
app.include_router(public_settings.router, prefix="/api/settings", tags=["settings"])
app.include_router(posts.router, prefix="/api/admin/posts", tags=["admin-posts"])
app.include_router(media.router, prefix="/api/admin/media", tags=["admin-media"])
app.include_router(stats.router, prefix="/api/admin/stats", tags=["admin-stats"])
app.include_router(admin_settings.router, prefix="/api/admin/settings", tags=["admin-settings"])


@app.exception_handler(Exception)
async def unhandled_exception_handler(request: Request, exc: Exception) -> JSONResponse:
    logger.exception("unhandled_exception", extra={"method": request.method, "path": request.url.path})
    return JSONResponse(status_code=500, content={"detail": "Internal server error"})


@app.get("/health")
@app.get("/health/live")
async def health_live() -> dict[str, str]:
    return {"status": "ok"}


@app.get("/health/ready")
async def health_ready() -> JSONResponse:
    try:
        async with SessionLocal() as db:
            await db.execute(text("SELECT 1"))
    except Exception:
        logger.exception("database_readiness_failed")
        return JSONResponse(status_code=503, content={"status": "unavailable", "database": "down"})
    return JSONResponse(content={"status": "ok", "database": "up"})
