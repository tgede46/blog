"use client"

import { useEffect, useState } from "react"
import { api, type PublicSettings } from "@/lib/api"

const fields: Array<{ key: keyof PublicSettings; label: string; type?: string }> = [
  { key: "site_name", label: "Nom du site" },
  { key: "site_description", label: "Description du site" },
  { key: "author_name", label: "Nom de l’auteur" },
  { key: "author_bio", label: "Biographie" },
  { key: "email", label: "Email public", type: "email" },
  { key: "github_url", label: "URL GitHub", type: "url" },
  { key: "linkedin_url", label: "URL LinkedIn", type: "url" },
  { key: "twitter_url", label: "URL X / Twitter", type: "url" },
  { key: "legal_name", label: "Nom légal" },
  { key: "address", label: "Adresse légale" },
]

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<PublicSettings>({})
  const [message, setMessage] = useState("")
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.admin.settings.get()
      .then(setSettings)
      .catch((error) => setMessage(error instanceof Error ? error.message : "Chargement impossible."))
      .finally(() => setLoading(false))
  }, [])

  async function save(event: React.FormEvent) {
    event.preventDefault()
    setLoading(true)
    setMessage("")
    try {
      setSettings(await api.admin.settings.update(settings))
      setMessage("Réglages enregistrés.")
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Enregistrement impossible.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="mx-auto max-w-3xl">
      <p className="text-sm font-semibold text-violet-700">Personnalisation</p>
      <h1 className="mt-1 font-heading text-4xl font-black">Réglages</h1>
      <form onSubmit={save} className="mt-8 space-y-5 rounded-2xl border border-black/10 bg-white p-6 sm:p-8">
        {fields.map(({ key, label, type }) => {
          const multiline = key === "site_description" || key === "author_bio" || key === "address"
          const value = typeof settings[key] === "string" ? String(settings[key]) : ""
          const common = { value, onChange: (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => setSettings((current) => ({ ...current, [key]: event.target.value })), className: "mt-2 w-full rounded-xl border border-black/15 bg-[#f8f7f4] px-4 py-3 outline-none focus:border-violet-500" }
          return <label key={key} className="block font-semibold">{label}{multiline ? <textarea {...common} className={`${common.className} min-h-24`} /> : <input {...common} type={type || "text"} />}</label>
        })}
        <div className="flex flex-wrap items-center gap-5 pt-2"><button disabled={loading} className="rounded-xl bg-violet-600 px-6 py-3 font-bold text-white disabled:opacity-50">{loading ? "Enregistrement…" : "Enregistrer"}</button><p aria-live="polite" className="text-sm text-[#596275]">{message}</p></div>
      </form>
    </div>
  )
}
