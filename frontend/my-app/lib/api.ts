import type { ArticleDetail, ArticleSummary } from "./articles"

export const API_BASE_URL = (
  typeof window === "undefined"
    ? process.env.API_URL || process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"
    : "/backend-api"
).replace(/\/$/, "")

export type UserProfile = { id: string; email: string; name: string; avatar_url?: string | null; role?: string; created_at?: string }
export type MFAMethod = "totp" | "email" | "recovery"
export type LoginResponse = {
  access_token?: string | null
  user?: UserProfile | null
  mfa_required?: boolean
  challenge_token?: string | null
  methods?: MFAMethod[]
}
export type MFAStatus = { totp_enabled: boolean; email_enabled: boolean; email_available: boolean }
export type PublicSettings = {
  site_name?: string; site_description?: string; author_name?: string; author_bio?: string
  hero_title?: string; hero_description?: string; about_content?: string; contact_email?: string
  github_url?: string; linkedin_url?: string; x_url?: string; legal_name?: string; address?: string; legal_content?: string
  [key: string]: unknown
}
export type ArticleListResponse = {
  articles: ArticleSummary[]; total: number; page: number; pages: number
  categories?: Array<string | { name: string; count?: number }>
}
export type PostInput = {
  title: string; excerpt: string; content: ArticleDetail["content"]; category: string; tag: string
  status: "published" | "draft"; read_minutes?: number; slug?: string
}
export type AdminPost = ArticleDetail & { id: string; status: "published" | "draft"; updated_at?: string }
export type AdminStats = {
  total_views: number
  subscribers: number
  drafts: number
  published: number
  recent_posts: AdminPost[]
  activity: Array<{ type: string; label: string; created_at: string }>
}
export type MediaItem = { id: string; url: string; filename: string; size?: number; mime_type?: string; created_at?: string; alt?: string }

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
    login: (email: string, password: string) => apiFetch<LoginResponse>("/api/auth/login", { method: "POST", body: JSON.stringify({ email, password }) }),
    verifyMfa: (challengeToken: string, method: MFAMethod, code: string) => apiFetch<LoginResponse>("/api/auth/mfa/verify", { method: "POST", body: JSON.stringify({ challenge_token: challengeToken, method, code }) }),
    sendEmailCode: (challengeToken: string) => apiFetch<{ message: string }>("/api/auth/mfa/email/send", { method: "POST", body: JSON.stringify({ challenge_token: challengeToken }) }),
    me: () => apiFetch<UserProfile>("/api/auth/me"),
    logout: () => apiFetch<void>("/api/auth/logout", { method: "POST" }),
    mfaStatus: () => apiFetch<MFAStatus>("/api/auth/mfa/status"),
    setupTotp: () => apiFetch<{ secret: string; provisioning_uri: string }>("/api/auth/mfa/totp/setup", { method: "POST" }),
    confirmTotp: (code: string) => apiFetch<{ recovery_codes: string[] }>("/api/auth/mfa/totp/confirm", { method: "POST", body: JSON.stringify({ code }) }),
    setupEmailMfa: () => apiFetch<{ message: string }>("/api/auth/mfa/email/setup", { method: "POST" }),
    confirmEmailMfa: (code: string) => apiFetch<{ message: string }>("/api/auth/mfa/email/confirm", { method: "POST", body: JSON.stringify({ code }) }),
    changePassword: (currentPassword: string, newPassword: string) => apiFetch<{ message: string }>("/api/auth/password", { method: "POST", body: JSON.stringify({ current_password: currentPassword, new_password: newPassword }) }),
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
      list: async () => (await apiFetch<{ media: MediaItem[] }>("/api/admin/media")).media,
      upload: (file: File) => { const body = new FormData(); body.append("file", file); return apiFetch<MediaItem>("/api/admin/media/upload", { method: "POST", body }) },
      delete: (id: string) => apiFetch<void>(`/api/admin/media/${encodeURIComponent(id)}`, { method: "DELETE" }),
    },
    settings: {
      get: () => apiFetch<PublicSettings>("/api/admin/settings"),
      update: (settings: PublicSettings) => apiFetch<PublicSettings>("/api/admin/settings", { method: "PUT", body: JSON.stringify(settings) }),
    },
  },
}
