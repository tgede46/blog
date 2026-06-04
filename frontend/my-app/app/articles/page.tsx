import React from "react"
import ArticleCard from "../../components/ArticleCard"
import SiteFooter from "../../components/SiteFooter"
import { articles } from "../../lib/articles"

export default function ArticlesPage() {
  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        <main className="lg:col-span-2">
          <div className="mb-8">
            <div className="inline-block px-3 py-1 bg-surface-container-lowest border-2 border-on-surface font-headline font-bold text-xs uppercase tracking-widest hard-shadow-sm mb-4">
              CATEGORY ARCHIVE
            </div>
            <h1 className="font-headline font-bold text-4xl md:text-5xl tracking-tight">Articles on <span className="underline decoration-tertiary-fixed decoration-8">JavaScript</span></h1>
            <p className="text-on-surface/60 mt-4">Exploring modern JavaScript ecosystems, from engine internals to high-level framework patterns. Built with precision and a touch of anarchy.</p>
          </div>

          <div className="space-y-8">
            {articles.map((a) => (
              <ArticleCard key={a.slug} href={`/articles/${a.slug}`} date={a.date} title={a.title} excerpt={a.excerpt} tag={a.tag} minutes={a.minutes} />
            ))}
          </div>

          <div className="pt-12">
            <button className="px-6 py-3 border-2 border-on-surface font-headline uppercase tracking-widest">Load more articles ↓</button>
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

            <div>
              <h4 className="font-headline font-bold uppercase text-sm tracking-widest">TOPICS</h4>
              <ul className="mt-4 space-y-3 text-on-surface/90">
                <li className="flex items-center justify-between"><span className="flex items-center gap-3"><span className="inline-block w-2 h-2 rounded-full bg-primary"/>JavaScript</span><span className="ml-4 text-xs bg-surface-container-lowest px-2 py-0.5 rounded">24</span></li>
                <li className="flex items-center justify-between"><span className="flex items-center gap-3"><span className="inline-block w-2 h-2 rounded-full bg-ts-blue"/>TypeScript</span><span className="ml-4 text-xs bg-surface-container-lowest px-2 py-0.5 rounded">18</span></li>
                <li className="flex items-center justify-between"><span className="flex items-center gap-3"><span className="inline-block w-2 h-2 rounded-full bg-node-green"/>Node.js</span><span className="ml-4 text-xs bg-surface-container-lowest px-2 py-0.5 rounded">12</span></li>
                <li className="flex items-center justify-between"><span className="flex items-center gap-3"><span className="inline-block w-2 h-2 rounded-full bg-primary-fixed"/>CSS & Design</span><span className="ml-4 text-xs bg-surface-container-lowest px-2 py-0.5 rounded">9</span></li>
                <li className="flex items-center justify-between"><span className="flex items-center gap-3"><span className="inline-block w-2 h-2 rounded-full bg-surface-container-lowest"/>Personal</span><span className="ml-4 text-xs bg-surface-container-lowest px-2 py-0.5 rounded">5</span></li>
              </ul>
            </div>

            <div className="border-2 border-on-surface p-6 bg-tertiary-fixed relative">
              <div className="absolute -right-3 -bottom-3 w-3 h-3 bg-on-surface" />
              <h4 className="font-headline font-bold text-lg text-on-tertiary-fixed">Stay Synchronized</h4>
              <p className="mt-2 text-on-tertiary-fixed/90">Join 2,434+ developers receiving monthly technical insights and architectural deep dives. No fluff, just code.</p>
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
  )
}
