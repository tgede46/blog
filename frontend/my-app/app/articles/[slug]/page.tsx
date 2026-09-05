import type { Metadata } from "next"
import { notFound } from "next/navigation"
import Nav from "@/components/Nav"
import SiteFooter from "@/components/SiteFooter"
import Newsletter from "@/components/Newsletter"
import ArticleCard from "@/components/ArticleCard"
import CodeBlock from "@/components/CodeBlock"
import { api, type PublicSettings } from "@/lib/api"
import type { ArticleDetail, ArticleSummary } from "@/lib/articles"
import { formatDateFr, headingId, readingTime } from "@/lib/utils"

type Props = { params: Promise<{ slug: string }> }
async function article(slug: string): Promise<ArticleDetail | null> {
  try { return await api.articles.get(slug) } catch (error) { if ((error as Error & { status?: number }).status === 404) return null; throw error }
}
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const source = await article((await params).slug).catch(() => null)
  return source ? { title: source.title, description: source.excerpt, alternates: { canonical: `/articles/${source.slug}` }, openGraph: { type: "article", title: source.title, description: source.excerpt, publishedTime: source.published_at || source.date, images: source.image_url ? [source.image_url] : undefined } } : { title: "Article introuvable" }
}

export default async function ArticlePage({ params }: Props) {
  const source = await article((await params).slug)
  if (!source) notFound()
  let related: ArticleSummary[] = []; let settings: PublicSettings = {}
  ;[related, settings] = await Promise.all([api.articles.related(source.slug).catch(() => []), api.settings.public().catch(() => ({}))])
  const headings = source.content.map((block, index) => ({ block, index })).filter(({ block }) => block.type === "heading" && block.text)
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"
  const jsonLd = { "@context": "https://schema.org", "@type": "BlogPosting", headline: source.title, description: source.excerpt, datePublished: source.published_at || source.date, dateModified: source.updated_at || source.date, author: { "@type": "Person", name: source.author || settings.author_name || "Gedeon Kpara" }, mainEntityOfPage: `${siteUrl}/articles/${source.slug}` }
  return (
    <div className="min-h-screen bg-[#fbfaf7] text-[#1d2433]"><Nav /><script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }} /><main id="contenu" className="mx-auto max-w-6xl px-5 py-14">
      <header className="mx-auto max-w-4xl text-center"><div className="flex justify-center gap-2 text-xs font-bold uppercase"><span className="rounded-full bg-[#dff3e5] px-4 py-2">{source.category}</span><span className="rounded-full bg-[#e3e8fb] px-4 py-2">{source.tag}</span></div><h1 className="mt-7 font-heading text-4xl font-black leading-tight sm:text-6xl">{source.title}</h1><p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-[#687184]">{source.excerpt}</p><p className="mt-5 text-sm text-[#858b98]">{formatDateFr(source.published_at || source.date)} · {readingTime(source.minutes)}</p></header>
      <div className="mt-16 grid items-start gap-12 lg:grid-cols-[220px_minmax(0,720px)] lg:justify-center"><aside className="hidden lg:sticky lg:top-28 lg:block"><h2 className="text-xs font-bold uppercase text-[#858b98]">Sommaire</h2><nav className="mt-5 space-y-3 border-l border-black/10 pl-4 text-sm">{headings.map(({ block, index }) => <a key={index} href={`#${headingId(block.text || "", index)}`}>{block.text}</a>)}</nav></aside>
      <article className="min-w-0"><div className="space-y-6 text-[1.08rem] leading-8 text-[#343b4a]">{source.intro && <p className="text-xl font-medium leading-9">{source.intro}</p>}{source.content.map((block, index) => {
        if (block.type === "paragraph") return <p key={index}>{block.text}</p>
        if (block.type === "heading") return <h2 key={index} id={headingId(block.text || "", index)} className="scroll-mt-28 pt-8 font-heading text-3xl font-bold">{block.text}</h2>
        if (block.type === "code") return <CodeBlock key={index} code={block.code || ""} filename={block.filename} />
        if (block.type === "callout") return <blockquote key={index} className="rounded-2xl border-l-4 border-violet-500 bg-[#eeeafb] p-6">{block.text}</blockquote>
        if (block.type === "image" && block.url) return <figure key={index}>{/* eslint-disable-next-line @next/next/no-img-element */}<img src={block.url} alt={block.alt || block.caption || ""} className="w-full rounded-2xl" /><figcaption className="mt-2 text-center text-sm">{block.caption}</figcaption></figure>
        return null
      })}</div><div className="mt-14 rounded-2xl bg-white p-7"><p className="text-xs font-bold uppercase text-violet-700">Écrit par</p><h2 className="mt-2 font-heading text-2xl font-bold">{String(settings.author_name || "Gedeon Kpara")}</h2><p className="mt-3 text-[#687184]">{String(settings.author_bio || "Développeur et auteur de ce blog.")}</p></div></article></div>
      {related.length > 0 && <section className="mt-24"><h2 className="mb-8 font-heading text-3xl font-black">À lire ensuite</h2><div className="grid gap-6 md:grid-cols-3">{related.slice(0, 3).map((item) => <ArticleCard key={item.slug} href={`/articles/${item.slug}`} date={item.published_at || item.date} title={item.title} excerpt={item.excerpt} tag={item.tag} minutes={item.minutes} />)}</div></section>}<Newsletter />
    </main><SiteFooter settings={settings} /></div>
  )
}
