import { setRequestLocale } from "next-intl/server"
import Nav from "@/components/Nav"
import Hero from "@/components/Hero"
import Articles from "@/components/Articles"
import Newsletter from "@/components/Newsletter"
import SiteFooter from "@/components/SiteFooter"
import { api, type PublicSettings } from "@/lib/api"

type Props = {
  params: Promise<{ locale: string }>
  searchParams: Promise<{ login?: string; next?: string }>
}

export default async function HomePage({ params, searchParams }: Props) {
  const { locale } = await params
  setRequestLocale(locale)

  const [loginRequired, loginNext, settings] = await Promise.all([
    searchParams.then((sp) => sp.login === "required"),
    searchParams.then((sp) => sp.next),
    api.settings.public().catch(() => ({} as PublicSettings)),
  ])

  return (
    <div className="min-h-screen bg-[#fbfaf7] text-[#1d2433]">
      <Nav loginRequired={loginRequired} loginNext={loginNext} />
      <main id="contenu">
        <Hero title={settings.hero_title} description={settings.hero_description} />
        <Articles />
        <Newsletter />
      </main>
      <SiteFooter settings={settings} />
    </div>
  )
}
