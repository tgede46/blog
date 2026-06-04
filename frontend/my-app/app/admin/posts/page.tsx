"use client"

import React, { useState } from "react"
import { Search, Filter, Plus, Edit2, Trash2, ArrowRightLeft, Image as ImageIcon, FileText } from "lucide-react"
import { useRouter } from "next/navigation"

const INITIAL_POSTS = [
    {
        id: 1,
        title: "Understanding Modern UI...",
        category: "UI/UX Design",
        author: "Admin",
        status: "Published",
        date: "Oct 24, 2023",
        icon: <ArrowRightLeft size={18} strokeWidth={2.5} />,
        iconBg: "bg-[#bbf7d0]",
        iconTextClass: "text-green-700",
    },
    {
        id: 2,
        title: "Top 10 React Hooks in 2024",
        category: "Development",
        author: "Admin",
        status: "Draft",
        date: "Oct 22, 2023",
        icon: <span className="font-bold text-sm">JS</span>,
        iconBg: "bg-[#fbcfe8]",
        iconTextClass: "text-pink-700",
    },
    {
        id: 3,
        title: "Optimizing Node.js Backends",
        category: "Backend",
        author: "Gedeon",
        status: "Published",
        date: "Oct 19, 2023",
        icon: <ImageIcon size={18} strokeWidth={2.5} />,
        iconBg: "bg-[#bae6fd]",
        iconTextClass: "text-blue-700",
    },
    {
        id: 4,
        title: "The Psychology of Colors",
        category: "Design",
        author: "Admin",
        status: "Published",
        date: "Oct 15, 2023",
        icon: <FileText size={18} strokeWidth={2.5} />,
        iconBg: "bg-[#ddd6fe]",
        iconTextClass: "text-purple-700",
    },
]

