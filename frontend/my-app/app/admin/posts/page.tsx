"use client"

import { useState } from "react"
import Link from "next/link"
import { Edit2, Plus, Search, Trash2 } from "lucide-react"
import { keepPreviousData, useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { api, type AdminPost } from "@/lib/api"
import { adminQueryKeys } from "@/lib/queryKeys"
import { formatDateFr } from "@/lib/utils"

export default function AdminPostsPage() {
  const [search, setSearch] = useState("")
  const [appliedSearch, setAppliedSearch] = useState("")
  const [status, setStatus] = useState("")
  const [page, setPage] = useState(1)
  const queryClient = useQueryClient()
  const filters = { page, limit: 10, search: appliedSearch, status }
  const postsQuery = useQuery({
    queryKey: adminQueryKeys.postList(filters),
    queryFn: () => api.admin.posts.list(filters),
    placeholderData: keepPreviousData,
  })
  const deleteMutation = useMutation({
    mutationFn: (id: string) => api.admin.posts.delete(id),
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: adminQueryKeys.posts }),
        queryClient.invalidateQueries({ queryKey: adminQueryKeys.stats }),
      ])
    },
  })
  const posts = postsQuery.data?.posts || []
  const total = postsQuery.data?.total || 0
  const pages = postsQuery.data?.pages || Math.max(1, Math.ceil(total / 10))
  const queryError = postsQuery.error || deleteMutation.error
  const error = queryError instanceof Error ? queryError.message : queryError ? "Chargement impossible." : ""

  async function remove(post: AdminPost) {
    if (!window.confirm(`Supprimer définitivement « ${post.title} » ?`)) return
    await deleteMutation.mutateAsync(post.id).catch(() => undefined)
  }

  return (
    <div className="mx-auto max-w-6xl">
      <div className="flex flex-wrap items-end justify-between gap-5">
        <div><p className="text-sm font-semibold text-violet-700">{total} publication{total > 1 ? "s" : ""}</p><h1 className="mt-1 font-heading text-4xl font-black">Articles</h1></div>
        <Link href="/admin/new" className="neo-button flex items-center gap-2 bg-tertiary-fixed px-5 py-3 font-black uppercase tracking-wide"><Plus size={18} />Créer</Link>
      </div>
      <form onSubmit={(event) => { event.preventDefault(); setPage(1); setAppliedSearch(search.trim()) }} className="neo-card mt-7 grid gap-3 p-4 sm:grid-cols-[1fr_180px_auto]">
        <label className="relative"><span className="sr-only">Rechercher</span><Search className="absolute left-3 top-3.5 text-[#89909e]" size={18} /><input value={search} onChange={(event) => setSearch(event.target.value)} className="neo-field w-full bg-[#f5f4f0] py-3 pl-10 pr-4 outline-none focus:ring-2 focus:ring-violet-300" placeholder="Rechercher…" /></label>
        <select value={status} onChange={(event) => { setStatus(event.target.value); setPage(1) }} className="neo-field bg-[#f5f4f0] px-4 py-3 outline-none"><option value="">Tous les états</option><option value="published">Publiés</option><option value="draft">Brouillons</option></select>
        <button className="neo-button bg-primary px-5 py-3 font-bold text-white">Filtrer</button>
      </form>
      {error && <div className="mt-6 rounded-xl bg-red-50 p-4 text-red-700" role="alert">{error}</div>}
      <div className="neo-card mt-6 overflow-x-auto">
        <table className="w-full min-w-[720px] text-left">
          <thead className="border-b border-black/10 bg-[#faf9f6] text-xs uppercase tracking-wider text-[#737b8d]"><tr><th className="p-4">Titre</th><th className="p-4">Catégorie</th><th className="p-4">État</th><th className="p-4">Mise à jour</th><th className="p-4 text-right">Actions</th></tr></thead>
          <tbody className="divide-y divide-black/10">
            {posts.map((post) => <tr key={post.id}><td className="p-4 font-bold">{post.title}</td><td className="p-4 text-sm text-[#596275]">{post.category}</td><td className="p-4"><span className={`border border-on-surface px-3 py-1 text-xs font-bold ${post.status === "published" ? "bg-node-green text-green-900" : "bg-stone-100 text-stone-700"}`}>{post.status === "published" ? "Publié" : "Brouillon"}</span></td><td className="p-4 text-sm text-[#596275]">{formatDateFr(post.updated_at || post.date)}</td><td className="p-4"><div className="flex justify-end gap-2"><Link href={`/admin/posts/${post.id}/edit`} className="border border-transparent p-2 hover:border-on-surface hover:bg-violet-50" aria-label={`Modifier ${post.title}`}><Edit2 size={18} /></Link><button onClick={() => void remove(post)} className="border border-transparent p-2 text-red-700 hover:border-red-700 hover:bg-red-50" aria-label={`Supprimer ${post.title}`}><Trash2 size={18} /></button></div></td></tr>)}
          </tbody>
        </table>
        {!postsQuery.isPending && !posts.length && <p className="p-10 text-center text-[#737b8d]">Aucun article ne correspond aux filtres.</p>}
        {postsQuery.isPending && <p className="p-10 text-center text-[#737b8d]">Chargement…</p>}
      </div>
      {pages > 1 && <div className="mt-6 flex items-center justify-center gap-4"><button disabled={page <= 1} onClick={() => setPage((value) => value - 1)} className="rounded-xl border border-black/15 bg-white px-4 py-2 disabled:opacity-40">Précédent</button><span className="text-sm text-[#596275]">{page} / {pages}</span><button disabled={page >= pages} onClick={() => setPage((value) => value + 1)} className="rounded-xl border border-black/15 bg-white px-4 py-2 disabled:opacity-40">Suivant</button></div>}
    </div>
  )
}
