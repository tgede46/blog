import type { Metadata } from "next"
import Link from "next/link"
import { setRequestLocale, getTranslations } from "next-intl/server"
import PublicPage from "@/components/PublicPage"
import { api, type PublicSettings } from "@/lib/api"

type Props = { params: Promise<{ locale: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: "Metadata" })
  return {
    title: t("aboutTitle"),
    description: t("aboutDescription"),
  }
}

export default async function AboutPage({ params }: Props) {
  const { locale } = await params
  setRequestLocale(locale)
  const t = await getTranslations("About")

  let settings: PublicSettings = {}
  try {
    settings = await api.settings.public()
  } catch {
    // Valeurs éditoriales par défaut.
  }

  return (
    <PublicPage>
      <p className="text-xs font-bold uppercase tracking-[.2em] text-violet-700">{t("title")}</p>
      <h1 className="mt-4 max-w-3xl font-heading text-5xl font-black leading-tight tracking-[-.04em] sm:text-6xl">{t("heading")}</h1>
      <div className="mt-10 grid gap-10 text-lg leading-8 text-[#596275] md:grid-cols-[1.3fr_.7fr]">
        <div className="space-y-6">
          <p>{settings.author_bio || t("defaultBio")}</p>
          {settings.about_content ? (
            <p className="whitespace-pre-line">{settings.about_content}</p>
          ) : (
            <>
              <p>{t("defaultContent1")}</p>
              <p>{t("defaultContent2")}</p>
            </>
          )}
        </div>
        <aside className="neo-card rotate-1 bg-primary-fixed p-7 text-base leading-7 text-[#393658]">
          <h2 className="font-heading text-xl font-bold">{t("workTogether")}</h2>
          <p className="mt-3">{t("workTogetherDesc")}</p>
          <Link href="/contact" className="mt-5 inline-block font-bold text-violet-700">{t("contactMe")} →</Link>
        </aside>
      </div>
    </PublicPage>
  )
}
