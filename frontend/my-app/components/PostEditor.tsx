"use client"
/* eslint-disable @next/next/no-img-element */

import { useRef, useState } from "react"
import { useRouter } from "next/navigation"
import { Code2, Eye, Heading2, Image as ImageIcon, Quote, Save, X } from "lucide-react"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { api, type AdminPost, type MediaItem, type PostInput } from "@/lib/api"
import { blocksToText, textToBlocks } from "@/lib/content"
import { adminQueryKeys } from "@/lib/queryKeys"
import Callout from "@/components/Callout"

export default function PostEditor({ post }: { post?: AdminPost }) {
  const router = useRouter()
  const queryClient = useQueryClient()
  const contentRef = useRef<HTMLTextAreaElement>(null)
  const [title, setTitle] = useState(post?.title || "")
  const [slug, setSlug] = useState(post?.slug || "")
  const [excerpt, setExcerpt] = useState(post?.excerpt || "")
  const [content, setContent] = useState(blocksToText(post?.content))
  const [category, setCategory] = useState(post?.category || "")
  const [tag, setTag] = useState(post?.tag || "")
  const [status, setStatus] = useState<"published" | "draft">(post?.status || "draft")
  const [minutes, setMinutes] = useState(typeof post?.minutes === "number" ? post.minutes : Number.parseInt(String(post?.minutes || "5"), 10) || 5)
  const [preview, setPreview] = useState(false)
  const [message, setMessage] = useState("")
  const [showImagePicker, setShowImagePicker] = useState(false)
  const [media, setMedia] = useState<MediaItem[]>([])
  const [mediaLoading, setMediaLoading] = useState(false)
  const [imageUrl, setImageUrl] = useState("")
  const [imageAlt, setImageAlt] = useState("")
  const saveMutation = useMutation({
    mutationFn: (payload: PostInput) =>
      post ? api.admin.posts.update(post.id, payload) : api.admin.posts.create(payload),
    onSuccess: async (savedPost) => {
      queryClient.setQueryData(adminQueryKeys.post(savedPost.id), savedPost)
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: adminQueryKeys.posts }),
        queryClient.invalidateQueries({ queryKey: adminQueryKeys.stats }),
      ])
      router.push("/admin/posts")
      router.refresh()
    },
  })

  function insertSnippet(snippet: string) {
    const area = contentRef.current
    const block = content.trim() ? `\n\n${snippet}\n\n` : `${snippet}\n\n`
    if (!area) {
      setContent((value) => `${value}${block}`)
      return
    }
    const start = area.selectionStart
    const end = area.selectionEnd
    const next = `${content.slice(0, start)}${block}${content.slice(end)}`
    setContent(next)
    requestAnimationFrame(() => {
      area.focus()
      const cursor = start + block.length
      area.setSelectionRange(cursor, cursor)
    })
  }

  async function openImagePicker() {
    setShowImagePicker(true)
    if (media.length) return
    setMediaLoading(true)
    try {
      setMedia(
        await queryClient.fetchQuery({
          queryKey: adminQueryKeys.media,
          queryFn: api.admin.media.list,
        }),
      )
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Chargement de la médiathèque impossible.")
    } finally {
      setMediaLoading(false)
    }
  }

  function insertImage(url: string, alt = "") {
    const safeAlt = alt.replaceAll("[", "").replaceAll("]", "")
    insertSnippet(`![${safeAlt}](${url})`)
    setImageUrl("")
    setImageAlt("")
    setShowImagePicker(false)
  }

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
    setMessage("")
    try {
      await saveMutation.mutateAsync(payload)
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Enregistrement impossible.")
    }
  }

  const field = "neo-field mt-2 w-full bg-[#f8f7f4] px-4 py-3 outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-100"
  const contentPlaceholder = `Paragraphes séparés par une ligne vide.

## Intertitre

> Citation mise en avant

>! Astuce ou note utile

\`\`\`ts
const message = "Bonjour"
console.log(message)
\`\`\`

![Description](https://exemple.com/image.jpg)`

  return (
    <div className="mx-auto max-w-6xl">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-violet-700">{post ? "Édition" : "Nouvelle publication"}</p>
          <h1 className="mt-1 font-heading text-4xl font-black">{post ? post.title : "Nouvel article"}</h1>
        </div>
        <div className="flex gap-3">
          <button onClick={() => setPreview((value) => !value)} className="neo-button flex items-center gap-2 bg-white px-4 py-3 font-bold">
            <Eye size={18} />Aperçu
          </button>
          <button onClick={() => void save()} disabled={saveMutation.isPending} className="neo-button flex items-center gap-2 bg-primary px-5 py-3 font-bold text-white disabled:opacity-50">
            <Save size={18} />{saveMutation.isPending ? "Enregistrement…" : "Enregistrer"}
          </button>
        </div>
      </div>
      {message && <p className="mt-5 rounded-xl bg-red-50 p-4 text-red-700" role="alert">{message}</p>}
      {preview ? (
        <article className="neo-card mt-8 p-6 sm:p-10">
          <p className="text-sm font-bold uppercase tracking-wider text-violet-700">{category || "Général"} · {tag || "Développement"}</p>
          <h2 className="mt-4 font-heading text-4xl font-black">{title || "Titre de l’article"}</h2>
          <p className="mt-4 text-lg text-[#596275]">{excerpt || "Le résumé apparaîtra ici."}</p>
          <div className="mt-8 space-y-5 leading-8">
            {textToBlocks(content).map((block, index) =>
              block.type === "heading" ? (
                <h3 key={index} className="pt-4 font-heading text-2xl font-bold">{block.text}</h3>
              ) : block.type === "code" ? (
                <pre key={index} className="overflow-x-auto rounded-xl bg-[#1d2433] p-5 text-sm text-white">
                  <code>{block.code}</code>
                </pre>
              ) : block.type === "callout" ? (
                <Callout key={index} variant={block.variant === "tip" ? "tip" : "quote"}>{block.text}</Callout>
              ) : block.type === "image" ? (
                <figure key={index}>
                  <img src={block.url || block.text || ""} alt={block.alt || ""} className="max-h-[560px] w-full rounded-xl border-2 border-on-surface object-cover" />
                  {block.caption && <figcaption className="mt-2 text-center text-sm text-[#737b8d]">{block.caption}</figcaption>}
                </figure>
              ) : (
                <p key={index}>{block.text}</p>
              ),
            )}
          </div>
        </article>
      ) : (
        <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_320px]">
          <section className="neo-card space-y-5 p-6">
            <label className="block font-semibold">Titre<input value={title} onChange={(event) => setTitle(event.target.value)} className={field} required /></label>
            <label className="block font-semibold">Slug <span className="font-normal text-[#89909e]">(optionnel)</span><input value={slug} onChange={(event) => setSlug(event.target.value)} className={field} placeholder="mon-article" /></label>
            <label className="block font-semibold">Résumé<textarea value={excerpt} onChange={(event) => setExcerpt(event.target.value)} className={`${field} min-h-24`} required /></label>
            <div>
              <div className="mb-2 flex flex-wrap items-center justify-between gap-3">
                <label className="font-semibold" htmlFor="article-content">Contenu</label>
                <div className="flex flex-wrap gap-2">
                  <button type="button" onClick={() => insertSnippet("## Intertitre")} className="neo-button flex items-center gap-1 bg-white px-3 py-1.5 text-xs font-bold">
                    <Heading2 size={14} />Titre
                  </button>
                  <button type="button" onClick={() => insertSnippet("> Citation mise en avant")} className="neo-button flex items-center gap-1 bg-white px-3 py-1.5 text-xs font-bold">
                    <Quote size={14} />Citation
                  </button>
                  <button type="button" onClick={() => insertSnippet(">! Astuce ou note utile")} className="neo-button flex items-center gap-1 bg-ts-blue px-3 py-1.5 text-xs font-bold">
                    Tip
                  </button>
                  <button type="button" onClick={() => void openImagePicker()} className="neo-button flex items-center gap-1 bg-white px-3 py-1.5 text-xs font-bold">
                    <ImageIcon size={14} />Image
                  </button>
                  <button
                    type="button"
                    onClick={() => insertSnippet("```ts\nconst message = \"Bonjour\"\nconsole.log(message)\n```")}
                    className="neo-button flex items-center gap-1 bg-tertiary-fixed px-3 py-1.5 text-xs font-bold"
                  >
                    <Code2 size={14} />Code
                  </button>
                </div>
              </div>
              {showImagePicker && (
                <div className="mb-4 space-y-4 border-2 border-on-surface bg-white p-4 shadow-[3px_3px_0_0_#1d2433]">
                  <div className="flex items-center justify-between gap-3">
                    <p className="font-bold">Insérer une image</p>
                    <button type="button" onClick={() => setShowImagePicker(false)} className="p-1" aria-label="Fermer le sélecteur d’image">
                      <X size={18} />
                    </button>
                  </div>
                  <div className="grid gap-3 sm:grid-cols-[1fr_1fr_auto]">
                    <input value={imageUrl} onChange={(event) => setImageUrl(event.target.value)} className={`${field} mt-0`} type="url" placeholder="https://…/image.jpg" aria-label="URL de l’image" />
                    <input value={imageAlt} onChange={(event) => setImageAlt(event.target.value)} className={`${field} mt-0`} placeholder="Description de l’image" aria-label="Texte alternatif de l’image" />
                    <button type="button" disabled={!imageUrl.trim()} onClick={() => insertImage(imageUrl.trim(), imageAlt.trim())} className="neo-button bg-tertiary-fixed px-4 py-2 font-bold disabled:opacity-50">
                      Insérer
                    </button>
                  </div>
                  <div>
                    <p className="mb-2 text-sm font-semibold">Ou choisir dans la médiathèque</p>
                    {mediaLoading ? (
                      <p className="text-sm text-[#737b8d]">Chargement…</p>
                    ) : media.length ? (
                      <div className="grid max-h-52 grid-cols-3 gap-3 overflow-y-auto sm:grid-cols-5">
                        {media.map((item) => (
                          <button key={item.id} type="button" onClick={() => insertImage(item.url, item.alt || item.filename)} className="overflow-hidden border-2 border-transparent hover:border-violet-600" aria-label={`Insérer ${item.filename}`}>
                            <img src={item.url} alt="" className="aspect-square w-full object-cover" />
                          </button>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm text-[#737b8d]">Aucune image importée. Tu peux utiliser une URL ci-dessus.</p>
                    )}
                  </div>
                </div>
              )}
              <textarea
                id="article-content"
                ref={contentRef}
                value={content}
                onChange={(event) => setContent(event.target.value)}
                className={`${field} mt-0 min-h-[420px] font-mono text-sm leading-7`}
                placeholder={contentPlaceholder}
                required
              />
            </div>
          </section>
          <aside className="neo-card h-fit space-y-5 bg-ts-blue p-6">
            <label className="block font-semibold">État<select value={status} onChange={(event) => setStatus(event.target.value as "published" | "draft")} className={field}><option value="draft">Brouillon</option><option value="published">Publié</option></select></label>
            <label className="block font-semibold">Catégorie<input value={category} onChange={(event) => setCategory(event.target.value)} className={field} /></label>
            <label className="block font-semibold">Tag<input value={tag} onChange={(event) => setTag(event.target.value)} className={field} /></label>
            <label className="block font-semibold">Minutes de lecture<input value={minutes} onChange={(event) => setMinutes(Math.max(1, Number(event.target.value)))} type="number" min="1" className={field} /></label>
            <div className="space-y-3 text-sm leading-6 text-[#374151]">
              <p>{content.trim() ? content.trim().split(/\s+/).length : 0} mots.</p>
              <p><code className="rounded bg-white px-1">## titre</code> → intertitre</p>
              <p><code className="rounded bg-white px-1">&gt; texte</code> → citation</p>
              <p><code className="rounded bg-white px-1">&gt;! texte</code> → tip bleu</p>
              <p><code className="rounded bg-white px-1">![description](url)</code> → image</p>
              <p>
                Code :
              </p>
              <pre className="overflow-x-auto border-2 border-on-surface bg-white p-3 text-xs leading-6">{`\`\`\`ts
function hello() {
  return "ok"
}
\`\`\``}</pre>
              <p>Tu peux aussi écrire <code className="rounded bg-white px-1">```python</code> ou <code className="rounded bg-white px-1">```main.java</code>.</p>
            </div>
          </aside>
        </div>
      )}
    </div>
  )
}
