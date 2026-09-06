import type { MetadataRoute } from "next"

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://blog-28ci.onrender.com"
const API_URL = process.env.API_URL || process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"

type ArticleSummary = {
  slug: string
  published_at?: string
  date?: string
  updated_at?: string
}

async function getArticles(): Promise<ArticleSummary[]> {
  try {
    const res = await fetch(`${API_URL}/api/articles?limit=100`, { next: { revalidate: 3600 } })
    if (!res.ok) return []
    const data = await res.json()
    return data.articles || []
  } catch {
    return []
  }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const articles = await getArticles()

  const articleEntries: MetadataRoute.Sitemap = articles.map((article) => ({
    url: `${BASE_URL}/articles/${article.slug}`,
    lastModified: article.updated_at || article.published_at || article.date || new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }))

  const locales = ["fr", "en", "es"]
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: BASE_URL,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1,
    },
    ...locales.flatMap((locale) => [
      {
        url: `${BASE_URL}/${locale}`,
        lastModified: new Date(),
        changeFrequency: "daily" as const,
        priority: 1,
      },
      {
        url: `${BASE_URL}/${locale}/articles`,
        lastModified: new Date(),
        changeFrequency: "weekly" as const,
        priority: 0.7,
      },
      {
        url: `${BASE_URL}/${locale}/a-propos`,
        lastModified: new Date(),
        changeFrequency: "monthly" as const,
        priority: 0.5,
      },
      {
        url: `${BASE_URL}/${locale}/contact`,
        lastModified: new Date(),
        changeFrequency: "monthly" as const,
        priority: 0.5,
      },
    ]),
  ]

  return [...staticPages, ...articleEntries]
}
