import type { Metadata } from "next"
import PublicPage from "@/components/PublicPage"
import ContactForm from "@/components/ContactForm"

export const metadata: Metadata = {
  title: "Contact — Gedeon Kpara",
  description: "Écrivez à Gedeon Kpara.",
}

export default function ContactPage() {
  return (
    <PublicPage>
      <p className="text-xs font-bold uppercase tracking-[.2em] text-violet-700">Contact</p>
      <h1 className="mt-4 font-heading text-5xl font-black tracking-[-.04em] sm:text-6xl">Parlons de votre idée.</h1>
      <p className="mt-5 max-w-2xl text-lg leading-8 text-[#596275]">Décrivez votre projet ou votre question. Je répondrai dès que possible, sans ajouter votre adresse à une liste.</p>
      <ContactForm />
    </PublicPage>
  )
}
