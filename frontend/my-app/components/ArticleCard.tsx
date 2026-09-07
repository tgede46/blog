import Link from "next/link"
import { ArrowUpRight } from "lucide-react"
import { formatDateFr, readingTime } from "@/lib/utils"

type Props = { href: string; date: string; title: string; excerpt: string; tag?: string; minutes?: string | number }

export default function ArticleCard({ href, date, title, excerpt, tag, minutes }: Props) {
  return (
    <Link href={href} className="group flex h-full flex-col border-2 border-on-surface bg-white p-7 hard-shadow transition-all hover:-translate-x-1 hover:-translate-y-1 hover:shadow-[8px_8px_0_0_#212121]">
      <div className="mb-7 flex items-start justify-between gap-4 text-xs font-bold uppercase tracking-wider"><span className="border-2 border-on-surface bg-tertiary-fixed px-3 py-1 hard-shadow-sm">{formatDateFr(date)}</span><ArrowUpRight size={22} className="transition-transform group-hover:-translate-y-1 group-hover:translate-x-1" /></div>
      <h3 className="mb-4 font-heading text-2xl font-bold leading-tight group-hover:underline group-hover:decoration-tertiary-fixed group-hover:decoration-4">{title}</h3>
      <p className="mb-8 line-clamp-3 leading-7 text-on-surface/70">{excerpt}</p>
      <div className="mt-auto flex items-center justify-between border-t-2 border-on-surface/10 pt-5 text-xs font-bold uppercase tracking-wider text-on-surface/60"><span>{readingTime(minutes)}</span>{tag && <span className="border border-on-surface/30 bg-node-green px-3 py-1 text-on-surface">{tag}</span>}</div>
    </Link>
  )
}
