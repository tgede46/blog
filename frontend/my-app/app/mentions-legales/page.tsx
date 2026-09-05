import type { Metadata } from "next"
import PublicPage from "@/components/PublicPage"
import { api, type PublicSettings } from "@/lib/api"

export const metadata: Metadata = {
  title: "Mentions légales — Gedeon Kpara",
  robots: { index: true, follow: true },
}

export default async function LegalPage() {
  let settings: PublicSettings = {}
  try {
    settings = await api.settings.public()
  } catch {
    // Les champs inconnus sont explicitement signalés ci-dessous.
  }
  const owner = settings.legal_name || settings.author_name || "Gedeon Kpara"

  return (
    <PublicPage>
      <h1 className="font-heading text-5xl font-black tracking-[-.04em]">Mentions légales</h1>
      <div className="mt-10 space-y-9 text-base leading-8 text-[#596275]">
        <section><h2 className="font-heading text-2xl font-bold text-[#1d2433]">Éditeur</h2><p className="mt-2">Ce site est édité par {String(owner)}{settings.address ? `, ${String(settings.address)}` : ""}. Contact : {String(settings.email || "via le formulaire de contact")}.</p></section>
        <section><h2 className="font-heading text-2xl font-bold text-[#1d2433]">Hébergement</h2><p className="mt-2">Le frontend est prévu pour être hébergé par Vercel Inc., 440 N Barranca Ave #4133, Covina, CA 91723, États-Unis.</p></section>
        <section><h2 className="font-heading text-2xl font-bold text-[#1d2433]">Données personnelles</h2><p className="mt-2">Les formulaires transmettent uniquement les informations nécessaires au traitement de votre demande ou de votre abonnement. Vous pouvez demander leur rectification ou suppression via la page contact.</p></section>
        <section><h2 className="font-heading text-2xl font-bold text-[#1d2433]">Propriété intellectuelle</h2><p className="mt-2">Sauf mention contraire, les textes et créations de ce site appartiennent à {String(owner)}. Toute reproduction substantielle nécessite une autorisation préalable.</p></section>
      </div>
    </PublicPage>
  )
}
