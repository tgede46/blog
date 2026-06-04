"use client"

import React, { useState } from "react"
import { Save, Eye, CheckCircle2, AlertCircle, X, Loader2 } from "lucide-react"
import { useRouter } from "next/navigation"

type ToastType = "success" | "error" | "info"
type ToastState = { visible: boolean; message: string; type: ToastType }

export default function AdminNewPostPage() {
    const router = useRouter()

    const [title, setTitle] = useState("")
    const [content, setContent] = useState("")
    const [category, setCategory] = useState("")
    const [status, setStatus] = useState("Published")
    const [isLoading, setIsLoading] = useState(false)
    const [toast, setToast] = useState<ToastState>({ visible: false, message: "", type: "success" })

    const showToast = (message: string, type: ToastType = "success") => {
        setToast({ visible: true, message, type })
        setTimeout(() => setToast({ visible: false, message: "", type: "success" }), 4000)
    }

    const handlePublish = async () => {
        if (!title.trim()) {
            showToast("Please add a title before publishing.", "error")
            return
        }
        if (!content.trim()) {
            showToast("Content cannot be empty.", "error")
            return
        }

        setIsLoading(true)

        // Simulate publish delay
        await new Promise((res) => setTimeout(res, 1500))

        setIsLoading(false)
        showToast(
            status === "Published"
                ? "🎉 Post Published Successfully!"
                : "✅ Draft saved successfully!",
            "success"
        )

        // After publish, redirect to posts list after short delay
        setTimeout(() => {
            router.push("/admin/posts")
        }, 2000)
    }

    const handlePreview = () => {
        if (!title.trim() && !content.trim()) {
            showToast("Write some content to preview it.", "info")
            return
        }
        showToast("Preview mode coming soon!", "info")
    }

    const toastStyles: Record<ToastType, string> = {
        success: "bg-[#bbf7d0] border-[#121212] text-[#121212]",
        error: "bg-[#fecaca] border-[#121212] text-[#121212]",
        info: "bg-[#bae6fd] border-[#121212] text-[#121212]",
    }

    const toastIcon: Record<ToastType, React.ReactNode> = {
        success: <CheckCircle2 size={22} strokeWidth={2.5} className="text-green-700 flex-shrink-0" />,
        error: <AlertCircle size={22} strokeWidth={2.5} className="text-red-700 flex-shrink-0" />,
        info: <AlertCircle size={22} strokeWidth={2.5} className="text-blue-700 flex-shrink-0" />,
    }

    return (
        <div className="flex flex-col gap-8 relative">

            {/* ── Toast Notification ── */}
            {toast.visible && (
                <div
                    className={`fixed bottom-8 right-8 z-50 border-4 shadow-[6px_6px_0px_0px_#121212] px-5 py-4 flex items-center gap-3 max-w-sm animate-in slide-in-from-bottom-10 fade-in duration-300 ${toastStyles[toast.type]}`}
                >
                    {toastIcon[toast.type]}
                    <p className="font-black text-sm uppercase tracking-wide leading-snug flex-1">{toast.message}</p>
                    <button onClick={() => setToast(t => ({ ...t, visible: false }))} className="ml-2 hover:opacity-60 transition-opacity">
                        <X size={18} strokeWidth={2.5} />
                    </button>
                </div>
            )}

            {/* ── Page Header ── */}
            <div className="flex items-end justify-between">
                <div>
                    <h1 className="text-4xl md:text-5xl font-black uppercase tracking-tighter mb-2">New Post</h1>
                    <p className="text-gray-600 font-medium text-lg">Create a new piece of content.</p>
                </div>
                <div className="flex gap-4">
                    <button
                        onClick={handlePreview}
                        className="px-6 py-3 border-2 border-[#121212] bg-white font-bold uppercase text-sm flex items-center gap-2 shadow-[4px_4px_0px_0px_#121212] hover:translate-y-[2px] hover:translate-x-[2px] hover:shadow-[2px_2px_0px_0px_#121212] transition-all"
                    >
                        <Eye size={18} strokeWidth={2.5} />
                        Preview
                    </button>
                    <button
                        onClick={handlePublish}
                        disabled={isLoading}
                        className="px-6 py-3 border-2 border-[#121212] bg-[#7c3aed] text-white font-bold uppercase text-sm flex items-center gap-2 shadow-[4px_4px_0px_0px_#121212] hover:translate-y-[2px] hover:translate-x-[2px] hover:shadow-[2px_2px_0px_0px_#121212] transition-all disabled:opacity-60 disabled:cursor-not-allowed disabled:translate-x-0 disabled:translate-y-0 disabled:shadow-[4px_4px_0px_0px_#121212]"
                    >
                        {isLoading ? (
                            <Loader2 size={18} strokeWidth={2.5} className="animate-spin" />
                        ) : (
                            <Save size={18} strokeWidth={2.5} />
                        )}
                        {isLoading ? "Publishing..." : status === "Published" ? "Publish" : "Save Draft"}
                    </button>
                </div>
            </div>

            {/* ── Editor + Settings ── */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                {/* Left: Editor */}
                <div className="lg:col-span-2 flex flex-col gap-6">
                    <div className="w-full bg-white border-2 border-[#121212] shadow-[6px_6px_0px_0px_#121212] flex flex-col p-6 gap-6">
                        <input
                            type="text"
                            placeholder="Post Title..."
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className="w-full text-4xl font-black tracking-tighter border-none outline-none placeholder:text-gray-300 bg-transparent font-sans"
                        />
                        <div className="h-0.5 w-full bg-[#121212]"></div>
                        <textarea
                            placeholder="Write your amazing content here..."
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            className="w-full min-h-[400px] border-none outline-none resize-none placeholder:text-gray-400 bg-transparent font-medium text-lg leading-relaxed font-sans"
                        ></textarea>
                    </div>
                </div>

                {/* Right: Settings */}
                <div className="flex flex-col gap-6">
                    <div className="bg-white border-2 border-[#121212] shadow-[4px_4px_0px_0px_#121212] p-6">
                        <h3 className="font-black uppercase tracking-wider mb-4 border-b-2 border-black pb-2">Publish Settings</h3>
                        <div className="flex flex-col gap-5 mt-4">
                            <label className="flex flex-col gap-2 font-bold text-sm uppercase">
                                Status
                                <select
                                    value={status}
                                    onChange={(e) => setStatus(e.target.value)}
                                    className="border-2 border-[#121212] bg-[#f4f4f4] p-3 outline-none font-bold"
                                >
                                    <option value="Published">Published</option>
                                    <option value="Draft">Draft</option>
                                    <option value="Archive">Archive</option>
                                </select>
                            </label>
                            <label className="flex flex-col gap-2 font-bold text-sm uppercase">
                                Category
                                <input
                                    type="text"
                                    placeholder="e.g. Design, Dev..."
                                    value={category}
                                    onChange={(e) => setCategory(e.target.value)}
                                    className="border-2 border-[#121212] bg-[#f4f4f4] p-3 outline-none font-bold placeholder:text-gray-400 placeholder:font-normal"
                                />
                            </label>
                        </div>
                    </div>

                    {/* Word Count */}
                    <div className="bg-[#fce96a] border-2 border-[#121212] shadow-[4px_4px_0px_0px_#121212] p-4 flex justify-between items-center font-bold">
                        <span className="uppercase text-sm">Words</span>
                        <span className="font-black text-xl">
                            {content.trim() === "" ? 0 : content.trim().split(/\s+/).length}
                        </span>
                    </div>
                </div>

            </div>
        </div>
    )
}
