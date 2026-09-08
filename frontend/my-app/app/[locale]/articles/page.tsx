"use client"

import { useState } from "react"
import Link from "next/link"
import { useTranslations } from "next-intl"
import { keepPreviousData, useQuery } from "@tanstack/react-query"
import { api } from "@/lib/api"
import { adminQueryKeys } from "@/lib/queryKeys"
import Newsletter from "@/components/Newsletter"

export default function ArticlesPage() {
  const t = useTranslations("Articles")
  const tCommon = useTranslations("Common")
  const [query, setQuery] = useState<{ search: string; category: string; page: number }>({
    search: "",
    category: "",
    page: 1,
  })

  // This is a simplified version - in reality you'd use the searchParams from the URL
  const articlesQuery = useQuery({
    queryKey: adminQueryKeys.postList({ page: query.page, limit: 10, search: query.search, status: "published" }),
    queryFn: () => api.admin.posts.list({ page: query.page, limit: 10, search: query.search, status: "published" }),
    placeholderData: keepPreviousData,
  })

  const posts = articlesQuery.data?.posts || []
  const pages = articlesQuery.data?.pages || 1

  return (
    <div className="min-h-screen bg-[#fbfaf7] text-[#1d2433]">
      <main id="contenu" className="mx-auto max-w-6xl px-5 py-14 sm:py-20">
        <p className="neo-eyebrow">{t("archives")}</p>
        <h1 className="mt-3 font-heading text-5xl font-black sm:text-6xl">{t("title")}</h1>
        <p className="mt-5 text-lg text-[#687184]">{t("description")}</p>

        <form className="neo-card mt-10 flex flex-col gap-3 p-4 sm:flex-row" onSubmit={(e) => {
          e.preventDefault()
          const form = new FormData(e.currentTarget)
          setQuery((q) => ({ ...q, search: (form.get("search") as string) || "", page: 1 }))
        }}>
          <input name="search" defaultValue={query.search} className="neo-field min-w-0 flex-1 px-5 py-3 outline-none" aria-label={tCommon("search")} placeholder={tCommon("searchPlaceholder")} />
          <button type="submit" className="neo-button bg-on-surface px-6 py-3 font-bold text-surface">{tCommon("search")}</button>
        </form>

        <div className="mt-8 grid gap-6 md:grid-cols-2">
          {posts.map((post) => (
            <Link key={post.id} href={`/articles/${post.slug}`} className="neo-card p-6 hover:border-on-surface">
              <p className="text-sm font-bold text-on-surface">{post.category}</p>
              <h2 className="mt-2 font-heading text-2xl font-black">{post.title}</h2>
              <p className="mt-3 text-[#596275]">{post.excerpt}</p>
            </Link>
          ))}
        </div>

        {!articlesQuery.isPending && !posts.length && <p className="mt-10 text-center text-[#737b8d]">{t("noResults")}</p>}

        {pages > 1 && (
          <nav className="mt-10 flex justify-center gap-4" aria-label="Pagination">
            <button disabled={query.page <= 1} onClick={() => setQuery((q) => ({ ...q, page: q.page - 1 }))} className="rounded-xl border border-black/15 bg-white px-4 py-2 disabled:opacity-40">{tCommon("previous")}</button>
            <span className="text-sm text-[#596275]">{query.page} / {pages}</span>
            <button disabled={query.page >= pages} onClick={() => setQuery((q) => ({ ...q, page: q.page + 1 }))} className="rounded-xl border border-black/15 bg-white px-4 py-2 disabled:opacity-40">{tCommon("next")}</button>
          </nav>
        )}

        <Newsletter />
      </main>
    </div>
  )
}
