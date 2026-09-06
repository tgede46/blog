import type { Metadata } from "next"
import { getTranslations } from "next-intl/server"

type Props = { params: Promise<{ locale: string }>; children: React.ReactNode }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: "Metadata" })
  return {
    title: t("articlesTitle"),
    description: t("articlesDescription"),
  }
}

export default function ArticlesLayout({ children }: { children: React.ReactNode }) {
  return children
}
