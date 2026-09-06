import type { Metadata } from "next"
import { setRequestLocale } from "next-intl/server"
import { getTranslations } from "next-intl/server"
import PublicPage from "@/components/PublicPage"
import ContactForm from "@/components/ContactForm"

type Props = { params: Promise<{ locale: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: "Metadata" })
  return {
    title: t("contactTitle"),
    description: "Contactez Gedeon Kpara pour des projets, collaborations ou questions.",
  }
}

export default async function ContactPage({ params }: Props) {
  const { locale } = await params
  setRequestLocale(locale)
  const t = await getTranslations("Contact")

  return (
    <PublicPage>
      <p className="text-xs font-bold uppercase tracking-[.2em] text-violet-700">{t("title")}</p>
      <h1 className="mt-4 max-w-3xl font-heading text-5xl font-black leading-tight tracking-[-.04em] sm:text-6xl">{t("title")}</h1>
      <ContactForm />
    </PublicPage>
  )
}
