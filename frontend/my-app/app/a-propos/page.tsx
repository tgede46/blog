import type { Metadata } from "next"
import Link from "next/link"
import PublicPage from "@/components/PublicPage"
import { api, type PublicSettings } from "@/lib/api"

export const metadata: Metadata = {
  title: "À propos — Gedeon Kpara",
  description: "Le parcours et la démarche de Gedeon Kpara.",
}

export default async function AboutPage() {
  let settings: PublicSettings = {}
  try {
    settings = await api.settings.public()
  } catch {
    // Valeurs éditoriales par défaut.
  }

  return (
    <PublicPage>
      <p className="text-xs font-bold uppercase tracking-[.2em] text-violet-700">À propos</p>
      <h1 className="mt-4 max-w-3xl font-heading text-5xl font-black leading-tight tracking-[-.04em] sm:text-6xl">Construire avec clarté, partager sans détour.</h1>
      <div className="mt-10 grid gap-10 text-lg leading-8 text-[#596275] md:grid-cols-[1.3fr_.7fr]">
        <div className="space-y-6">
          <p>{settings.author_bio || "Je suis Gedeon Kpara, développeur logiciel. J’aime transformer des problèmes complexes en produits simples, fiables et agréables à utiliser."}</p>
          {settings.about_content ? (
            <p className="whitespace-pre-line">{settings.about_content}</p>
          ) : (
            <>
              <p>Ce blog rassemble mes apprentissages sur l’architecture, le développement web, les outils et les choix humains derrière un bon produit.</p>
              <p>Chaque article cherche à être concret : un contexte, une décision, ses compromis et ce que j’en retiens.</p>
            </>
          )}
        </div>
        <aside className="rounded-2xl bg-[#e9e5fb] p-7 text-base leading-7 text-[#393658]">
          <h2 className="font-heading text-xl font-bold">Travaillons ensemble</h2>
          <p className="mt-3">Un projet, une idée d’article ou simplement une question ?</p>
          <Link href="/contact" className="mt-5 inline-block font-bold text-violet-700">Me contacter →</Link>
        </aside>
      </div>
    </PublicPage>
  )
}
