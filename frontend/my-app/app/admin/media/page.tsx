"use client"
/* eslint-disable @next/next/no-img-element */

import { useCallback, useEffect, useRef, useState } from "react"
import { Trash2, Upload } from "lucide-react"
import { api, type MediaItem } from "@/lib/api"

export default function AdminMediaPage() {
  const [media, setMedia] = useState<MediaItem[]>([])
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(true)
  const inputRef = useRef<HTMLInputElement>(null)

  const load = useCallback(async () => {
    try {
      setMedia(await api.admin.media.list())
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "Chargement impossible.")
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    api.admin.media.list()
      .then(setMedia)
      .catch((reason) => setError(reason instanceof Error ? reason.message : "Chargement impossible."))
      .finally(() => setLoading(false))
  }, [])

  async function upload(file?: File) {
    if (!file) return
    setError("")
    try {
      await api.admin.media.upload(file)
      await load()
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "Envoi impossible.")
    } finally {
      if (inputRef.current) inputRef.current.value = ""
    }
  }

  async function remove(item: MediaItem) {
    if (!window.confirm(`Supprimer ${item.filename} ?`)) return
    try {
      await api.admin.media.delete(item.id)
      setMedia((items) => items.filter(({ id }) => id !== item.id))
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "Suppression impossible.")
    }
  }

  return (
    <div className="mx-auto max-w-6xl">
      <div className="flex flex-wrap items-end justify-between gap-5">
        <div><p className="text-sm font-semibold text-violet-700">{media.length} fichier{media.length > 1 ? "s" : ""}</p><h1 className="mt-1 font-heading text-4xl font-black">Médiathèque</h1></div>
        <><input ref={inputRef} className="sr-only" type="file" accept="image/*" onChange={(event) => void upload(event.target.files?.[0])} /><button onClick={() => inputRef.current?.click()} className="neo-button flex items-center gap-2 bg-tertiary-fixed px-5 py-3 font-black uppercase tracking-wide"><Upload size={18} />Importer</button></>
      </div>
      {error && <div className="mt-6 rounded-xl bg-red-50 p-4 text-red-700" role="alert">{error}</div>}
      {loading ? <p className="mt-10 text-[#737b8d]">Chargement…</p> : media.length ? (
        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {media.map((item) => <article key={item.id} className="neo-card overflow-hidden"><div className="aspect-video border-b-2 border-on-surface bg-[#eee]"><img src={item.url} alt={item.alt || item.filename} className="h-full w-full object-cover" /></div><div className="flex items-center justify-between gap-3 p-4"><button title="Copier l’URL" onClick={() => void navigator.clipboard.writeText(item.url)} className="min-w-0 truncate text-left text-sm font-semibold hover:text-violet-700">{item.filename}</button><button onClick={() => void remove(item)} className="shrink-0 border border-transparent p-2 text-red-700 hover:border-red-700 hover:bg-red-50" aria-label={`Supprimer ${item.filename}`}><Trash2 size={18} /></button></div></article>)}
        </div>
      ) : <div className="neo-card mt-8 border-dashed p-12 text-center"><h2 className="font-heading text-2xl font-bold">Aucun média</h2><p className="mt-2 text-[#737b8d]">Importez une première image pour commencer.</p></div>}
    </div>
  )
}
