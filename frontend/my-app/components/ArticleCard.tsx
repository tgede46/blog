import React from "react"
import { ArrowUpRight } from "lucide-react"
import Link from "next/link"

type Props = {
  href: string
  date: string
  title: string
  excerpt: string
  tag?: string
  minutes?: string
}

export default function ArticleCard({ href, date, title, excerpt, tag, minutes = "10mn" }: Props) {
  return (
    <Link href={href} className="block bg-surface-container-lowest border-2 border-on-surface p-8 flex flex-col hard-shadow hover:-translate-y-1 hover:-translate-x-1 hover:shadow-[8px_8px_0px_0px_#212121] transition-all group">
      <div className="flex justify-between items-start mb-8">
        <div className="bg-tertiary-fixed border-2 border-on-surface px-3 py-1 font-headline font-bold text-xs uppercase tracking-wider hard-shadow-sm">{date}</div>
        <ArrowUpRight
          className="text-on-surface opacity-20 group-hover:text-on-primary group-hover:opacity-100 transition-all"
          size={16}
          aria-hidden
        />
      </div>
      {/* vertical accent bar removed as requested */}
      <h3 className="font-headline font-bold text-2xl mb-6 leading-tight group-hover:text-primary transition-colors">{title}</h3>
      <p className="text-on-surface/70 mb-10 leading-relaxed line-clamp-3">{excerpt}</p>
      <div className="mt-auto flex items-center justify-between border-t-2 border-on-surface/5 pt-6">
        <div className="flex items-center gap-2 text-xs font-headline font-bold uppercase tracking-widest text-on-surface/40">
          <span className="material-symbols-outlined text-sm">schedule</span>
          {minutes} de lecture
        </div>
        <div className="flex gap-2">
          {tag && (
            <span
              className="px-2 py-0.5 bg-ts-blue rounded-sm text-[10px] font-bold uppercase"
              style={{ border: "1px solid rgba(33,33,33,0.2)" }}
            >
              {tag}
            </span>
          )}
        </div>
      </div>
    </Link>
  )
}
