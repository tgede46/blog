"use client"

import { useState } from "react"
import { api } from "@/lib/api"

export default function ContactForm() {
  const [status, setStatus] = useState("")
  const [loading, setLoading] = useState(false)

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setLoading(true)
    setStatus("")
    const form = new FormData(event.currentTarget)
    try {
      const response = await api.contact.send({
        name: String(form.get("name") || ""),
        email: String(form.get("email") || ""),
        subject: String(form.get("subject") || ""),
        message: String(form.get("message") || ""),
      })
      setStatus(response.message || "Votre message a bien été envoyé.")
      event.currentTarget.reset()
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "L’envoi a échoué. Réessayez.")
    } finally {
      setLoading(false)
    }
  }

  const fieldClass = "neo-field mt-2 w-full px-4 py-3 outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-100"

  return (
    <form onSubmit={submit} className="neo-card mt-10 space-y-5 p-6 sm:p-9">
      <div className="grid gap-5 sm:grid-cols-2">
        <label className="font-semibold">Nom<input className={fieldClass} name="name" autoComplete="name" required /></label>
        <label className="font-semibold">Email<input className={fieldClass} name="email" type="email" autoComplete="email" required /></label>
      </div>
      <label className="block font-semibold">Sujet<input className={fieldClass} name="subject" required /></label>
      <label className="block font-semibold">Message<textarea className={`${fieldClass} min-h-44 resize-y`} name="message" required /></label>
      <div className="flex flex-wrap items-center gap-5">
        <button disabled={loading} className="neo-button bg-tertiary-fixed px-7 py-3.5 font-black uppercase tracking-wide disabled:opacity-60">{loading ? "Envoi…" : "Envoyer le message"}</button>
        <p aria-live="polite" className="text-sm text-[#596275]">{status}</p>
      </div>
    </form>
  )
}
