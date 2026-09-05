import Link from "next/link"
import React from "react"
import ArticleCard from "./ArticleCard"

async function getLatestArticles() {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"}/api/articles?page=1`,
      { next: { revalidate: 60 } }
    )
    if (!res.ok) return []
    const data = await res.json()
    return data.articles ?? []
  } catch {
    return []
  }
}

export default async function Articles() {
  const articles = await getLatestArticles()

  return (
    <section className="py-24">
      <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
        <div className="space-y-4">
          <h2 className="font-headline font-bold text-4xl md:text-5xl tracking-tight">Mes derniers articles</h2>
          <p className="text-on-surface/60 text-lg max-w-xl">Explorations techniques, tutoriels approfondis et retours d&apos;expérience sur l&apos;écosystème JavaScript moderne.</p>
        </div>
        <Link className="font-headline font-bold uppercase tracking-widest text-sm border-b-2 border-tertiary-fixed hover:bg-tertiary-fixed transition-colors pb-1" href="/articles">
          Voir tous les articles
        </Link>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
        {articles.slice(0, 3).map((a: { slug: string; date: string; title: string; excerpt: string; tag: string; minutes: string }) => (
          <ArticleCard
            key={a.slug}
            href={`/articles/${a.slug}`}
            date={a.date}
            title={a.title}
            excerpt={a.excerpt}
            tag={a.tag}
            minutes={a.minutes}
          />
        ))}
      </div>
    </section>
  )
}
