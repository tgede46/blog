import Link from "next/link"
import ArticleCard from "./ArticleCard"
import { api } from "@/lib/api"
import type { ArticleSummary } from "@/lib/articles"

export default async function Articles() {
  let articles: ArticleSummary[] = []
  try { articles = (await api.articles.list({ page: 1, limit: 4 })).articles } catch {}
  return (
    <section className="py-20">
      <div className="mb-12 flex flex-wrap items-end justify-between gap-6"><div><p className="text-xs font-bold uppercase tracking-[.2em] text-violet-700">Dernières publications</p><h2 className="mt-3 font-heading text-4xl font-black md:text-5xl">Notes &amp; articles</h2><p className="mt-4 max-w-xl text-lg leading-8 text-[#687184]">Du concret sur les architectures, les outils et le métier de développeur.</p></div><Link href="/articles" className="font-bold text-violet-700">Voir toutes les publications →</Link></div>
      {articles.length ? <div className="grid gap-6 md:grid-cols-2">{articles.slice(0, 4).map((article) => <ArticleCard key={article.slug} href={`/articles/${article.slug}`} date={article.published_at || article.date} title={article.title} excerpt={article.excerpt} tag={article.tag} minutes={article.minutes} />)}</div> : <div className="rounded-2xl border border-dashed border-black/20 bg-white p-10 text-center text-[#687184]">Les premiers articles arrivent bientôt.</div>}
    </section>
  )
}
