import Link from "next/link"
import { ArrowUpRight } from "lucide-react"
import { formatDateFr, readingTime } from "@/lib/utils"

type Props = { href: string; date: string; title: string; excerpt: string; tag?: string; minutes?: string | number }

export default function ArticleCard({ href, date, title, excerpt, tag, minutes }: Props) {
  return (
    <Link href={href} className="group flex h-full flex-col rounded-3xl border border-black/10 bg-white p-7 transition-all hover:-translate-y-1 hover:shadow-xl">
      <div className="mb-7 flex justify-between text-xs font-bold uppercase tracking-wider text-[#737b8d]"><span>{formatDateFr(date)}</span><ArrowUpRight size={20} /></div>
      <h3 className="mb-4 font-heading text-2xl font-bold leading-tight group-hover:text-violet-700">{title}</h3>
      <p className="mb-8 line-clamp-3 leading-7 text-[#687184]">{excerpt}</p>
      <div className="mt-auto flex items-center justify-between border-t border-black/10 pt-5 text-xs font-bold uppercase tracking-wider text-[#858b98]"><span>{readingTime(minutes)}</span>{tag && <span className="rounded-full bg-[#dff3e5] px-3 py-1 text-[#315c40]">{tag}</span>}</div>
    </Link>
  )
}
