"use client"

import { useMemo, useState } from "react"
import Link from "next/link"
import { Eye, FileText, Shield, UserCog, Users } from "lucide-react"
import { useQuery } from "@tanstack/react-query"
import { api } from "@/lib/api"
import { adminQueryKeys } from "@/lib/queryKeys"
import { formatDateFr } from "@/lib/utils"

type UserFilter = "all" | "admin" | "editor" | "subscriber"

const filterLabels: Record<UserFilter, string> = {
  all: "Tous",
  admin: "Admins",
  editor: "Éditeurs",
  subscriber: "Abonnés",
}

export default function AdminDashboardPage() {
  const [userFilter, setUserFilter] = useState<UserFilter>("all")
  const statsQuery = useQuery({
    queryKey: adminQueryKeys.stats,
    queryFn: api.admin.stats,
  })
  const postsQuery = useQuery({
    queryKey: adminQueryKeys.postList({ page: 1, limit: 5, search: "", status: "" }),
    queryFn: () => api.admin.posts.list({ page: 1, limit: 5 }),
  })
  const stats = statsQuery.data
  const posts = postsQuery.data?.posts || []
  const queryError = statsQuery.error || postsQuery.error
  const error = queryError instanceof Error ? queryError.message : queryError ? "Chargement impossible." : ""

  const filteredUsers = useMemo(() => {
    if (!stats) return undefined
    if (userFilter === "admin") return stats.admins
    if (userFilter === "editor") return stats.editors
    if (userFilter === "subscriber") return stats.subscribers
    return stats.total_users
  }, [stats, userFilter])

  const cards = [
    { label: "Vues", value: stats?.total_views, icon: Eye, color: "bg-[#e8e2fa]" },
    { label: "Articles", value: stats ? stats.published + stats.drafts : undefined, icon: FileText, color: "bg-[#dff3e5]" },
    { label: "Utilisateurs", value: filteredUsers, icon: Users, color: "bg-[#f8e7b6]" },
  ]

  const audience = [
    { key: "admin" as const, label: "Admins", value: stats?.admins, icon: Shield, hint: "Comptes avec accès complet" },
    { key: "editor" as const, label: "Éditeurs", value: stats?.editors, icon: UserCog, hint: "Peuvent publier et gérer le contenu" },
    { key: "subscriber" as const, label: "Abonnés", value: stats?.subscribers, icon: Users, hint: "Visiteurs inscrits à la newsletter" },
  ]

  return (
    <div className="mx-auto max-w-6xl">
      <div className="flex flex-wrap items-end justify-between gap-5">
        <div><p className="text-sm font-semibold text-violet-700">Vue d’ensemble</p><h1 className="mt-1 font-heading text-4xl font-black">Tableau de bord</h1></div>
        <Link href="/admin/new" className="neo-button bg-tertiary-fixed px-5 py-3 font-black uppercase tracking-wide">Nouvel article</Link>
      </div>
      {error && <div className="mt-7 rounded-xl bg-red-50 p-4 text-red-700" role="alert">{error}</div>}
      <div className="mt-8 grid gap-5 sm:grid-cols-3">
        {cards.map(({ label, value, icon: Icon, color }) => <div key={label} className="neo-card p-6"><div className={`mb-6 flex h-11 w-11 items-center justify-center border-2 border-on-surface ${color}`}><Icon size={21} /></div><p className="text-sm font-bold uppercase tracking-wide text-[#737b8d]">{label}</p><p className="mt-1 text-4xl font-black">{value === undefined ? "—" : value.toLocaleString("fr-FR")}</p></div>)}
      </div>

      <section className="neo-card mt-8 p-6">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h2 className="font-heading text-xl font-bold">Utilisateurs de la plateforme</h2>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-[#596275]">
              Total = admins + éditeurs + abonnés newsletter. Un abonné est un visiteur qui s’est inscrit pour recevoir un email à chaque nouvel article (titre, résumé et lien).
            </p>
          </div>
          <p className="text-3xl font-black">{stats ? stats.total_users.toLocaleString("fr-FR") : "—"}</p>
        </div>
        <div className="mt-6 flex flex-wrap gap-3" role="group" aria-label="Filtrer les utilisateurs">
          {(Object.keys(filterLabels) as UserFilter[]).map((key) => (
            <button key={key} type="button" onClick={() => setUserFilter(key)} className={`neo-button px-4 py-2 font-bold ${userFilter === key ? "bg-primary text-white" : "bg-white"}`}>
              {filterLabels[key]}
            </button>
          ))}
        </div>
        <div className="mt-6 grid gap-4 md:grid-cols-3">
          {audience.map(({ key, label, value, icon: Icon, hint }) => (
            <button key={key} type="button" onClick={() => setUserFilter(key)} className={`neo-card border-2 p-5 text-left transition-all ${userFilter === key ? "bg-tertiary-fixed" : "bg-white"}`}>
              <div className="mb-4 flex h-10 w-10 items-center justify-center border-2 border-on-surface bg-white"><Icon size={18} /></div>
              <p className="text-xs font-bold uppercase tracking-wide text-[#737b8d]">{label}</p>
              <p className="mt-1 text-3xl font-black">{value === undefined ? "—" : value.toLocaleString("fr-FR")}</p>
              <p className="mt-3 text-sm leading-6 text-[#596275]">{hint}</p>
            </button>
          ))}
        </div>
      </section>

      <section className="neo-card mt-8 overflow-hidden">
        <div className="flex items-center justify-between border-b-2 border-on-surface p-5"><h2 className="font-heading text-xl font-bold">Articles récents</h2><Link href="/admin/posts" className="text-sm font-bold text-violet-700">Tout gérer →</Link></div>
        {posts.length ? <div className="divide-y divide-black/10">{posts.map((post) => <div key={post.id} className="flex flex-wrap items-center justify-between gap-4 p-5"><div><p className="font-bold">{post.title}</p><p className="mt-1 text-sm text-[#737b8d]">{formatDateFr(post.updated_at || post.date)} · {post.status === "published" ? "Publié" : "Brouillon"}</p></div><Link className="text-sm font-bold text-violet-700" href={`/admin/posts/${post.id}/edit`}>Modifier</Link></div>)}</div> : <p className="p-8 text-center text-[#737b8d]">Aucun article à afficher.</p>}
      </section>
      {stats?.activity.length ? <section className="neo-card mt-8 p-6"><h2 className="font-heading text-xl font-bold">Activité récente</h2><ul className="mt-5 space-y-4">{stats.activity.map((item, index) => <li key={`${item.type}-${item.created_at}-${index}`} className="border-l-4 border-violet-500 pl-4"><p className="font-semibold">{item.label}</p><p className="text-sm text-[#737b8d]">{formatDateFr(item.created_at)}</p></li>)}</ul></section> : null}
    </div>
  )
}
