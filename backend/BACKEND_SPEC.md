# Blog Platform — Backend Specification (FastAPI)

## Stack

| Composant | Choix |
|---|---|
| Framework | FastAPI |
| ORM | SQLAlchemy 2.0 (async) |
| Base de données | PostgreSQL |
| Migrations | Alembic |
| Auth | JWT (python-jose) + bcrypt (passlib) |
| Upload | python-multipart + S3/Cloudinary |
| Email | Resend ou SMTP (fastapi-mail) |
| Validation | Pydantic v2 (intégré à FastAPI) |
| CORS | FastAPI CORSMiddleware |

---

## Structure du projet

```
backend/
├── app/
│   ├── main.py               # Entrée FastAPI, CORS, routers
│   ├── config.py             # Settings (pydantic-settings)
│   ├── database.py           # Engine async SQLAlchemy
│   ├── deps.py               # Dépendances (get_db, get_current_user)
│   │
│   ├── models/               # Tables SQLAlchemy
│   │   ├── user.py
│   │   ├── article.py
│   │   ├── media.py
│   │   ├── subscriber.py
│   │   └── setting.py
│   │
│   ├── schemas/              # Pydantic schemas (request/response)
│   │   ├── auth.py
│   │   ├── article.py
│   │   ├── media.py
│   │   ├── newsletter.py
│   │   └── setting.py
│   │
│   ├── routers/              # Endpoints
│   │   ├── auth.py
│   │   ├── articles.py
│   │   ├── admin/
│   │   │   ├── posts.py
│   │   │   ├── media.py
│   │   │   ├── stats.py
│   │   │   └── settings.py
│   │   └── newsletter.py
│   │
│   └── services/             # Logique métier
│       ├── auth.py
│       ├── article.py
│       ├── media.py
│       └── newsletter.py
│
├── alembic/                  # Migrations
├── tests/
├── .env
├── requirements.txt
└── pyproject.toml
```

---

## Modèles de données (SQLAlchemy)

### User
```python
class User(Base):
    id: UUID
    email: str (unique)
    password_hash: str
    name: str
    avatar_url: str | None
    role: Enum("admin", "editor")
    created_at: datetime
```

### Article
```python
class Article(Base):
    id: UUID
    slug: str (unique)
    title: str
    excerpt: str
    content: JSON          # liste de ContentBlock
    category: str
    tag: str
    author_id: UUID (FK -> User)
    status: Enum("published", "draft")
    read_minutes: int
    published_at: datetime | None
    created_at: datetime
    updated_at: datetime
```

#### ContentBlock (dans article.content JSON)
```python
# type: "paragraph" | "heading" | "code" | "callout" | "image"
{
  "type": "paragraph",
  "text": "..."
}
{
  "type": "code",
  "code": "...",
  "filename": "index.ts"
}
{
  "type": "image",
  "caption": "...",
  "text": "url de l'image"
}
```

### Subscriber (Newsletter)
```python
class Subscriber(Base):
    id: UUID
    email: str (unique)
    subscribed_at: datetime
    unsubscribed_at: datetime | None
```

### MediaFile
```python
class MediaFile(Base):
    id: UUID
    url: str
    filename: str
    size: int              # bytes
    mime_type: str
    uploaded_by: UUID (FK -> User)
    created_at: datetime
```

### Setting
```python
class Setting(Base):
    key: str (PK)
    value: str
# Exemples: site_name, site_description
```

---

## Endpoints API

### Auth — `/api/auth`

```
POST /api/auth/login
  Body:  { email: str, password: str }
  Response: { access_token: str, token_type: "bearer", user: UserOut }

POST /api/auth/logout
  Protected: oui (header Authorization: Bearer <token>)
  Response: { message: "ok" }

GET /api/auth/me
  Protected: oui
  Response: UserOut
```

### Articles (public) — `/api/articles`

```
GET /api/articles
  Query: page=1, limit=10, category?=str, search?=str
  Response: { articles: [ArticleSummary], total: int, page: int, pages: int }

GET /api/articles/{slug}
  Response: ArticleDetail

GET /api/articles/{slug}/related
  Response: [ArticleSummary]
```

### Admin — Posts — `/api/admin/posts`

```
GET /api/admin/posts
  Protected: oui
  Query: page=1, limit=10, status?=str, search?=str
  Response: { posts: [PostOut], total: int }

POST /api/admin/posts
  Protected: oui
  Body: { title, excerpt, content, category, tag, status, read_minutes }
  Response: PostOut

PUT /api/admin/posts/{id}
  Protected: oui
  Body: (même que POST, tous optionnels)
  Response: PostOut

DELETE /api/admin/posts/{id}
  Protected: oui
  Response: { success: true }
```

### Admin — Stats — `/api/admin/stats`

