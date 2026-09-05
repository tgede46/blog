import Link from "next/link"
import Nav from "@/components/Nav"
import SiteFooter from "@/components/SiteFooter"
import Newsletter from "@/components/Newsletter"
import ArticleCard from "@/components/ArticleCard"
import { api, type ArticleListResponse, type PublicSettings } from "@/lib/api"

export const metadata = { title: "Articles", description: "Tous les articles de Gedeon Kpara." }
type Props = { searchParams: Promise<{ page?: string; category?: string; search?: string }> }

export default async function ArticlesPage({ searchParams }: Props) {
  const query = await searchParams
  const page = Math.max(1, Number(query.page) || 1)
  let data: ArticleListResponse = { articles: [], total: 0, page, pages: 1 }
  let settings: PublicSettings = {}
  let error = false
  try { [data, settings] = await Promise.all([api.articles.list({ page, limit: 9, category: query.category, search: query.search }), api.settings.public().catch(() => ({}))]) } catch { error = true }
  const categories = (data.categories || []).map((category) => typeof category === "string" ? category : category.name)
  function href(target: number) { const params = new URLSearchParams(); if (target > 1) params.set("page", String(target)); if (query.category) params.set("category", query.category); if (query.search) params.set("search", query.search); return `/articles${params.size ? `?${params}` : ""}` }
  return (
    <div className="graphic-grid min-h-screen bg-surface text-on-surface"><Nav /><main id="contenu" className="mx-auto max-w-6xl px-5 py-16">
      <p className="text-xs font-bold uppercase tracking-[.2em] text-violet-700">Archives</p><h1 className="mt-3 font-heading text-5xl font-black sm:text-6xl">Articles</h1><p className="mt-5 text-lg text-[#687184]">Guides, retours d’expérience et réflexions sur le logiciel.</p>
      <form className="neo-card mt-10 flex flex-col gap-3 p-4 sm:flex-row"><input name="search" defaultValue={query.search} className="neo-field min-w-0 flex-1 px-5 py-3 outline-none" aria-label="Rechercher" placeholder="Rechercher…" />{query.category && <input type="hidden" name="category" value={query.category} />}<button className="neo-button bg-on-surface px-6 py-3 font-bold text-surface">Rechercher</button></form>
      {categories.length > 0 && <nav className="mt-7 flex flex-wrap gap-3" aria-label="Catégories"><Link href="/articles" className="neo-button bg-white px-4 py-2">Toutes</Link>{categories.map((category) => <Link key={category} href={`/articles?category=${encodeURIComponent(category)}`} className={`neo-button px-4 py-2 ${query.category === category ? "bg-primary text-white" : "bg-white"}`}>{category}</Link>)}</nav>}
      {error ? <div className="neo-card mt-10 bg-red-50 p-6 text-red-700">Impossible de charger les articles.</div> : data.articles.length ? <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">{data.articles.map((article) => <ArticleCard key={article.slug} href={`/articles/${article.slug}`} date={article.published_at || article.date} title={article.title} excerpt={article.excerpt} tag={article.tag} minutes={article.minutes} />)}</div> : <div className="neo-card mt-10 border-dashed p-12 text-center">Aucun article trouvé.</div>}
      {data.pages > 1 && <nav className="mt-10 flex justify-center gap-4" aria-label="Pagination">{page > 1 && <Link href={href(page - 1)}>← Précédent</Link>}<span>{page} / {data.pages}</span>{page < data.pages && <Link href={href(page + 1)}>Suivant →</Link>}</nav>}<Newsletter />
    </main><SiteFooter settings={settings} /></div>
  )
}
