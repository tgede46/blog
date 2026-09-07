"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { api, type PublicSettings } from "@/lib/api"
import SecuritySettings from "@/components/SecuritySettings"
import { useAuth } from "@/lib/auth"
import { adminQueryKeys } from "@/lib/queryKeys"

const fields: Array<{ key: keyof PublicSettings; label: string; type?: string }> = [
  { key: "site_name", label: "Nom du site" },
  { key: "site_description", label: "Description du site" },
  { key: "author_name", label: "Nom de l’auteur" },
  { key: "author_bio", label: "Biographie" },
  { key: "hero_title", label: "Titre de la page d’accueil" },
  { key: "hero_description", label: "Introduction de la page d’accueil" },
  { key: "about_content", label: "Contenu À propos" },
  { key: "contact_email", label: "Email public", type: "email" },
  { key: "github_url", label: "URL GitHub", type: "url" },
  { key: "linkedin_url", label: "URL LinkedIn", type: "url" },
  { key: "x_url", label: "URL X / Twitter", type: "url" },
  { key: "legal_name", label: "Nom légal" },
  { key: "address", label: "Adresse légale" },
  { key: "legal_content", label: "Complément des mentions légales" },
]

export default function AdminSettingsPage() {
  const router = useRouter()
  const { user, isLoading: authLoading } = useAuth()
  const queryClient = useQueryClient()
  const [draft, setDraft] = useState<PublicSettings | null>(null)
  const [message, setMessage] = useState("")
  const settingsQuery = useQuery({
    queryKey: adminQueryKeys.settings,
    queryFn: api.admin.settings.get,
    enabled: !authLoading && user?.role === "admin",
  })
  const settings = draft ?? settingsQuery.data ?? {}
  const updateMutation = useMutation({
    mutationFn: api.admin.settings.update,
    onSuccess: (updated) => {
      setDraft(updated)
      queryClient.setQueryData(adminQueryKeys.settings, updated)
      setMessage("Réglages enregistrés.")
    },
  })

  useEffect(() => {
    if (authLoading) return
    if (user?.role !== "admin") {
      router.replace("/admin")
    }
  }, [authLoading, router, user?.role])

  async function save(event: React.FormEvent) {
    event.preventDefault()
    setMessage("")
    try {
      await updateMutation.mutateAsync(settings)
    } catch {
      // L’erreur est affichée depuis l’état de la mutation.
    }
  }

  if (authLoading || user?.role !== "admin") {
    return <p className="text-[#596275]">Vérification des autorisations…</p>
  }

  const queryError = settingsQuery.error || updateMutation.error
  const statusMessage = queryError instanceof Error ? queryError.message : queryError ? "Opération impossible." : message
  const loading = settingsQuery.isPending || updateMutation.isPending

  return (
    <div className="mx-auto max-w-3xl">
      <p className="text-sm font-semibold text-on-surface">Personnalisation</p>
      <h1 className="mt-1 font-heading text-4xl font-black">Réglages</h1>
      <form onSubmit={save} className="neo-card mt-8 space-y-5 p-6 sm:p-8">
        {fields.map(({ key, label, type }) => {
          const multiline = ["site_description", "author_bio", "hero_description", "about_content", "address", "legal_content"].includes(String(key))
          const value = typeof settings[key] === "string" ? String(settings[key]) : ""
          const common = { value, onChange: (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => setDraft((current) => ({ ...(current ?? settingsQuery.data ?? {}), [key]: event.target.value })), className: "neo-field mt-2 w-full bg-[#f8f7f4] px-4 py-3 outline-none focus:border-on-surface" }
          return <label key={key} className="block font-semibold">{label}{multiline ? <textarea {...common} className={`${common.className} min-h-24`} /> : <input {...common} type={type || "text"} />}</label>
        })}
        <div className="flex flex-wrap items-center gap-5 pt-2"><button disabled={loading} className="neo-button bg-primary px-6 py-3 font-bold text-white disabled:opacity-50">{updateMutation.isPending ? "Enregistrement…" : "Enregistrer"}</button><p aria-live="polite" className="text-sm text-[#596275]">{statusMessage}</p></div>
      </form>
      <SecuritySettings />
    </div>
  )
}
