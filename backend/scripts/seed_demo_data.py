"""
Seed the database with demo articles from the frontend mock data.
Run from the backend/ directory:
  .venv/bin/python scripts/seed_demo_data.py
"""
import asyncio
import sys
from pathlib import Path

sys.path.append(str(Path(__file__).resolve().parents[1]))

from sqlalchemy import select

from app.database import SessionLocal, utc_now
from app.models.article import Article, ArticleStatus
from app.models.user import User
from slugify import slugify

DEMO_ARTICLES = [
    {
        "title": "Mastering Clean Architecture in Modern Node.js Applications",
        "excerpt": "A practical guide to structuring Node.js apps with clean boundaries, use cases, and dependency inversion.",
        "tag": "NODE.JS",
        "category": "ARCHITECTURES",
        "read_minutes": 12,
        "status": ArticleStatus.published,
        "content": [
            {"type": "paragraph", "text": "When building scalable Node.js services, this separation of concerns isn't just a luxury, it's a requirement for long-term survival."},
            {"type": "heading", "text": "The Core Principles"},
            {"type": "paragraph", "text": "At the heart of any maintainable system lies the separation of business logic from technical details."},
            {"type": "code", "filename": "src/domain/use-cases/create-user.ts", "code": "interface UserRepository {\n  save(user: User): Promise<void>;\n}\n\nexport class CreateUserUseCase {\n  constructor(private userRepository: UserRepository) {}\n\n  async execute(data: CreateUserDTO) {\n    const user = new User(data);\n    await this.userRepository.save(user);\n    return user;\n  }\n}"},
            {"type": "heading", "text": "Dependency Injection"},
            {"type": "paragraph", "text": "Notice how the use case above doesn't know how the user is saved. This is the essence of dependency inversion."},
            {"type": "callout", "text": "Always design your domain layer to be ignorant of the outside world. If you can't run your tests without importing express, your architecture is likely too coupled."},
            {"type": "heading", "text": "Structuring Services"},
            {"type": "paragraph", "text": "I typically divide my Node.js projects into four distinct layers: domain, application, infrastructure, and interface."},
        ],
    },
    {
        "title": "Advanced TypeScript Patterns for Enterprise Scale",
        "excerpt": "Deep dive into generic constraints, mapped types, and conditional typing logic.",
        "tag": "TYPESCRIPT",
        "category": "ARCHITECTURES",
        "read_minutes": 8,
        "status": ArticleStatus.published,
        "content": [
            {"type": "paragraph", "text": "TypeScript's type system is one of the most powerful tools available to JavaScript developers building large-scale applications."},
            {"type": "heading", "text": "Generic Constraints"},
            {"type": "paragraph", "text": "Generic constraints allow you to create reusable type-safe functions and classes that work with a range of types."},
            {"type": "code", "filename": "types.ts", "code": "type DeepReadonly<T> = {\n  readonly [P in keyof T]: T[P] extends object ? DeepReadonly<T[P]> : T[P];\n};"},
            {"type": "heading", "text": "Mapped Types"},
            {"type": "paragraph", "text": "Mapped types let you transform existing types into new ones by iterating over their properties."},
        ],
    },
    {
        "title": "Unit Testing with Vitest and Mocking Experts",
        "excerpt": "Why I moved from Jest to Vitest and how to properly mock complex dependencies.",
        "tag": "TESTING",
        "category": "ARCHITECTURES",
        "read_minutes": 16,
        "status": ArticleStatus.published,
        "content": [
            {"type": "paragraph", "text": "Vitest is a blazing-fast unit test framework powered by Vite, designed as a drop-in replacement for Jest."},
            {"type": "heading", "text": "Why Vitest"},
            {"type": "paragraph", "text": "The biggest advantage is the near-instant startup time thanks to Vite's native ESM support."},
            {"type": "callout", "text": "Vitest shares its configuration with Vite, meaning you can reuse your vite.config.ts for both bundling and testing."},
        ],
    },
    {
        "title": "Deploying Node.js to AWS Lambda using CDK",
        "excerpt": "Infrastructure as Code simplified for JavaScript developers with AWS CDK.",
        "tag": "DEVOPS",
        "category": "ARCHITECTURES",
        "read_minutes": 10,
        "status": ArticleStatus.published,
        "content": [
            {"type": "paragraph", "text": "AWS CDK (Cloud Development Kit) lets you define cloud infrastructure in familiar programming languages like TypeScript."},
            {"type": "heading", "text": "Setting Up Your CDK App"},
            {"type": "paragraph", "text": "Start by installing the CDK CLI and bootstrapping your AWS account for CDK deployments."},
            {"type": "code", "filename": "lib/lambda-stack.ts", "code": "import * as cdk from 'aws-cdk-lib';\nimport * as lambda from 'aws-cdk-lib/aws-lambda';\n\nexport class LambdaStack extends cdk.Stack {\n  constructor(scope: cdk.App, id: string) {\n    super(scope, id);\n    new lambda.Function(this, 'Handler', {\n      runtime: lambda.Runtime.NODEJS_20_X,\n      code: lambda.Code.fromAsset('src'),\n      handler: 'index.handler',\n    });\n  }\n}"},
        ],
    },
]


async def seed() -> None:
    async with SessionLocal() as db:
        # Get admin user
        result = await db.execute(select(User).where(User.email == "admin@gmail.com"))
        admin = result.scalar_one_or_none()
        if admin is None:
            print("Admin user not found. Run create_admin.py first.")
            return

        count = 0
        for data in DEMO_ARTICLES:
            slug = slugify(data["title"])
            # Check if already exists
            existing = await db.execute(select(Article).where(Article.slug == slug))
            if existing.scalar_one_or_none() is not None:
                print(f"  - SKIP (exists): {data['title']}")
                continue

            article = Article(
                slug=slug,
                title=data["title"],
                excerpt=data["excerpt"],
                content=data["content"],
                category=data["category"],
                tag=data["tag"],
                author_id=admin.id,
                status=data["status"],
                read_minutes=data["read_minutes"],
                published_at=utc_now() if data["status"] == ArticleStatus.published else None,
            )
            db.add(article)
            count += 1
            print(f"  + ADDED: {data['title']}")

        await db.commit()
        print(f"\nSeed complete: {count} article(s) inserted.")


if __name__ == "__main__":
    asyncio.run(seed())
