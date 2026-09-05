import { ArticleDetail, ArticleSummary } from "./articles"

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"

export type UserProfile = {
  id: string
  email: string
  name: string
  avatar_url?: string | null
  role: "admin" | "editor"
  created_at: string
}

export type LoginResponse = {
  access_token: string
  token_type: string
  user: UserProfile
}

export type ArticleListResponse = {
  articles: ArticleSummary[]
  total: number
  page: number
  pages: number
}

export type AdminPost = ArticleDetail & {
  id: string
  status: "published" | "draft"
  updated_at: string
}

export type AdminStats = {
  total_views: number
  total_posts: number
  total_subscribers: number
  monthly_reads_growth: string
  posts_growth: string
  subscribers_growth: string
  views_history: Array<{ date: string; views: number }>
  category_distribution: Record<string, number>
  recent_activities: Array<{ id: string; action: string; title: string; time: string }>
}

function getStoredToken(): string | null {
  if (typeof window === "undefined") return null
  return localStorage.getItem("blog_access_token")
}

export async function apiFetch<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const token = getStoredToken()
  const headers = new Headers(options.headers || {})

  if (!headers.has("Content-Type") && !(options.body instanceof FormData)) {
    headers.set("Content-Type", "application/json")
  }

  if (token && !headers.has("Authorization")) {
    headers.set("Authorization", `Bearer ${token}`)
  }

  const res = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  })

  if (!res.ok) {
    let errorDetail = "Une erreur est survenue"
    try {
      const errorJson = await res.json()
      errorDetail = errorJson.detail || errorDetail
    } catch {
      // Ignored
    }
    throw new Error(errorDetail)
  }

  return res.json()
}

// Auth Endpoints
export const api = {
  auth: {
    login: async (email: string, password: string): Promise<LoginResponse> => {
      return apiFetch<LoginResponse>("/api/auth/login", {
        method: "POST",
        body: JSON.stringify({ email, password }),
      })
    },
    me: async (): Promise<UserProfile> => {
      return apiFetch<UserProfile>("/api/auth/me")
    },
    logout: async () => {
      try {
        await apiFetch("/api/auth/logout", { method: "POST" })
      } catch {
        // Ignored
      }
    },
  },

  // Public Articles
  articles: {
    list: async (params?: { page?: number; category?: string; tag?: string; search?: string }): Promise<ArticleListResponse> => {
      const searchParams = new URLSearchParams()
      if (params?.page) searchParams.set("page", params.page.toString())
      if (params?.category) searchParams.set("category", params.category)
      if (params?.tag) searchParams.set("tag", params.tag)
      if (params?.search) searchParams.set("search", params.search)
      const qs = searchParams.toString()
      return apiFetch<ArticleListResponse>(`/api/articles${qs ? `?${qs}` : ""}`)
    },
    get: async (slug: string): Promise<ArticleDetail> => {
      return apiFetch<ArticleDetail>(`/api/articles/${slug}`)
    },
  },

  // Newsletter
  newsletter: {
    subscribe: async (email: string): Promise<{ message: string }> => {
      return apiFetch<{ message: string }>("/api/newsletter", {
        method: "POST",
        body: JSON.stringify({ email }),
      })
    },
  },

  // Admin Endpoints
  admin: {
    posts: {
      list: async (params?: { page?: number; status?: string; search?: string }): Promise<{ posts: AdminPost[]; total: number }> => {
        const searchParams = new URLSearchParams()
        if (params?.page) searchParams.set("page", params.page.toString())
        if (params?.status) searchParams.set("status", params.status)
        if (params?.search) searchParams.set("search", params.search)
        const qs = searchParams.toString()
        return apiFetch<{ posts: AdminPost[]; total: number }>(`/api/admin/posts${qs ? `?${qs}` : ""}`)
      },
      create: async (data: {
        title: string
        excerpt: string
        content: ArticleDetail["content"]
        category: string
        tag: string
        status?: "published" | "draft"
        read_minutes?: number
      }): Promise<AdminPost> => {
        return apiFetch<AdminPost>("/api/admin/posts", {
          method: "POST",
          body: JSON.stringify(data),
        })
      },
      delete: async (id: string): Promise<{ success: boolean }> => {
        return apiFetch<{ success: boolean }>(`/api/admin/posts/${id}`, {
          method: "DELETE",
        })
      },
    },
    stats: {
      get: async (): Promise<AdminStats> => {
        return apiFetch<AdminStats>("/api/admin/stats")
      },
    },
    media: {
      list: async (): Promise<Array<{ id: string; url: string; filename: string; created_at: string }>> => {
        return apiFetch<Array<{ id: string; url: string; filename: string; created_at: string }>>("/api/admin/media")
      },
      upload: async (file: File): Promise<{ url: string; filename: string }> => {
        const formData = new FormData()
        formData.append("file", file)
        return apiFetch<{ url: string; filename: string }>("/api/admin/media", {
          method: "POST",
          body: formData,
        })
      },
    },
  },
}
