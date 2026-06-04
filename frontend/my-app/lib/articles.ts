export type ArticleSummary = {
  slug: string
  date: string
  title: string
  excerpt: string
  tag: string
  minutes: string
}

export type ArticleDetail = ArticleSummary & {
  category: string
  intro: string
  content: Array<{
    type: "paragraph" | "heading" | "code" | "callout" | "image"
    text?: string
    code?: string
    caption?: string
    filename?: string
  }>
}

export const articles: ArticleDetail[] = [
  {
    slug: "mastering-clean-architecture-in-modern-nodejs-applications",
    date: "October 24, 2024",
    title: "Mastering Clean Architecture in Modern Node.js Applications",
    excerpt:
      "A practical guide to structuring Node.js apps with clean boundaries, use cases, and dependency inversion.",
    tag: "NODE.JS",
    minutes: "12 min read",
    category: "ARCHITECTURES",
    intro:
      "In the fast-paced world of software development, the Clean Architecture pattern remains a beacon of stability. It allows developers to create systems that are independent of frameworks, UI, and external databases.",
    content: [
      {
        type: "paragraph",
        text: "When building scalable Node.js services, this separation of concerns isn't just a luxury, it's a requirement for long-term survival.",
      },
      {
        type: "heading",
        text: "The Core Principles",
      },
      {
        type: "paragraph",
        text: "At the heart of any maintainable system lies the separation of business logic from technical details. We often see Node.js projects where Express controllers are tightly coupled with TypeORM models, making it impossible to test logic without a database connection or a mock server.",
      },
      {
        type: "code",
        filename: "src/domain/use-cases/create-user.ts",
        code: `interface UserRepository {
  save(user: User): Promise<void>;
}

export class CreateUserUseCase {
  constructor(private userRepository: UserRepository) {}

  async execute(data: CreateUserDTO) {
    const user = new User(data);
    await this.userRepository.save(user);
    return user;
  }
}`,
      },
      {
        type: "heading",
        text: "Dependency Injection",
      },
      {
        type: "paragraph",
        text: "Notice how the use case above doesn't know how the user is saved. It only knows that something following the UserRepository interface will handle it. This is the essence of dependency inversion.",
      },
      {
        type: "callout",
        text: "Always design your domain layer to be ignorant of the outside world. If you can't run your tests without importing express, your architecture is likely too coupled.",
      },
      {
        type: "paragraph",
        text: "Building with these constraints initially feels like more work, but it pays off as your codebase grows. You can switch from REST API to GraphQL, or from PostgreSQL to MongoDB, without rewriting the core business rules.",
      },
      {
        type: "image",
        caption: "A clean environment leads to cleaner code.",
      },
      {
        type: "heading",
        text: "Structuring Services",
      },
      {
        type: "paragraph",
        text: "I typically divide my Node.js projects into four distinct layers: domain, application, infrastructure, and interface. This gives every dependency a clear direction and keeps the codebase easy to reason about.",
      },
    ],
  },
  {
    slug: "advanced-typescript-patterns-for-enterprise-scale",
    date: "September 23, 2024",
    title: "Advanced TypeScript Patterns for Enterprise Scale",
    excerpt:
      "Deep dive into generic constraints, mapped types, and conditional typing logic.",
    tag: "TYPESCRIPT",
    minutes: "8 min read",
    category: "ARCHITECTURES",
    intro: "A practical playbook for keeping large TypeScript codebases maintainable.",
    content: [],
  },
  {
    slug: "unit-testing-with-vitest-and-mocking-experts",
    date: "August 28, 2024",
    title: "Unit Testing with Vitest and Mocking Experts",
    excerpt:
      "Why I moved from Jest to Vitest and how to properly mock complex dependencies.",
    tag: "TESTING",
    minutes: "16 min read",
    category: "ARCHITECTURES",
    intro: "Testing practices that make refactors safer and faster.",
    content: [],
  },
  {
    slug: "deploying-nodejs-to-aws-lambda-using-cdk",
    date: "July 08, 2024",
    title: "Deploying Node.js to AWS Lambda using CDK",
    excerpt:
      "Infrastructure as Code simplified for JavaScript developers with AWS CDK.",
    tag: "DEVOPS",
    minutes: "10 min read",
    category: "ARCHITECTURES",
    intro: "A compact guide to shipping Node.js services on AWS.",
    content: [],
  },
]

export function getArticleBySlug(slug: string) {
  return articles.find((article) => article.slug === slug)
}
