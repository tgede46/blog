import Nav from "@/components/Nav"
import Hero from "@/components/Hero"
import Articles from "@/components/Articles"
import Newsletter from "@/components/Newsletter"
import SiteFooter from "@/components/SiteFooter"
import { api, type PublicSettings } from "@/lib/api"

export const revalidate = 60

export default async function Home({ searchParams }: { searchParams: Promise<{ login?: string }> }) {
  const query = await searchParams
  let settings: PublicSettings = {}
  try { settings = await api.settings.public() } catch {}
  return (
    <div className="min-h-screen bg-[#fbfaf7] text-[#1d2433]">
      <Nav loginRequired={query.login === "required"} />
      <main id="contenu" className="mx-auto max-w-6xl px-5"><Hero description={typeof settings.site_description === "string" ? settings.site_description : undefined} /><Articles /><Newsletter /></main>
      <SiteFooter settings={settings} />
    </div>
  )
}
