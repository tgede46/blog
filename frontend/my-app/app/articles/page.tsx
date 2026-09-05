import React from "react"
import ArticleCard from "../../components/ArticleCard"
import SiteFooter from "../../components/SiteFooter"
import Nav from "../../components/Nav"

type Article = {
  slug: string
  date: string
  title: string
  excerpt: string
  tag: string
  minutes: string
}

async function getAllArticles(): Promise<Article[]> {
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

export default async function ArticlesPage() {
  const articles = await getAllArticles()

  return (
    <div className="bg-surface text-on-surface font-body selection:bg-tertiary-fixed">
      <Nav />
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          <main className="lg:col-span-2">
            <div className="mb-8">
              <div className="inline-block px-3 py-1 bg-surface-container-lowest border-2 border-on-surface font-headline font-bold text-xs uppercase tracking-widest hard-shadow-sm mb-4">
                ARCHIVES
              </div>
              <h1 className="font-headline font-bold text-4xl md:text-5xl tracking-tight">
                Tous les <span className="underline decoration-tertiary-fixed decoration-8">Articles</span>
              </h1>
              <p className="text-on-surface/60 mt-4">
                {articles.length} article{articles.length !== 1 ? "s" : ""} — explorations techniques, tutoriels et retours d&apos;expérience.
              </p>
            </div>

            <div className="space-y-8">
              {articles.map((a) => (
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
          </main>

          <aside className="lg:col-span-1">
            <div className="space-y-10">
              <div>
                <h4 className="font-headline font-bold uppercase text-sm tracking-widest">SEARCH</h4>
                <div className="mt-2">
                  <input className="w-full border-2 border-on-surface px-4 py-2 placeholder:text-on-surface/40" placeholder="Search articles..." />
                </div>
              </div>

              <div className="border-2 border-on-surface p-6 bg-tertiary-fixed relative">
                <div className="absolute -right-3 -bottom-3 w-3 h-3 bg-on-surface" />
                <h4 className="font-headline font-bold text-lg text-on-tertiary-fixed">Stay Synchronized</h4>
                <p className="mt-2 text-on-tertiary-fixed/90">Join developers receiving monthly technical insights and architectural deep dives. No fluff, just code.</p>
                <div className="mt-4">
                  <input className="w-full px-3 py-2 border border-on-surface" placeholder="Your email address" />
                  <button className="mt-3 w-full bg-[#212121] text-[#FDE047] font-bold px-3 py-2">SUBSCRIBE NOW</button>
                </div>
              </div>
            </div>
          </aside>
        </div>

        <SiteFooter />
      </div>
    </div>
  )
}

