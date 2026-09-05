"use client"

import { useCallback, useEffect, useState } from "react"
import Link from "next/link"
import { Edit2, Plus, Search, Trash2 } from "lucide-react"
import { api, type AdminPost } from "@/lib/api"
import { formatDateFr } from "@/lib/utils"

export default function AdminPostsPage() {
  const [posts, setPosts] = useState<AdminPost[]>([])
  const [search, setSearch] = useState("")
  const [status, setStatus] = useState("")
  const [page, setPage] = useState(1)
  const [pages, setPages] = useState(1)
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  const load = useCallback(async () => {
    try {
      const data = await api.admin.posts.list({ page, limit: 10, search, status })
      setPosts(data.posts)
      setTotal(data.total)
      setPages(data.pages || Math.max(1, Math.ceil(data.total / 10)))
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "Chargement impossible.")
    } finally {
      setLoading(false)
    }
  }, [page, search, status])

  useEffect(() => {
    api.admin.posts.list({ page, limit: 10, search, status })
      .then((data) => {
        setPosts(data.posts)
        setTotal(data.total)
        setPages(data.pages || Math.max(1, Math.ceil(data.total / 10)))
      })
      .catch((reason) => setError(reason instanceof Error ? reason.message : "Chargement impossible."))
      .finally(() => setLoading(false))
  }, [page, search, status])

  async function remove(post: AdminPost) {
    if (!window.confirm(`Supprimer définitivement « ${post.title} » ?`)) return
    try {
      await api.admin.posts.delete(post.id)
      await load()
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "Suppression impossible.")
    }
  }

  return (
    <div className="mx-auto max-w-6xl">
      <div className="flex flex-wrap items-end justify-between gap-5">
        <div><p className="text-sm font-semibold text-violet-700">{total} publication{total > 1 ? "s" : ""}</p><h1 className="mt-1 font-heading text-4xl font-black">Articles</h1></div>
        <Link href="/admin/new" className="flex items-center gap-2 rounded-xl bg-[#1d2433] px-5 py-3 font-bold text-white"><Plus size={18} />Créer</Link>
      </div>
      <form onSubmit={(event) => { event.preventDefault(); setPage(1); void load() }} className="mt-7 grid gap-3 rounded-2xl border border-black/10 bg-white p-4 sm:grid-cols-[1fr_180px_auto]">
        <label className="relative"><span className="sr-only">Rechercher</span><Search className="absolute left-3 top-3.5 text-[#89909e]" size={18} /><input value={search} onChange={(event) => setSearch(event.target.value)} className="w-full rounded-xl bg-[#f5f4f0] py-3 pl-10 pr-4 outline-none focus:ring-2 focus:ring-violet-300" placeholder="Rechercher…" /></label>
        <select value={status} onChange={(event) => { setStatus(event.target.value); setPage(1) }} className="rounded-xl bg-[#f5f4f0] px-4 py-3 outline-none"><option value="">Tous les états</option><option value="published">Publiés</option><option value="draft">Brouillons</option></select>
        <button className="rounded-xl bg-violet-600 px-5 py-3 font-bold text-white">Filtrer</button>
      </form>
      {error && <div className="mt-6 rounded-xl bg-red-50 p-4 text-red-700" role="alert">{error}</div>}
      <div className="mt-6 overflow-x-auto rounded-2xl border border-black/10 bg-white">
        <table className="w-full min-w-[720px] text-left">
          <thead className="border-b border-black/10 bg-[#faf9f6] text-xs uppercase tracking-wider text-[#737b8d]"><tr><th className="p-4">Titre</th><th className="p-4">Catégorie</th><th className="p-4">État</th><th className="p-4">Mise à jour</th><th className="p-4 text-right">Actions</th></tr></thead>
          <tbody className="divide-y divide-black/10">
            {posts.map((post) => <tr key={post.id}><td className="p-4 font-bold">{post.title}</td><td className="p-4 text-sm text-[#596275]">{post.category}</td><td className="p-4"><span className={`rounded-full px-3 py-1 text-xs font-bold ${post.status === "published" ? "bg-green-100 text-green-800" : "bg-stone-100 text-stone-700"}`}>{post.status === "published" ? "Publié" : "Brouillon"}</span></td><td className="p-4 text-sm text-[#596275]">{formatDateFr(post.updated_at || post.date)}</td><td className="p-4"><div className="flex justify-end gap-2"><Link href={`/admin/posts/${post.id}/edit`} className="rounded-lg p-2 hover:bg-violet-50" aria-label={`Modifier ${post.title}`}><Edit2 size={18} /></Link><button onClick={() => void remove(post)} className="rounded-lg p-2 text-red-700 hover:bg-red-50" aria-label={`Supprimer ${post.title}`}><Trash2 size={18} /></button></div></td></tr>)}
          </tbody>
        </table>
        {!loading && !posts.length && <p className="p-10 text-center text-[#737b8d]">Aucun article ne correspond aux filtres.</p>}
        {loading && <p className="p-10 text-center text-[#737b8d]">Chargement…</p>}
      </div>
      {pages > 1 && <div className="mt-6 flex items-center justify-center gap-4"><button disabled={page <= 1} onClick={() => setPage((value) => value - 1)} className="rounded-xl border border-black/15 bg-white px-4 py-2 disabled:opacity-40">Précédent</button><span className="text-sm text-[#596275]">{page} / {pages}</span><button disabled={page >= pages} onClick={() => setPage((value) => value + 1)} className="rounded-xl border border-black/15 bg-white px-4 py-2 disabled:opacity-40">Suivant</button></div>}
    </div>
  )
}
