export type ArticleSummary = {
  slug: string
  date: string
  published_at?: string
  title: string
  excerpt: string
  tag: string
  minutes: string | number
  category?: string
  image_url?: string | null
}

export type ArticleDetail = ArticleSummary & {
  category: string
  intro?: string
  author?: string
  updated_at?: string
  content: Array<{
    type: "paragraph" | "heading" | "code" | "callout" | "image"
    text?: string
    code?: string
    caption?: string
    filename?: string
    url?: string
    alt?: string
    variant?: "quote" | "tip"
  }>
}
