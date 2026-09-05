"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Eye, Save } from "lucide-react"
import { api, type AdminPost, type PostInput } from "@/lib/api"
import { blocksToText, textToBlocks } from "@/lib/content"

export default function PostEditor({ post }: { post?: AdminPost }) {
  const router = useRouter()
  const [title, setTitle] = useState(post?.title || "")
  const [slug, setSlug] = useState(post?.slug || "")
  const [excerpt, setExcerpt] = useState(post?.excerpt || "")
  const [content, setContent] = useState(blocksToText(post?.content))
  const [category, setCategory] = useState(post?.category || "")
  const [tag, setTag] = useState(post?.tag || "")
  const [status, setStatus] = useState<"published" | "draft">(post?.status || "draft")
  const [minutes, setMinutes] = useState(typeof post?.minutes === "number" ? post.minutes : Number.parseInt(String(post?.minutes || "5"), 10) || 5)
  const [preview, setPreview] = useState(false)
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState("")

  async function save() {
    if (!title.trim() || !excerpt.trim() || !content.trim()) {
      setMessage("Le titre, le résumé et le contenu sont obligatoires.")
      return
    }
    const payload: PostInput = {
      title: title.trim(),
      slug: slug.trim() || undefined,
      excerpt: excerpt.trim(),
      content: textToBlocks(content),
      category: category.trim() || "Général",
      tag: tag.trim() || "Développement",
      status,
      read_minutes: minutes,
    }
    setLoading(true)
    setMessage("")
    try {
      if (post) await api.admin.posts.update(post.id, payload)
      else await api.admin.posts.create(payload)
      router.push("/admin/posts")
      router.refresh()
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Enregistrement impossible.")
    } finally {
      setLoading(false)
    }
  }

  const field = "mt-2 w-full rounded-xl border border-black/15 bg-[#f8f7f4] px-4 py-3 outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-100"

  return (
    <div className="mx-auto max-w-6xl">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div><p className="text-sm font-semibold text-violet-700">{post ? "Édition" : "Nouvelle publication"}</p><h1 className="mt-1 font-heading text-4xl font-black">{post ? post.title : "Nouvel article"}</h1></div>
        <div className="flex gap-3"><button onClick={() => setPreview((value) => !value)} className="flex items-center gap-2 rounded-xl border border-black/15 bg-white px-4 py-3 font-bold"><Eye size={18} />Aperçu</button><button onClick={() => void save()} disabled={loading} className="flex items-center gap-2 rounded-xl bg-violet-600 px-5 py-3 font-bold text-white disabled:opacity-50"><Save size={18} />{loading ? "Enregistrement…" : "Enregistrer"}</button></div>
      </div>
      {message && <p className="mt-5 rounded-xl bg-red-50 p-4 text-red-700" role="alert">{message}</p>}
      {preview ? (
        <article className="mt-8 rounded-2xl border border-black/10 bg-white p-6 sm:p-10">
          <p className="text-sm font-bold uppercase tracking-wider text-violet-700">{category || "Général"} · {tag || "Développement"}</p>
          <h2 className="mt-4 font-heading text-4xl font-black">{title || "Titre de l’article"}</h2>
          <p className="mt-4 text-lg text-[#596275]">{excerpt || "Le résumé apparaîtra ici."}</p>
          <div className="mt-8 space-y-5 leading-8">{textToBlocks(content).map((block, index) => block.type === "heading" ? <h3 key={index} className="pt-4 font-heading text-2xl font-bold">{block.text}</h3> : block.type === "code" ? <pre key={index} className="overflow-x-auto rounded-xl bg-[#1d2433] p-5 text-sm text-white"><code>{block.code}</code></pre> : block.type === "callout" ? <blockquote key={index} className="rounded-xl bg-violet-50 p-5">{block.text}</blockquote> : <p key={index}>{block.text}</p>)}</div>
        </article>
      ) : (
        <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_320px]">
          <section className="space-y-5 rounded-2xl border border-black/10 bg-white p-6">
            <label className="block font-semibold">Titre<input value={title} onChange={(event) => setTitle(event.target.value)} className={field} required /></label>
            <label className="block font-semibold">Slug <span className="font-normal text-[#89909e]">(optionnel)</span><input value={slug} onChange={(event) => setSlug(event.target.value)} className={field} placeholder="mon-article" /></label>
            <label className="block font-semibold">Résumé<textarea value={excerpt} onChange={(event) => setExcerpt(event.target.value)} className={`${field} min-h-24`} required /></label>
            <label className="block font-semibold">Contenu<textarea value={content} onChange={(event) => setContent(event.target.value)} className={`${field} min-h-[420px] font-mono text-sm leading-7`} placeholder={"Paragraphes séparés par une ligne vide.\n\n## Intertitre\n\n> Encadré"} required /></label>
          </section>
          <aside className="h-fit space-y-5 rounded-2xl border border-black/10 bg-white p-6">
            <label className="block font-semibold">État<select value={status} onChange={(event) => setStatus(event.target.value as "published" | "draft")} className={field}><option value="draft">Brouillon</option><option value="published">Publié</option></select></label>
            <label className="block font-semibold">Catégorie<input value={category} onChange={(event) => setCategory(event.target.value)} className={field} /></label>
            <label className="block font-semibold">Tag<input value={tag} onChange={(event) => setTag(event.target.value)} className={field} /></label>
            <label className="block font-semibold">Minutes de lecture<input value={minutes} onChange={(event) => setMinutes(Math.max(1, Number(event.target.value)))} type="number" min="1" className={field} /></label>
            <p className="text-sm leading-6 text-[#737b8d]">{content.trim() ? content.trim().split(/\s+/).length : 0} mots. Utilisez <code>##</code> pour un intertitre, <code>&gt;</code> pour un encadré et trois accents graves pour du code.</p>
          </aside>
        </div>
      )}
    </div>
  )
}
