"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useTranslations } from "next-intl"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { api, type PublicSettings } from "@/lib/api"
import SecuritySettings from "@/components/SecuritySettings"
import { useAuth } from "@/lib/auth"
import { adminQueryKeys } from "@/lib/queryKeys"

export default function AdminSettingsPage() {
  const t = useTranslations("Admin")
  const tCommon = useTranslations("Common")
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
      setMessage(t("saved"))
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
      // L'erreur est affichée depuis l'état de la mutation.
    }
  }

  if (authLoading || user?.role !== "admin") {
    return <p className="text-[#596275]">{t("permissionsLoading")}</p>
  }

  const queryError = settingsQuery.error || updateMutation.error
  const statusMessage = queryError instanceof Error ? queryError.message : queryError ? tCommon("operationImpossible") : message
  const loading = settingsQuery.isPending || updateMutation.isPending

  const fields: Array<{ key: keyof PublicSettings; label: string; type?: string }> = [
    { key: "site_name", label: t("settingsFields.site_name") },
    { key: "site_description", label: t("settingsFields.site_description") },
    { key: "author_name", label: t("settingsFields.author_name") },
    { key: "author_bio", label: t("settingsFields.author_bio") },
    { key: "hero_title", label: t("settingsFields.hero_title") },
    { key: "hero_description", label: t("settingsFields.hero_description") },
    { key: "about_content", label: t("settingsFields.about_content") },
    { key: "contact_email", label: t("settingsFields.contact_email"), type: "email" },
    { key: "github_url", label: t("settingsFields.github_url"), type: "url" },
    { key: "linkedin_url", label: t("settingsFields.linkedin_url"), type: "url" },
    { key: "x_url", label: t("settingsFields.x_url"), type: "url" },
    { key: "legal_name", label: t("settingsFields.legal_name") },
    { key: "address", label: t("settingsFields.address") },
    { key: "legal_content", label: t("settingsFields.legal_content") },
  ]

  return (
    <div className="mx-auto max-w-3xl">
      <p className="text-sm font-semibold text-violet-700">{t("personalization")}</p>
      <h1 className="mt-1 font-heading text-4xl font-black">{t("settings")}</h1>
      <form onSubmit={save} className="neo-card mt-8 space-y-5 p-6 sm:p-8">
        {fields.map(({ key, label, type }) => {
          const multiline = ["site_description", "author_bio", "hero_description", "about_content", "address", "legal_content"].includes(String(key))
          const value = typeof settings[key] === "string" ? String(settings[key]) : ""
          const common = { value, onChange: (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => setDraft((current) => ({ ...(current ?? settingsQuery.data ?? {}), [key]: event.target.value })), className: "neo-field mt-2 w-full bg-[#f8f7f4] px-4 py-3 outline-none focus:border-violet-500" }
          return <label key={key} className="block font-semibold">{label}{multiline ? <textarea {...common} className={`${common.className} min-h-24`} /> : <input {...common} type={type || "text"} />}</label>
        })}
        <div className="flex flex-wrap items-center gap-5 pt-2"><button disabled={loading} className="neo-button bg-primary px-6 py-3 font-bold text-white disabled:opacity-50">{updateMutation.isPending ? tCommon("saving") : tCommon("save")}</button><p aria-live="polite" className="text-sm text-[#596275]">{statusMessage}</p></div>
      </form>
      <SecuritySettings />
    </div>
  )
}
