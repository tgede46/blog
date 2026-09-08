"use client"

import Link from "next/link"
import { useTranslations } from "next-intl"
import type { PublicSettings } from "@/lib/api"
import BrandMark from "./BrandMark"

export default function SiteFooter({ settings = {} }: { settings?: PublicSettings }) {
  const t = useTranslations("Footer")
  const tNav = useTranslations("Nav")
  const socials = [["GitHub", settings.github_url], ["LinkedIn", settings.linkedin_url], ["X / Twitter", settings.x_url]].filter((item): item is [string, string] => typeof item[1] === "string" && Boolean(item[1]))
  return (
    <footer className="border-t-2 border-on-surface bg-tertiary-fixed">
      <div className="mx-auto grid max-w-6xl gap-10 px-5 py-14 md:grid-cols-[1.4fr_1fr_1fr]">
        <div>
          <BrandMark className="text-xl" />
          <p className="mt-4 max-w-sm leading-7 text-[#687184]">{String(settings.site_description || t("defaultDescription"))}</p>
        </div>
        <div>
          <h2 className="neo-eyebrow text-[#89909e]">{t("explore")}</h2>
          <div className="mt-4 flex flex-col gap-3 font-semibold">
            <Link href="/articles">{tNav("articles")}</Link>
            <Link href="/a-propos">{tNav("about")}</Link>
            <Link href="/contact">{tNav("contact")}</Link>
            <Link href="/mentions-legales">{t("legalNotices")}</Link>
          </div>
        </div>
        <div>
          <h2 className="neo-eyebrow text-[#89909e]">{t("follow")}</h2>
          <div className="mt-4 flex flex-col gap-3 font-semibold">
            {socials.map(([label, href]) => <a key={label} href={href} target="_blank" rel="noreferrer">{label}</a>)}
            <a href="/feed.xml">{t("rssFeed")}</a>
          </div>
        </div>
      </div>
      <div className="border-t-2 border-on-surface py-5 text-center text-sm font-bold">© {new Date().getFullYear()} Gedeon Kpara.</div>
    </footer>
  )
}
