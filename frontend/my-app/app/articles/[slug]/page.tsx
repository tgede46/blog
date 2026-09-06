import type { Metadata } from "next"
/* eslint-disable @next/next/no-img-element */
import { notFound } from "next/navigation"
import Nav from "@/components/Nav"
import SiteFooter from "@/components/SiteFooter"
import Newsletter from "@/components/Newsletter"
import ArticleCard from "@/components/ArticleCard"
import CodeBlock from "@/components/CodeBlock"
import Callout from "@/components/Callout"
import { api, type PublicSettings } from "@/lib/api"
import type { ArticleDetail, ArticleSummary } from "@/lib/articles"
import { formatDateFr, headingId, readingTime } from "@/lib/utils"

type Props = { params: Promise<{ slug: string }> }

async function article(slug: string): Promise<ArticleDetail | null> {
  try {
    return await api.articles.get(slug)
  } catch (error) {
    if ((error as Error & { status?: number }).status === 404) return null
    throw error
  }
}

function readingLabel(value?: string | number) {
  const label = readingTime(value)
  const match = String(label).match(/(\d+)/)
  return match ? `${match[1]}MN DE LECTURE` : "LECTURE RAPIDE"
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const source = await article((await params).slug).catch(() => null)
  return source
    ? {
        title: source.title,
        description: source.excerpt,
        alternates: { canonical: `/articles/${source.slug}` },
        openGraph: {
          type: "article",
          title: source.title,
          description: source.excerpt,
          publishedTime: source.published_at || source.date,
          images: source.image_url ? [source.image_url] : undefined,
        },
      }
    : { title: "Article introuvable" }
}

export default async function ArticlePage({ params }: Props) {
  const source = await article((await params).slug)
  if (!source) notFound()

  let related: ArticleSummary[] = []
  let settings: PublicSettings = {}
  ;[related, settings] = await Promise.all([
    api.articles.related(source.slug).catch(() => []),
    api.settings.public().catch(() => ({})),
  ])

  const headings = source.content
    .map((block, index) => ({ block, index }))
    .filter(({ block }) => block.type === "heading" && block.text)

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: source.title,
    description: source.excerpt,
    datePublished: source.published_at || source.date,
    dateModified: source.updated_at || source.date,
    author: {
      "@type": "Person",
      name: source.author || settings.author_name || "Gedeon Kpara",
    },
    mainEntityOfPage: `${siteUrl}/articles/${source.slug}`,
  }

  return (
    <div className="min-h-screen bg-[#fbfaf7] text-[#1d2433]">
      <Nav />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }}
      />
      <main id="contenu" className="mx-auto max-w-3xl px-5 py-14 sm:py-20">
        <header>
          <p className="inline bg-[#FDE047] px-1.5 py-0.5 text-sm font-semibold text-[#1d2433]">
            {formatDateFr(source.published_at || source.date)}
          </p>
          <h1 className="mt-4 max-w-[16ch] font-heading text-[clamp(2.4rem,7vw,3.75rem)] font-black leading-[1.05] tracking-[-0.04em]">
            {source.title}
          </h1>
          <p className="mt-5 text-xs font-bold uppercase tracking-[0.18em] text-[#6b7280]">
            {readingLabel(source.minutes)}
          </p>
        </header>

        {headings.length > 0 && (
          <nav className="mt-10 border-l-2 border-[#1d2433]/15 pl-4 sm:hidden" aria-label="Sommaire">
            <p className="mb-3 text-xs font-bold uppercase tracking-wider text-[#6b7280]">Sommaire</p>
            <div className="space-y-2 text-sm font-semibold">
              {headings.map(({ block, index }) => (
                <a key={index} href={`#${headingId(block.text || "", index)}`} className="block text-[#4b5563]">
                  {block.text}
                </a>
              ))}
            </div>
          </nav>
        )}

        <article className="mt-12 sm:mt-16">
          {(source.intro || source.excerpt) && (
            <p className="mb-8 text-[1.2rem] font-medium leading-9 text-[#1d2433]">
              {source.intro || source.excerpt}
            </p>
          )}

          <div className="space-y-7 text-[1.05rem] leading-8 text-[#374151]">
            {source.content.map((block, index) => {
              if (block.type === "paragraph") {
                return <p key={index}>{block.text}</p>
              }
              if (block.type === "heading") {
                return (
                  <h2
                    key={index}
                    id={headingId(block.text || "", index)}
                    className="scroll-mt-28 pt-6 font-heading text-3xl font-black tracking-[-0.03em] text-[#1d2433]"
                  >
                    {block.text}
                  </h2>
                )
              }
              if (block.type === "code") {
                return <CodeBlock key={index} code={block.code || ""} filename={block.filename} />
              }
              if (block.type === "callout") {
                return (
                  <Callout key={index} variant={block.variant === "tip" ? "tip" : "quote"}>
                    {block.text}
                  </Callout>
                )
              }
              if (block.type === "image" && (block.url || block.text)) {
                const imageUrl = block.url || block.text || ""
                return (
                  <figure key={index} className="my-10">
                    <img src={imageUrl} alt={block.alt || block.caption || ""} className="w-full" />
                    {block.caption && (
                      <figcaption className="mt-3 text-center text-sm text-[#6b7280]">{block.caption}</figcaption>
                    )}
                  </figure>
                )
              }
              return null
            })}
          </div>

          <div className="mt-16 border-t border-[#1d2433]/10 pt-8">
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#6b7280]">Écrit par</p>
            <h2 className="mt-2 font-heading text-2xl font-black">
              {String(settings.author_name || "Gedeon Kpara")}
            </h2>
            <p className="mt-3 max-w-xl leading-7 text-[#596275]">
              {String(settings.author_bio || "Développeur et auteur de ce blog.")}
            </p>
          </div>
        </article>

        {related.length > 0 && (
          <section className="mt-20">
            <h2 className="mb-8 font-heading text-3xl font-black">À lire ensuite</h2>
            <div className="grid gap-6 md:grid-cols-2">
              {related.slice(0, 2).map((item) => (
                <ArticleCard
                  key={item.slug}
                  href={`/articles/${item.slug}`}
                  date={item.published_at || item.date}
                  title={item.title}
                  excerpt={item.excerpt}
                  tag={item.tag}
                  minutes={item.minutes}
                />
              ))}
            </div>
          </section>
        )}

        <Newsletter />
      </main>
      <SiteFooter settings={settings} />
    </div>
  )
}