```
GET /api/admin/stats
  Protected: oui
  Response: {
    total_views: int,
    subscribers: int,
    drafts: int,
    published: int,
    recent_posts: [PostOut],
    activity: [ActivityItem]
  }
```

### Admin — Médias — `/api/admin/media`

```
GET /api/admin/media
  Protected: oui
  Response: { media: [MediaOut] }

POST /api/admin/media/upload
  Protected: oui
  Body: multipart/form-data (file)
  Response: { id: UUID, url: str, filename: str }

DELETE /api/admin/media/{id}
  Protected: oui
  Response: { success: true }
```

### Admin — Settings — `/api/admin/settings`

```
GET /api/admin/settings
  Protected: oui
  Response: { site_name: str, site_description: str }

PUT /api/admin/settings
  Protected: oui
  Body: { site_name?: str, site_description?: str }
  Response: { site_name: str, site_description: str }
```

### Newsletter — `/api/newsletter`

```
POST /api/newsletter/subscribe
  Body: { email: str }
  Response: { success: bool, message: str }

POST /api/newsletter/unsubscribe
  Body: { email: str }
  Response: { success: bool }
```

---

## Schémas Pydantic

```python
# schemas/article.py

class ContentBlock(BaseModel):
    type: Literal["paragraph", "heading", "code", "callout", "image"]
    text: str | None = None
    code: str | None = None
    filename: str | None = None
    caption: str | None = None

class ArticleCreate(BaseModel):
    title: str
    excerpt: str
    content: list[ContentBlock]
    category: str
    tag: str
    status: Literal["published", "draft"] = "draft"
    read_minutes: int = 5

class ArticleSummary(BaseModel):
    slug: str
    date: str
    title: str
    excerpt: str
    tag: str
    minutes: str
    model_config = ConfigDict(from_attributes=True)

class ArticleDetail(ArticleSummary):
    category: str
    intro: str
    content: list[ContentBlock]
```

---

## Dépendances (deps.py)

```python
async def get_db() -> AsyncSession:
    async with SessionLocal() as session:
        yield session

async def get_current_user(
    token: str = Depends(oauth2_scheme),
    db: AsyncSession = Depends(get_db)
) -> User:
    # Décoder JWT, vérifier user en DB
    ...

async def require_admin(user: User = Depends(get_current_user)) -> User:
    if user.role != "admin":
        raise HTTPException(status_code=403, detail="Admin only")
    return user
```

---

## main.py (entrée)

```python
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routers import auth, articles, newsletter
from app.routers.admin import posts, media, stats, settings

app = FastAPI(title="Blog API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # URL Next.js
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router, prefix="/api/auth", tags=["auth"])
app.include_router(articles.router, prefix="/api/articles", tags=["articles"])
app.include_router(newsletter.router, prefix="/api/newsletter", tags=["newsletter"])
app.include_router(posts.router, prefix="/api/admin/posts", tags=["admin-posts"])
app.include_router(media.router, prefix="/api/admin/media", tags=["admin-media"])
app.include_router(stats.router, prefix="/api/admin/stats", tags=["admin-stats"])
app.include_router(settings.router, prefix="/api/admin/settings", tags=["admin-settings"])
```

---

## Requirements

```
fastapi>=0.111.0
uvicorn[standard]
sqlalchemy[asyncio]>=2.0
asyncpg
alembic
pydantic[email]>=2.0
pydantic-settings
python-jose[cryptography]
passlib[bcrypt]
python-multipart
boto3           # si upload S3
fastapi-mail    # si newsletter par email
python-slugify
```

---

## Variables d'environnement (.env)

```env
DATABASE_URL=postgresql+asyncpg://user:password@localhost:5432/blog_db
SECRET_KEY=your-secret-key-here
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=60

# Upload
S3_BUCKET=
S3_REGION=
AWS_ACCESS_KEY_ID=
AWS_SECRET_ACCESS_KEY=

# Email
SMTP_HOST=
SMTP_PORT=587
SMTP_USER=
SMTP_PASSWORD=

# CORS
FRONTEND_URL=http://localhost:3000
```

---

## Intégration côté Next.js (à faire après)

Remplacer les données mock dans `/lib/articles.ts` par des appels `fetch`:

```typescript
// lib/api.ts
const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"

export async function getArticles(params?: { page?: number; category?: string; search?: string }) {
  const url = new URL(`${API_URL}/api/articles`)
  if (params?.page) url.searchParams.set("page", String(params.page))
  if (params?.category) url.searchParams.set("category", params.category)
  if (params?.search) url.searchParams.set("search", params.search)
  const res = await fetch(url.toString(), { next: { revalidate: 60 } })
  return res.json()
}

export async function getArticle(slug: string) {
  const res = await fetch(`${API_URL}/api/articles/${slug}`, { next: { revalidate: 60 } })
  return res.json()
}
```
