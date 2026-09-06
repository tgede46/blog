import type { Metadata } from "next"
import { setRequestLocale, getTranslations } from "next-intl/server"
import PublicPage from "@/components/PublicPage"
import { api, type PublicSettings } from "@/lib/api"

type Props = { params: Promise<{ locale: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: "Metadata" })
  return {
    title: t("legalTitle"),
    robots: { index: true, follow: true },
  }
}

export default async function LegalPage({ params }: Props) {
  const { locale } = await params
  setRequestLocale(locale)
  const t = await getTranslations("Legal")

  let settings: PublicSettings = {}
  try {
    settings = await api.settings.public()
  } catch {
    // Les champs inconnus sont explicitement signalés ci-dessous.
  }
  const owner = settings.legal_name || settings.author_name || "Gedeon Kpara"

  return (
    <PublicPage>
      <h1 className="font-heading text-5xl font-black tracking-[-.04em]">{t("title")}</h1>
      <div className="mt-10 space-y-9 text-base leading-8 text-[#596275]">
        <section><h2 className="font-heading text-2xl font-bold text-[#1d2433]">{t("publisher")}</h2><p className="mt-2">{t("publisherDesc", { owner, address: settings.address || "", email: settings.contact_email || "" })}</p></section>
        <section><h2 className="font-heading text-2xl font-bold text-[#1d2433]">{t("hosting")}</h2><p className="mt-2">{t("hostingDesc")}</p></section>
        <section><h2 className="font-heading text-2xl font-bold text-[#1d2433]">{t("personalData")}</h2><p className="mt-2">{t("personalDataDesc")}</p></section>
        <section><h2 className="font-heading text-2xl font-bold text-[#1d2433]">{t("intellectualProperty")}</h2><p className="mt-2">{t("intellectualPropertyDesc", { owner })}</p></section>
        {settings.legal_content && <section><h2 className="font-heading text-2xl font-bold text-[#1d2433]">{t("additionalInfo")}</h2><p className="mt-2 whitespace-pre-line">{settings.legal_content}</p></section>}
      </div>
    </PublicPage>
  )
}
