import Link from "next/link"
import ArticleCard from "./ArticleCard"
import { api } from "@/lib/api"
import type { ArticleSummary } from "@/lib/articles"

export default async function Articles() {
  let articles: ArticleSummary[] = []
  try { articles = (await api.articles.list({ page: 1, limit: 4 })).articles } catch {}
  return (
    <section className="py-24">
      <div className="mb-12 flex flex-wrap items-end justify-between gap-6"><div><p className="text-xs font-bold uppercase tracking-[.2em] text-violet-700">Dernières publications</p><h2 className="mt-3 font-heading text-4xl font-black md:text-5xl">Notes &amp; articles</h2><p className="mt-4 max-w-xl text-lg leading-8 text-on-surface/70">Du concret sur les architectures, les outils et le métier de développeur.</p></div><Link href="/articles" className="border-b-2 border-tertiary-fixed font-bold uppercase tracking-wide">Voir toutes les publications →</Link></div>
      {articles.length ? <div className="grid gap-8 md:grid-cols-2">{articles.slice(0, 4).map((article) => <ArticleCard key={article.slug} href={`/articles/${article.slug}`} date={article.published_at || article.date} title={article.title} excerpt={article.excerpt} tag={article.tag} minutes={article.minutes} />)}</div> : <div className="border-2 border-dashed border-on-surface bg-white p-10 text-center text-on-surface/70">Les premiers articles arrivent bientôt.</div>}
    </section>
  )
}
