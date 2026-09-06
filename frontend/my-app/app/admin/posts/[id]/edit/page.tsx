"use client"

import { use } from "react"
import { useQuery } from "@tanstack/react-query"
import PostEditor from "@/components/PostEditor"
import { api } from "@/lib/api"
import { adminQueryKeys } from "@/lib/queryKeys"

export default function EditPostPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const postQuery = useQuery({
    queryKey: adminQueryKeys.post(id),
    queryFn: () => api.admin.posts.get(id),
  })
  const error = postQuery.error instanceof Error ? postQuery.error.message : postQuery.error ? "Article introuvable." : ""

  if (error) return <div className="rounded-xl bg-red-50 p-5 text-red-700" role="alert">{error}</div>
  if (!postQuery.data) return <p className="text-[#737b8d]">Chargement de l’article…</p>
  return <PostEditor post={postQuery.data} />
}
