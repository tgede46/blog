export const adminQueryKeys = {
  all: ["admin"] as const,
  stats: ["admin", "stats"] as const,
  posts: ["admin", "posts"] as const,
  postList: (filters: { page: number; status: string; search: string; limit: number }) =>
    ["admin", "posts", "list", filters] as const,
  post: (id: string) => ["admin", "posts", "detail", id] as const,
  media: ["admin", "media"] as const,
  settings: ["admin", "settings"] as const,
}
