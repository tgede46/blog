import Image from "next/image"
import Link from "next/link"
import { notFound } from "next/navigation"
import React from "react"
import SiteFooter from "../../../components/SiteFooter"

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"

type PageProps = {
  params: Promise<{ slug: string }>
}

async function getArticle(slug: string) {
  try {
    const res = await fetch(`${API_BASE}/api/articles/${slug}`, { next: { revalidate: 60 } })
    if (!res.ok) return null
    return await res.json()
  } catch {
    return null
  }
}

async function getRelated(currentSlug: string) {
  try {
    const res = await fetch(`${API_BASE}/api/articles?page=1`, { next: { revalidate: 60 } })
    if (!res.ok) return []
    const data = await res.json()
    return (data.articles ?? []).filter((a: { slug: string }) => a.slug !== currentSlug).slice(0, 3)
  } catch {
    return []
  }
}

export default async function ArticlePage({ params }: PageProps) {
  const { slug } = await params
  const source = await getArticle(slug)

  if (!source) {
    notFound()
  }

  const related = await getRelated(slug)
  const headings = source.content.filter((block: { type: string }) => block.type === "heading")


  return (
    <div className="bg-[#fcf9f8] text-on-surface font-serif">
      <main className="mx-auto max-w-[1340px] px-4 py-4 sm:px-6 sm:py-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-[240px_minmax(0,1fr)] lg:gap-10 items-start">
          <aside className="space-y-10 lg:sticky lg:top-8">
            <section>
              <h4 className="font-headline text-[12px] font-bold uppercase tracking-[0.28em] pb-4 border-b border-on-surface/70">Contents</h4>
              <nav className="mt-5 space-y-4 text-[11px] uppercase tracking-[0.18em] font-bold text-on-surface/70">
                {headings.map((block, index) => (
                  <a key={`${block.text}-${index}`} href={`#section-${index}`} className="block transition-colors hover:text-on-surface">
                    {block.text}
                  </a>
                ))}
              </nav>
            </section>

            <section className="border-2 border-on-surface bg-surface-container-lowest p-5 shadow-[4px_4px_0px_0px_#212121]">
              <h4 className="font-headline text-[12px] font-bold uppercase tracking-[0.28em] mb-4">Newsletter</h4>
              <p className="max-w-[18ch] text-sm leading-7 text-on-surface/75">Get tactical ship-ready updates delivered straight to your inbox.</p>
              <input className="mt-4 w-full border-2 border-on-surface bg-white px-3 py-3 text-sm placeholder:text-on-surface/35" placeholder="email@example.com" />
              <button className="mt-4 w-full bg-[#262626] px-4 py-3 text-[12px] font-bold uppercase tracking-[0.22em] text-white">
                Join 25K Devs
              </button>
            </section>
          </aside>

          <article className="pb-12">
            <header className="border-2 border-on-surface bg-[#d7f7db] p-5 shadow-[4px_4px_0px_0px_#212121] sm:p-6 md:p-8 lg:p-10">
              <div className="flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center border border-on-surface bg-white px-3 py-1 text-[10px] font-bold uppercase tracking-[0.22em]">
                  {source.tag}
                </span>
                <span className="inline-flex items-center border border-on-surface bg-white px-3 py-1 text-[10px] font-bold uppercase tracking-[0.22em]">
                  {source.category}
                </span>
              </div>
              <h1 className="mt-5 max-w-[13ch] text-[clamp(2.8rem,4.2vw,4.25rem)] font-black leading-[0.95] tracking-[-0.035em] text-on-surface">
                {source.title}
              </h1>
              <div className="mt-5 flex flex-wrap items-center gap-4 text-[11px] uppercase tracking-[0.18em] text-on-surface/70">
                <span>◻ {source.date}</span>
                <span>◎ {source.minutes}</span>
                <Link href="#" className="border-b border-tertiary-fixed text-[#6f6200]">
                  Gedeon Kpara
                </Link>
              </div>
            </header>

            <div className="mt-8 space-y-5 text-[1rem] leading-8 text-[#2c2b29]">
              <p className="first-letter:float-left first-letter:mr-2 first-letter:mt-1 first-letter:text-5xl first-letter:font-black first-letter:leading-none first-letter:text-on-surface">
                {source.intro}
              </p>

              {source.content.map((block, index) => {
                if (block.type === "paragraph") {
                  return <p key={index}>{block.text}</p>
                }

                if (block.type === "heading") {
                  return (
                    <h2 key={index} id={`section-${index}`} className="pt-4 text-xl font-normal leading-tight text-on-surface">
                      {block.text}
                    </h2>
                  )
                }

                if (block.type === "code") {
                  return (
                    <div key={index} className="overflow-hidden border border-[#2d2d2d] bg-[#222] text-[#d7d7d7] shadow-[4px_4px_0px_0px_#212121]">
                      <div className="flex items-center justify-between border-b border-white/10 bg-[#2b2b2b] px-4 py-2 text-[10px] uppercase tracking-[0.22em] text-white/50">
                        <span>{block.filename ?? "snippet.ts"}</span>
                        <div className="flex items-center gap-1.5">
                          <span className="h-2 w-2 rounded-full bg-[#ff5f56]" />
                          <span className="h-2 w-2 rounded-full bg-[#ffbd2e]" />
                          <span className="h-2 w-2 rounded-full bg-[#27c93f]" />
                        </div>
                      </div>
                      <pre className="overflow-x-auto px-5 py-5 font-mono text-[0.94rem] leading-8 text-[#d7d7d7]">
                        <code>{block.code}</code>
                      </pre>
                    </div>
                  )
                }

                if (block.type === "callout") {
                  return (
                    <blockquote key={index} className="relative border-2 border-on-surface bg-[#f5d7e8] p-5 pt-6 shadow-[4px_4px_0px_0px_#212121]">
                      <span className="absolute -top-3 left-3 border border-on-surface bg-[#2a2a2a] px-2 py-1 text-[9px] font-bold uppercase tracking-[0.22em] text-white">
                        Key takeaway
                      </span>
                      <p className="text-[1rem] font-bold leading-8 text-on-surface">{block.text}</p>
                    </blockquote>
                  )
                }

                if (block.type === "image") {
                  return (
                    <figure key={index} className="py-8">
                      <div className="overflow-hidden border-2 border-on-surface bg-[#111] shadow-[4px_4px_0px_0px_#212121]">
                        <Image
                          src="https://lh3.googleusercontent.com/aida-public/AB6AXuAjv-WVi68JkRH1ksbhp_ZL8dbplUsZt7ykqPE5ZyHLKoawEkob6X7Oj65Bn1cKlweaNn_HWO40T3l9LuTG8RrzkwuE4P-JbDcGP4aCHhsf47C5t1mjmQdfkn1a0a3IEC06IPTmqQxFIHKdEjJ0sg3pMEgj_uyscFYp3SFBPfTiaKa9N3lxhpGqV5wbH1LDEBcirEuudqlTo4eySBgjDAv347cFQe9viQ8Oi--9GL-pm6jCPIKnXykoE6wWbA6sJIF4HjzJJRWDmS2q"
                          alt="Code on a monitor"
                          width={1200}
                          height={900}
                          className="h-auto w-full object-cover"
                        />
                      </div>
                      {block.caption ? (
                        <figcaption className="mt-2 text-center text-[10px] italic uppercase tracking-[0.22em] text-on-surface/55">
                          {block.caption}
                        </figcaption>
                      ) : null}
                    </figure>
                  )
                }

                return null
              })}

              <section className="pt-8">
                <h2 className="mb-5 text-2xl font-bold text-on-surface">Written by Gedeon Kpara</h2>
                <div className="flex items-center gap-4 border-2 border-on-surface bg-white p-5 shadow-[4px_4px_0px_0px_#212121]">
                  <div className="h-16 w-16 rounded-full border-2 border-on-surface bg-[url('https://avatars.githubusercontent.com/u/9919?v=4')] bg-cover bg-center" />
                  <div className="space-y-2">
                    <p className="max-w-4xl text-[0.95rem] leading-7 text-on-surface/80">
                      Full-stack engineer and open-source enthusiast. I write about scalable architectures, Node.js internals, and why you should probably use more TypeScript.
                    </p>
                    <div className="flex flex-wrap gap-4 text-xs font-bold uppercase tracking-[0.18em]">
                      <a href="#" className="border-b border-tertiary-fixed text-on-surface">
                        Follow on Twitter
                      </a>
                      <a href="#" className="border-b border-tertiary-fixed text-on-surface">
                        RSS Feed
                      </a>
                    </div>
                  </div>
                </div>
              </section>
            </div>
          </article>
        </div>

        <section className="mt-16 border-t-2 border-on-surface pt-8">
          <div className="mb-6 flex items-center justify-between gap-4">
            <h2 className="text-2xl font-black uppercase tracking-tight text-on-surface">Continue Reading</h2>
            <Link href="/articles" className="text-xs font-bold uppercase tracking-[0.24em] text-on-surface">
              View archive →
            </Link>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {related.map((item) => (
              <Link key={item.slug} href={`/articles/${item.slug}`} className="overflow-hidden border-2 border-on-surface bg-white shadow-[4px_4px_0px_0px_#212121] transition-transform hover:-translate-y-1">
                <div className="relative h-40 bg-[#7f9ea3]">
                  <Image
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuAjv-WVi68JkRH1ksbhp_ZL8dbplUsZt7ykqPE5ZyHLKoawEkob6X7Oj65Bn1cKlweaNn_HWO40T3l9LuTG8RrzkwuE4P-JbDcGP4aCHhsf47C5t1mjmQdfkn1a0a3IEC06IPTmqQxFIHKdEjJ0sg3pMEgj_uyscFYp3SFBPfTiaKa9N3lxhpGqV5wbH1LDEBcirEuudqlTo4eySBgjDAv347cFQe9viQ8Oi--9GL-pm6jCPIKnXykoE6wWbA6sJIF4HjzJJRWDmS2q"
                    alt={item.title}
                    fill
                    className="object-cover opacity-80"
                  />
                </div>
                <div className="p-4">
                  <div className="mb-2 text-[10px] font-bold uppercase tracking-[0.22em] text-on-surface/70">{item.tag}</div>
                  <h3 className="text-lg font-bold leading-snug text-on-surface">{item.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-on-surface/70">{item.excerpt}</p>
                </div>
              </Link>
            ))}
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  )
}
