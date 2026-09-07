"use client"
/* eslint-disable @next/next/no-img-element */

import { useRef } from "react"
import { Trash2, Upload } from "lucide-react"
import { useTranslations } from "next-intl"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { api, type MediaItem } from "@/lib/api"
import { adminQueryKeys } from "@/lib/queryKeys"

export default function AdminMediaPage() {
  const t = useTranslations("Admin")
  const tCommon = useTranslations("Common")
  const inputRef = useRef<HTMLInputElement>(null)
  const queryClient = useQueryClient()
  const mediaQuery = useQuery({
    queryKey: adminQueryKeys.media,
    queryFn: api.admin.media.list,
  })
  const uploadMutation = useMutation({
    mutationFn: api.admin.media.upload,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: adminQueryKeys.media }),
  })
  const deleteMutation = useMutation({
    mutationFn: api.admin.media.delete,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: adminQueryKeys.media }),
  })
  const media = mediaQuery.data || []
  const queryError = mediaQuery.error || uploadMutation.error || deleteMutation.error
  const error = queryError instanceof Error ? queryError.message : queryError ? tCommon("operationImpossible") : ""

  async function upload(file?: File) {
    if (!file) return
    try {
      await uploadMutation.mutateAsync(file)
    } catch {
      // L'erreur est affichée depuis l'état de la mutation.
    } finally {
      if (inputRef.current) inputRef.current.value = ""
    }
  }

  async function remove(item: MediaItem) {
    if (!window.confirm(t("confirmDeleteMedia", { filename: item.filename }))) return
    try {
      await deleteMutation.mutateAsync(item.id)
    } catch {
      // L'erreur est affichée depuis l'état de la mutation.
    }
  }

  return (
    <div className="mx-auto max-w-6xl">
      <div className="flex flex-wrap items-end justify-between gap-5">
        <div><p className="text-sm font-semibold text-on-surface">{media.length} fichier{media.length > 1 ? "s" : ""}</p><h1 className="mt-1 font-heading text-4xl font-black">{t("media")}</h1></div>
        <><input ref={inputRef} className="sr-only" type="file" accept="image/*" onChange={(event) => void upload(event.target.files?.[0])} /><button onClick={() => inputRef.current?.click()} className="neo-button flex items-center gap-2 bg-tertiary-fixed px-5 py-3 font-black uppercase tracking-wide"><Upload size={18} />{tCommon("import")}</button></>
      </div>
      {error && <div className="mt-6 rounded-xl bg-red-50 p-4 text-red-700" role="alert">{error}</div>}
      {mediaQuery.isPending ? <p className="mt-10 text-[#737b8d]">{tCommon("loading")}</p> : media.length ? (
        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {media.map((item) => <article key={item.id} className="neo-card overflow-hidden"><div className="aspect-video border-b-2 border-on-surface bg-[#eee]"><img src={item.url} alt={item.alt || item.filename} className="h-full w-full object-cover" /></div><div className="flex items-center justify-between gap-3 p-4"><button title={t("copyUrl")} onClick={() => void navigator.clipboard.writeText(item.url)} className="min-w-0 truncate text-left text-sm font-semibold hover:bg-tertiary-fixed">{item.filename}</button><button onClick={() => void remove(item)} className="shrink-0 border border-transparent p-2 text-red-700 hover:border-red-700 hover:bg-red-50" aria-label={`${tCommon("delete")} ${item.filename}`}><Trash2 size={18} /></button></div></article>)}
        </div>
      ) : <div className="neo-card mt-8 border-dashed p-12 text-center"><h2 className="font-heading text-2xl font-bold">{t("noMedia")}</h2><p className="mt-2 text-[#737b8d]">{t("noMediaDesc")}</p></div>}
    </div>
  )
}
