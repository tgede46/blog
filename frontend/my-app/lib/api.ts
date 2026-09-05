import type { ArticleDetail, ArticleSummary } from "./articles"

export const API_BASE_URL = (process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000").replace(/\/$/, "")

export type UserProfile = { id: string; email: string; name: string; avatar_url?: string | null; role?: string; created_at?: string }
export type PublicSettings = {
  site_name?: string; site_description?: string; author_name?: string; author_bio?: string; email?: string
  github_url?: string; linkedin_url?: string; twitter_url?: string; legal_name?: string; address?: string
  [key: string]: unknown
}
export type ArticleListResponse = {
  articles: ArticleSummary[]; total: number; page: number; pages: number
  categories?: Array<string | { name: string; count?: number }>
}
export type PostInput = {
  title: string; excerpt: string; intro?: string; content: ArticleDetail["content"]; category: string; tag: string
  status: "published" | "draft"; read_minutes?: number; slug?: string
}
export type AdminPost = ArticleDetail & { id: string; status: "published" | "draft"; updated_at?: string }
export type AdminStats = {
  total_views?: number; total_posts?: number; total_subscribers?: number; total_drafts?: number
  monthly_reads_growth?: string; posts_growth?: string; subscribers_growth?: string
  views_history?: Array<{ date: string; views: number }>; category_distribution?: Record<string, number>
  recent_activities?: Array<{ id: string; action: string; title: string; time: string }>
}
export type MediaItem = { id: string; url: string; filename: string; created_at?: string; alt?: string }

function queryString(params: Record<string, string | number | undefined>) {
  const search = new URLSearchParams()
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== "") search.set(key, String(value))
  })
  return search.size ? `?${search}` : ""
}

export async function apiFetch<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const headers = new Headers(options.headers)
  if (options.body && !(options.body instanceof FormData) && !headers.has("Content-Type")) headers.set("Content-Type", "application/json")
  const response = await fetch(`${API_BASE_URL}${endpoint}`, { ...options, headers, credentials: "include" })
  if (!response.ok) {
    let message = `La requête a échoué (${response.status}).`
    try {
      const body = await response.json()
      message = body.detail || body.message || message
    } catch {}
    const error = new Error(message) as Error & { status?: number }
    error.status = response.status
    throw error
  }
  if (response.status === 204) return undefined as T
  return response.json() as Promise<T>
}

export const api = {
  auth: {
    login: (email: string, password: string) => apiFetch<UserProfile | { user: UserProfile }>("/api/auth/login", { method: "POST", body: JSON.stringify({ email, password }) }),
    me: () => apiFetch<UserProfile>("/api/auth/me"),
    logout: () => apiFetch<void>("/api/auth/logout", { method: "POST" }),
  },
  articles: {
    list: (params: { page?: number; limit?: number; category?: string; search?: string } = {}) => apiFetch<ArticleListResponse>(`/api/articles${queryString(params)}`),
    get: (slug: string) => apiFetch<ArticleDetail>(`/api/articles/${encodeURIComponent(slug)}`),
    related: (slug: string) => apiFetch<ArticleSummary[]>(`/api/articles/${encodeURIComponent(slug)}/related`),
  },
  settings: { public: () => apiFetch<PublicSettings>("/api/settings") },
  newsletter: { subscribe: (email: string) => apiFetch<{ message?: string }>("/api/newsletter/subscribe", { method: "POST", body: JSON.stringify({ email }) }) },
  contact: { send: (data: { name: string; email: string; subject: string; message: string }) => apiFetch<{ message?: string }>("/api/contact", { method: "POST", body: JSON.stringify(data) }) },
  admin: {
    stats: () => apiFetch<AdminStats>("/api/admin/stats"),
    posts: {
      list: (params: { page?: number; limit?: number; status?: string; search?: string } = {}) => apiFetch<{ posts: AdminPost[]; total: number; page?: number; pages?: number }>(`/api/admin/posts${queryString(params)}`),
      get: (id: string) => apiFetch<AdminPost>(`/api/admin/posts/${encodeURIComponent(id)}`),
      create: (data: PostInput) => apiFetch<AdminPost>("/api/admin/posts", { method: "POST", body: JSON.stringify(data) }),
      update: (id: string, data: PostInput) => apiFetch<AdminPost>(`/api/admin/posts/${encodeURIComponent(id)}`, { method: "PUT", body: JSON.stringify(data) }),
      delete: (id: string) => apiFetch<void>(`/api/admin/posts/${encodeURIComponent(id)}`, { method: "DELETE" }),
    },
    media: {
      list: () => apiFetch<MediaItem[]>("/api/admin/media"),
      upload: (file: File) => { const body = new FormData(); body.append("file", file); return apiFetch<MediaItem>("/api/admin/media/upload", { method: "POST", body }) },
      delete: (id: string) => apiFetch<void>(`/api/admin/media/${encodeURIComponent(id)}`, { method: "DELETE" }),
    },
    settings: {
      get: () => apiFetch<PublicSettings>("/api/admin/settings"),
      update: (settings: PublicSettings) => apiFetch<PublicSettings>("/api/admin/settings", { method: "PUT", body: JSON.stringify(settings) }),
    },
  },
}
