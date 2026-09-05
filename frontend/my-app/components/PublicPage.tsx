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
    <div className="graphic-grid min-h-screen bg-surface text-on-surface">
      <Nav />
      <main id="contenu" className="mx-auto max-w-5xl px-5 py-16">{children}</main>
      <SiteFooter settings={settings} />
    </div>
  )
}
