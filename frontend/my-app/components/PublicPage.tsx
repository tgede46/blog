import type { ReactNode } from "react"
import { api, type PublicSettings } from "@/lib/api"
import Nav from "./Nav"
import SiteFooter from "./SiteFooter"

export default async function PublicPage({ children }: { children: ReactNode }) {
  let settings: PublicSettings = {}
  try {
    settings = await api.settings.public()
  } catch {
    // Les pages restent accessibles avec les valeurs par défaut.
  }

  return (
    <div className="min-h-screen bg-[#fbfaf7] text-[#1d2433]">
      <Nav />
      <main id="contenu" className="mx-auto max-w-4xl px-5 py-16">{children}</main>
      <SiteFooter settings={settings} />
    </div>
  )
}
