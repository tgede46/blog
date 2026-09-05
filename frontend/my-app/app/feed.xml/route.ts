import { api } from "@/lib/api"

export const revalidate = 3600

function escapeXml(value: string) {
  return value.replace(/[<>&'"]/g, (character) => ({
    "<": "&lt;",
    ">": "&gt;",
    "&": "&amp;",
    "'": "&apos;",
    '"': "&quot;",
  })[character] || character)
}

export async function GET() {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"
  const data = await api.articles.list({ page: 1, limit: 50 }).catch(() => ({ articles: [] }))
  const items = data.articles.map((article) => `
    <item>
      <title>${escapeXml(article.title)}</title>
      <link>${baseUrl}/articles/${encodeURIComponent(article.slug)}</link>
      <guid>${baseUrl}/articles/${encodeURIComponent(article.slug)}</guid>
      <description>${escapeXml(article.excerpt)}</description>
      <pubDate>${new Date(article.published_at || article.date).toUTCString()}</pubDate>
    </item>`).join("")
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0"><channel>
  <title>Gedeon Kpara</title>
  <link>${baseUrl}</link>
  <description>Articles sur le développement et l’architecture logicielle.</description>
  <language>fr-FR</language>${items}
</channel></rss>`

  return new Response(xml, {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
      "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
    },
  })
}
