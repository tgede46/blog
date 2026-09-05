import type { MetadataRoute } from "next"
import { api } from "@/lib/api"

export const revalidate = 3600

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"
  const staticRoutes = ["", "/articles", "/a-propos", "/contact", "/mentions-legales"].map((path) => ({
    url: `${baseUrl}${path}`,
    lastModified: new Date(),
    changeFrequency: path === "" ? "weekly" as const : "monthly" as const,
    priority: path === "" ? 1 : 0.7,
  }))

  try {
    const { articles } = await api.articles.list({ page: 1, limit: 1000 })
    return [...staticRoutes, ...articles.map((article) => ({
      url: `${baseUrl}/articles/${article.slug}`,
      lastModified: new Date(article.published_at || article.date),
      changeFrequency: "monthly" as const,
      priority: 0.8,
    }))]
  } catch {
    return staticRoutes
  }
}
