"use client"

import { use, useEffect, useState } from "react"
import PostEditor from "@/components/PostEditor"
import { api, type AdminPost } from "@/lib/api"

export default function EditPostPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const [post, setPost] = useState<AdminPost | null>(null)
  const [error, setError] = useState("")

  useEffect(() => {
    api.admin.posts.get(id).then(setPost).catch((reason) => setError(reason instanceof Error ? reason.message : "Article introuvable."))
  }, [id])

  if (error) return <div className="rounded-xl bg-red-50 p-5 text-red-700" role="alert">{error}</div>
  if (!post) return <p className="text-[#737b8d]">Chargement de l’article…</p>
  return <PostEditor post={post} />
}
