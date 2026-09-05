"use client"

import { useState } from "react"
import { api } from "@/lib/api"

export default function Newsletter() {
  const [email, setEmail] = useState("")
  const [message, setMessage] = useState("")
  const [loading, setLoading] = useState(false)
  async function subscribe(event: React.FormEvent) {
    event.preventDefault(); setLoading(true); setMessage("")
    try { const result = await api.newsletter.subscribe(email); setMessage(result.message || "Inscription confirmée. Merci !"); setEmail("") }
    catch (error) { setMessage(error instanceof Error ? error.message : "Inscription impossible.") }
    finally { setLoading(false) }
  }
  return (
    <section id="newsletter" className="relative my-24 overflow-hidden border-2 border-on-surface bg-[#1d2433] px-7 py-14 text-white hard-shadow-lg sm:px-14">
      <div className="grid items-center gap-10 lg:grid-cols-2"><div><p className="text-xs font-bold uppercase tracking-[.2em] text-[#f5d989]">Notes de terrain</p><h2 className="mt-3 font-heading text-3xl font-bold md:text-4xl">Un email utile, de temps en temps.</h2><p className="mt-4 leading-7 text-white/65">Nouveaux articles et ressources choisies. Pas de bruit.</p></div>
      <form onSubmit={subscribe}><div className="flex flex-col gap-4 sm:flex-row"><label className="sr-only" htmlFor="newsletter-email">Votre email</label><input id="newsletter-email" value={email} onChange={(event) => setEmail(event.target.value)} type="email" required className="min-w-0 flex-1 border-2 border-white/40 bg-white/10 px-6 py-4 outline-none focus:border-tertiary-fixed" placeholder="vous@exemple.fr" /><button disabled={loading} className="neo-button border-white bg-[#f5d989] px-7 py-4 font-bold text-[#1d2433] shadow-[4px_4px_0_0_#fff]">{loading ? "Envoi…" : "S’inscrire"}</button></div><p className="mt-3 min-h-6 text-sm text-white/70" aria-live="polite">{message}</p></form></div>
    </section>
  )
}
