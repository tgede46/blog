from pathlib import Path

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

from app.config import settings
from app.routers import articles, auth, newsletter
from app.routers.admin import media, posts, settings as admin_settings, stats


app = FastAPI(title="Blog API", version="1.0.0")
Path(settings.upload_dir).mkdir(parents=True, exist_ok=True)

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
app.include_router(posts.router, prefix="/api/admin/posts", tags=["admin-posts"])
app.include_router(media.router, prefix="/api/admin/media", tags=["admin-media"])
app.include_router(stats.router, prefix="/api/admin/stats", tags=["admin-stats"])
app.include_router(admin_settings.router, prefix="/api/admin/settings", tags=["admin-settings"])


@app.get("/health")
async def health() -> dict[str, str]:
    return {"status": "ok"}