export default function AdminPostsPage() {
    const [posts, setPosts] = useState(INITIAL_POSTS)
    const [deleteId, setDeleteId] = useState<number | null>(null)
    const [toastData, setToastData] = useState({ message: "", visible: false })
    const router = useRouter()

    const triggerDelete = (id: number) => {
        setDeleteId(id)
    }

    const confirmDelete = () => {
        if (deleteId !== null) {
            setPosts((prev) => prev.filter((post) => post.id !== deleteId))
            setDeleteId(null)
            showToast("Post Deleted Successfully!")
        }
    }

    const showToast = (message: string) => {
        setToastData({ message, visible: true })
        setTimeout(() => setToastData({ message: "", visible: false }), 3000)
    }

    const handleEdit = () => {
        router.push("/admin/new")
    }

    return (
        <div className="flex flex-col gap-8 relative">

            {/* Custom Modal Overlay */}
            {deleteId !== null && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
                    <div className="bg-white border-4 border-[#121212] flex flex-col shadow-[8px_8px_0px_0px_#121212] w-full max-w-sm animate-in zoom-in-95 duration-200">
                        <div className="bg-[#fbcfe8] border-b-4 border-[#121212] p-4 flex items-center gap-3">
                            <Trash2 size={24} strokeWidth={2.5} />
                            <h2 className="font-black text-xl uppercase tracking-wider">Confirm Delete</h2>
                        </div>
                        <div className="p-6">
                            <p className="font-bold text-gray-700 mb-8 text-lg leading-snug">Are you absolutely sure you want to delete this post? This action is permanent.</p>
                            <div className="flex gap-4">
                                <button onClick={() => setDeleteId(null)} className="flex-1 py-3 bg-[#f4f4f4] border-2 border-[#121212] font-bold uppercase shadow-[4px_4px_0px_0px_#121212] hover:translate-y-[2px] hover:translate-x-[2px] hover:shadow-[2px_2px_0px_0px_#121212] transition-all">
                                    Cancel
                                </button>
                                <button onClick={confirmDelete} className="flex-1 py-3 bg-[#ef4444] text-white border-2 border-[#121212] font-bold uppercase shadow-[4px_4px_0px_0px_#121212] hover:translate-y-[2px] hover:translate-x-[2px] hover:shadow-[2px_2px_0px_0px_#121212] transition-all">
                                    Delete
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Custom Toast Notification */}
            {toastData.visible && (
                <div className="fixed bottom-8 right-8 z-50 bg-[#bbf7d0] border-4 border-[#121212] shadow-[6px_6px_0px_0px_#121212] px-6 py-4 animate-in slide-in-from-bottom-10 fade-in duration-300">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-white border-2 border-[#121212] flex items-center justify-center font-black text-green-700">✓</div>
                        <p className="font-black uppercase tracking-wider text-[#121212] text-lg">{toastData.message}</p>
                    </div>
                </div>
            )}

            {/* Page Header */}
            <div className="flex items-end justify-between">
                <div>
                    <h1 className="text-4xl md:text-5xl font-black uppercase tracking-tighter mb-2">All Posts</h1>
                    <p className="text-gray-600 font-medium text-lg">Manage, edit, and publish your articles.</p>
                </div>
                <div className="flex gap-4">
                    <button
                        onClick={() => router.push("/admin/new")}
                        className="px-6 py-3 border-2 border-[#121212] bg-[#fce96a] font-bold uppercase text-sm flex items-center gap-2 shadow-[4px_4px_0px_0px_#121212] hover:translate-y-[2px] hover:translate-x-[2px] hover:shadow-[2px_2px_0px_0px_#121212] transition-all"
                    >
                        <Plus size={18} strokeWidth={2.5} />
                        Write New
                    </button>
                </div>
            </div>

            {/* Filters and Search */}
            <div className="flex items-center justify-between bg-white border-2 border-[#121212] shadow-[4px_4px_0px_0px_#121212] p-4">
                <div className="flex gap-4">
                    <button className="bg-[#121212] text-white px-4 py-2 font-bold text-sm uppercase tracking-wide border-2 border-[#121212]">
                        All ({posts.length})
                    </button>
                    <button className="bg-[#f4f4f4] text-[#121212] px-4 py-2 font-bold text-sm uppercase tracking-wide border-2 border-[#121212] hover:bg-gray-200 transition-colors">
                        Published ({posts.filter(p => p.status === 'Published').length})
                    </button>
                    <button className="bg-[#f4f4f4] text-[#121212] px-4 py-2 font-bold text-sm uppercase tracking-wide border-2 border-[#121212] hover:bg-gray-200 transition-colors">
                        Drafts ({posts.filter(p => p.status === 'Draft').length})
                    </button>
                </div>

                <div className="flex gap-4">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} strokeWidth={2.5} />
                        <input
                            type="text"
                            placeholder="Search posts..."
                            className="pl-10 pr-4 py-2 w-[250px] bg-white border-2 border-[#121212] text-sm font-medium outline-none focus:border-blue-600 transition-all font-sans"
                        />
                    </div>
                    <button className="p-2 border-2 border-[#121212] bg-[#f4f4f4] hover:bg-gray-200 transition-colors flex items-center justify-center">
                        <Filter size={20} strokeWidth={2.5} />
                    </button>
                </div>
            </div>

            {/* Table */}
            <div className="bg-white border-2 border-[#121212] shadow-[6px_6px_0px_0px_#121212] overflow-x-auto">
                <table className="w-full text-left border-collapse min-w-[800px]">
                    <thead>
                        <tr className="border-b-2 border-[#121212] bg-[#fdfdfc]">
                            <th className="py-4 px-6 text-xs font-black uppercase tracking-widest text-gray-500 w-[50%]">Post Title</th>
                            <th className="py-4 px-6 text-xs font-black uppercase tracking-widest text-gray-500">Author</th>
                            <th className="py-4 px-6 text-xs font-black uppercase tracking-widest text-gray-500">Status</th>
                            <th className="py-4 px-6 text-xs font-black uppercase tracking-widest text-gray-500">Date</th>
                            <th className="py-4 px-6 text-xs font-black uppercase tracking-widest text-gray-500 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="font-medium">
                        {posts.map((post, idx) => (
                            <tr key={post.id} className={`${idx !== posts.length - 1 ? 'border-b-2 border-dashed border-gray-300' : ''} hover:bg-gray-50 transition-colors`}>
                                <td className="py-5 px-6">
                                    <div className="flex items-center gap-4">
                                        <div className={`w-10 h-10 ${post.iconBg} ${post.iconTextClass} border-2 border-[#121212] flex items-center justify-center flex-shrink-0`}>
                                            {post.icon}
                                        </div>
                                        <div>
                                            <span className="font-bold text-base block hover:underline cursor-pointer">{post.title}</span>
                                            <span className="text-xs text-gray-500 font-bold uppercase">{post.category}</span>
                                        </div>
                                    </div>
                                </td>
                                <td className="py-5 px-6 font-semibold">{post.author}</td>
                                <td className="py-5 px-6">
                                    {post.status === "Published" ? (
                                        <span className="inline-block bg-[#dcfce7] text-green-800 border-2 border-green-800 text-[10px] uppercase font-bold py-1 px-2">Published</span>
                                    ) : (
                                        <span className="inline-block bg-gray-100 text-gray-600 border-2 border-gray-600 text-[10px] uppercase font-bold py-1 px-2">Draft</span>
                                    )}
                                </td>
                                <td className="py-5 px-6 text-gray-500 text-sm font-semibold">{post.date}</td>
                                <td className="py-5 px-6">
                                    <div className="flex gap-3 justify-end items-center">
                                        <button onClick={handleEdit} className="hover:text-blue-600 transition-colors tooltip" aria-label="Edit">
                                            <Edit2 size={18} strokeWidth={2.5} />
                                        </button>
                                        <button onClick={() => triggerDelete(post.id)} className="hover:text-red-600 transition-colors tooltip" aria-label="Delete">
                                            <Trash2 size={18} strokeWidth={2.5} />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}

                        {posts.length === 0 && (
                            <tr>
                                <td colSpan={5} className="py-10 text-center font-bold text-gray-500">
                                    No posts found.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>

                {/* Pagination Details or Footer */}
                <div className="border-t-2 border-[#121212] p-4 bg-[#f4f4f4] flex justify-between items-center text-sm font-bold">
                    <span>Showing {posts.length} of 24 posts</span>
                    <div className="flex gap-2">
                        <button className="px-3 py-1 border-2 border-[#121212] bg-white hover:bg-gray-100 transition-colors opacity-50 cursor-not-allowed">
                            Prev
                        </button>
                        <button className="px-3 py-1 border-2 border-[#121212] bg-white hover:bg-gray-100 shadow-[2px_2px_0px_0px_#121212] active:translate-y-[2px] active:translate-x-[2px] active:shadow-none transition-all">
                            Next
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}
