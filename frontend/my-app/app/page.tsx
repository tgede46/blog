import Nav from "@/components/Nav"
import Hero from "@/components/Hero"
import Articles from "@/components/Articles"
import Newsletter from "@/components/Newsletter"
import SiteFooter from "@/components/SiteFooter"
import { api, type PublicSettings } from "@/lib/api"

export const revalidate = 60

export default async function Home({ searchParams }: { searchParams: Promise<{ login?: string; next?: string }> }) {
  const query = await searchParams
  let settings: PublicSettings = {}
  try { settings = await api.settings.public() } catch {}
  return (
    <div className="graphic-grid min-h-screen bg-surface text-on-surface">
      <Nav loginRequired={query.login === "required"} loginNext={query.next} />
      <main id="contenu" className="mx-auto max-w-6xl px-5">
        <Hero title={settings.hero_title} description={settings.hero_description || settings.site_description} />
        <Articles />
        <Newsletter />
      </main>
      <SiteFooter settings={settings} />
    </div>
  )
}
