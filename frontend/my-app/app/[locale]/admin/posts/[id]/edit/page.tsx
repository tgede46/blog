"use client"

import { use } from "react"
import { useTranslations } from "next-intl"
import { useQuery } from "@tanstack/react-query"
import { api } from "@/lib/api"
import { adminQueryKeys } from "@/lib/queryKeys"
import PostEditor from "@/components/PostEditor"

export default function EditPostPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const t = useTranslations("Common")
  const postQuery = useQuery({
    queryKey: adminQueryKeys.post(id),
    queryFn: () => api.admin.posts.get(id),
  })

  if (!postQuery.data) return <p className="text-[#737b8d]">{t("loading")}</p>

  return <PostEditor post={postQuery.data} />
}
