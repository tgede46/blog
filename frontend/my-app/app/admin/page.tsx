"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Eye, FileText, Users } from "lucide-react"
import { api, type AdminPost, type AdminStats } from "@/lib/api"
import { formatDateFr } from "@/lib/utils"

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<AdminStats | null>(null)
  const [posts, setPosts] = useState<AdminPost[]>([])
  const [error, setError] = useState("")

  useEffect(() => {
    Promise.all([api.admin.stats(), api.admin.posts.list({ page: 1, limit: 5 })])
      .then(([statsData, postsData]) => {
        setStats(statsData)
        setPosts(postsData.posts)
      })
      .catch((reason) => setError(reason instanceof Error ? reason.message : "Chargement impossible."))
  }, [])

  const cards = [
    { label: "Vues", value: stats?.total_views, icon: Eye, color: "bg-[#e8e2fa]" },
    { label: "Articles", value: stats ? stats.published + stats.drafts : undefined, icon: FileText, color: "bg-[#dff3e5]" },
    { label: "Abonnés", value: stats?.subscribers, icon: Users, color: "bg-[#f8e7b6]" },
  ]

  return (
    <div className="mx-auto max-w-6xl">
      <div className="flex flex-wrap items-end justify-between gap-5">
        <div><p className="text-sm font-semibold text-violet-700">Vue d’ensemble</p><h1 className="mt-1 font-heading text-4xl font-black">Tableau de bord</h1></div>
        <Link href="/admin/new" className="rounded-xl bg-[#1d2433] px-5 py-3 font-bold text-white">Nouvel article</Link>
      </div>
      {error && <div className="mt-7 rounded-xl bg-red-50 p-4 text-red-700" role="alert">{error}</div>}
      <div className="mt-8 grid gap-5 sm:grid-cols-3">
        {cards.map(({ label, value, icon: Icon, color }) => <div key={label} className="rounded-2xl border border-black/10 bg-white p-6"><div className={`mb-6 flex h-11 w-11 items-center justify-center rounded-xl ${color}`}><Icon size={21} /></div><p className="text-sm font-semibold text-[#737b8d]">{label}</p><p className="mt-1 text-4xl font-black">{value === undefined ? "—" : value.toLocaleString("fr-FR")}</p></div>)}
      </div>
      <section className="mt-8 overflow-hidden rounded-2xl border border-black/10 bg-white">
        <div className="flex items-center justify-between border-b border-black/10 p-5"><h2 className="font-heading text-xl font-bold">Articles récents</h2><Link href="/admin/posts" className="text-sm font-bold text-violet-700">Tout gérer →</Link></div>
        {posts.length ? <div className="divide-y divide-black/10">{posts.map((post) => <div key={post.id} className="flex flex-wrap items-center justify-between gap-4 p-5"><div><p className="font-bold">{post.title}</p><p className="mt-1 text-sm text-[#737b8d]">{formatDateFr(post.updated_at || post.date)} · {post.status === "published" ? "Publié" : "Brouillon"}</p></div><Link className="text-sm font-bold text-violet-700" href={`/admin/posts/${post.id}/edit`}>Modifier</Link></div>)}</div> : <p className="p-8 text-center text-[#737b8d]">Aucun article à afficher.</p>}
      </section>
      {stats?.activity.length ? <section className="mt-8 rounded-2xl border border-black/10 bg-white p-6"><h2 className="font-heading text-xl font-bold">Activité récente</h2><ul className="mt-5 space-y-4">{stats.activity.map((item, index) => <li key={`${item.type}-${item.created_at}-${index}`} className="border-l-2 border-violet-300 pl-4"><p className="font-semibold">{item.label}</p><p className="text-sm text-[#737b8d]">{formatDateFr(item.created_at)}</p></li>)}</ul></section> : null}
    </div>
  )
}
