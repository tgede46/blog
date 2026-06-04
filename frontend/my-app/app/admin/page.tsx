import React from "react"
import { Eye, Users, FileText, ChevronRight, Edit2, Trash2, Clock, MessageSquare, UploadCloud, ArrowRightLeft, Image as ImageIcon } from "lucide-react"

export default function AdminDashboardPage() {
    return (
        <div className="flex flex-col gap-10">

            {/* Page Header */}
            <div className="flex items-end justify-between">
                <div>
                    <h1 className="text-5xl md:text-6xl font-black uppercase tracking-tighter mb-2">Dashboard</h1>
                    <p className="text-gray-600 font-medium text-lg">Welcome back, Admin. Here's what's happening today.</p>
                </div>
                <div className="flex gap-4">
                    <button className="px-6 py-3 border-2 border-[#121212] bg-white font-bold uppercase text-sm shadow-[4px_4px_0px_0px_#121212] hover:translate-y-[2px] hover:translate-x-[2px] hover:shadow-[2px_2px_0px_0px_#121212] transition-all">
                        Export Data
                    </button>
                    <button className="px-6 py-3 border-2 border-[#121212] bg-[#fce96a] font-bold uppercase text-sm shadow-[4px_4px_0px_0px_#121212] hover:translate-y-[2px] hover:translate-x-[2px] hover:shadow-[2px_2px_0px_0px_#121212] transition-all">
                        New Post
                    </button>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Card 1 */}
                <div className="bg-white border-2 border-[#121212] p-6 shadow-[6px_6px_0px_0px_#121212] relative before:absolute before:left-0 before:top-0 before:bottom-0 before:w-3 before:bg-[#7c3aed] before:border-r-2 before:border-[#121212]">
                    <div className="flex justify-between items-start mb-6">
                        <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center border-2 border-purple-500 text-purple-600">
                            <Eye size={20} strokeWidth={2.5} />
                        </div>
                        <div className="bg-[#a5f3fc] border-2 border-[#121212] px-3 py-1 font-bold text-xs">
                            +12.5%
                        </div>
                    </div>
                    <div>
                        <p className="font-bold text-gray-500 text-sm tracking-widest uppercase mb-1">Total Views</p>
                        <h3 className="text-5xl font-black tracking-tight">124.8k</h3>
                    </div>
                </div>

                {/* Card 2 */}
                <div className="bg-white border-2 border-[#121212] p-6 shadow-[6px_6px_0px_0px_#121212] relative before:absolute before:left-0 before:top-0 before:bottom-0 before:w-3 before:bg-[#fce96a] before:border-r-2 before:border-[#121212]">
                    <div className="flex justify-between items-start mb-6">
                        <div className="w-10 h-10 flex items-center justify-center text-yellow-600">
                            <Users size={24} strokeWidth={2.5} />
                        </div>
                        <div className="bg-[#fce96a] border-2 border-[#121212] px-3 py-1 font-bold text-xs">
                            New Milestone
                        </div>
                    </div>
                    <div>
                        <p className="font-bold text-gray-500 text-sm tracking-widest uppercase mb-1">Subscribers</p>
                        <h3 className="text-5xl font-black tracking-tight">8,291</h3>
                    </div>
                </div>

                {/* Card 3 */}
                <div className="bg-white border-2 border-[#121212] p-6 shadow-[6px_6px_0px_0px_#121212] relative before:absolute before:left-0 before:top-0 before:bottom-0 before:w-3 before:bg-[#14b8a6] before:border-r-2 before:border-[#121212]">
                    <div className="flex justify-between items-start mb-6">
                        <div className="w-10 h-10 flex items-center justify-center text-teal-600">
                            <FileText size={24} strokeWidth={2.5} />
                        </div>
                        <div className="bg-[#e0e7ff] border-2 border-[#121212] px-3 py-1 font-bold text-xs">
                            Needs Review
                        </div>
                    </div>
                    <div>
                        <p className="font-bold text-gray-500 text-sm tracking-widest uppercase mb-1">Drafts</p>
                        <h3 className="text-5xl font-black tracking-tight">14</h3>
                    </div>
                </div>
            </div>

            {/* Main Grid: Recent Posts & Activity */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                {/* Recent Posts Table */}
                <div className="lg:col-span-2 bg-white border-2 border-[#121212] shadow-[6px_6px_0px_0px_#121212]">
                    <div className="flex justify-between items-center p-6 border-b-2 border-[#121212]">
                        <h3 className="text-xl font-bold uppercase">Recent Posts</h3>
                        <a href="#" className="font-bold text-sm underline decoration-2 underline-offset-4 hover:text-[#7c3aed] transition-colors">
                            View All Posts
                        </a>
                    </div>

                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b-2 border-[#121212] bg-[#fdfdfc]">
                                <th className="py-4 px-6 text-xs font-black uppercase tracking-widest text-gray-500 w-[40%]">Post Title</th>
                                <th className="py-4 px-6 text-xs font-black uppercase tracking-widest text-gray-500">Status</th>
                                <th className="py-4 px-6 text-xs font-black uppercase tracking-widest text-gray-500">Date</th>
                                <th className="py-4 px-6 text-xs font-black uppercase tracking-widest text-gray-500 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="font-medium">
                            <tr className="border-b-2 border-dashed border-gray-300 hover:bg-gray-50 transition-colors">
                                <td className="py-5 px-6">
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 bg-[#bbf7d0] border-2 border-[#121212] flex items-center justify-center text-green-700 flex-shrink-0">
                                            <ArrowRightLeft size={18} strokeWidth={2.5} />
                                        </div>
                                        <span className="font-bold text-base truncate">Understanding Mode...</span>
                                    </div>
                                </td>
                                <td className="py-5 px-6">
                                    <span className="inline-block bg-[#dcfce7] text-green-800 border-2 border-green-800 text-[10px] uppercase font-bold py-1 px-2">Published</span>
                                </td>
                                <td className="py-5 px-6 text-gray-500 text-sm font-semibold">Oct 24, 2023</td>
                                <td className="py-5 px-6">
                                    <div className="flex gap-3 justify-end">
                                        <button className="hover:text-blue-600 transition-colors"><Edit2 size={18} strokeWidth={2.5} /></button>
                                        <button className="hover:text-red-600 transition-colors"><Trash2 size={18} strokeWidth={2.5} /></button>
                                    </div>
                                </td>
                            </tr>

                            <tr className="border-b-2 border-dashed border-gray-300 hover:bg-gray-50 transition-colors">
                                <td className="py-5 px-6">
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 bg-[#fbcfe8] border-2 border-[#121212] flex items-center justify-center text-pink-700 font-bold flex-shrink-0 text-sm">
                                            JS
                                        </div>
                                        <span className="font-bold text-base truncate">Top 10 React Hooks...</span>
                                    </div>
                                </td>
                                <td className="py-5 px-6">
                                    <span className="inline-block bg-gray-100 text-gray-600 border-2 border-gray-600 text-[10px] uppercase font-bold py-1 px-2">Draft</span>
                                </td>
                                <td className="py-5 px-6 text-gray-500 text-sm font-semibold">Oct 22, 2023</td>
                                <td className="py-5 px-6">
                                    <div className="flex gap-3 justify-end">
                                        <button className="hover:text-blue-600 transition-colors"><Edit2 size={18} strokeWidth={2.5} /></button>
                                        <button className="hover:text-red-600 transition-colors"><Trash2 size={18} strokeWidth={2.5} /></button>
                                    </div>
                                </td>
                            </tr>

                            <tr className="border-b-2 border-dashed border-gray-300 hover:bg-gray-50 transition-colors">
                                <td className="py-5 px-6">
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 bg-[#bae6fd] border-2 border-[#121212] flex items-center justify-center text-blue-700 flex-shrink-0">
                                            <ImageIcon size={18} strokeWidth={2.5} />
                                        </div>
                                        <span className="font-bold text-base truncate">Optimizing Node.js...</span>
                                    </div>
                                </td>
                                <td className="py-5 px-6">
                                    <span className="inline-block bg-[#dcfce7] text-green-800 border-2 border-green-800 text-[10px] uppercase font-bold py-1 px-2">Published</span>
                                </td>
                                <td className="py-5 px-6 text-gray-500 text-sm font-semibold">Oct 19, 2023</td>
                                <td className="py-5 px-6">
                                    <div className="flex gap-3 justify-end">
                                        <button className="hover:text-blue-600 transition-colors"><Edit2 size={18} strokeWidth={2.5} /></button>
                                        <button className="hover:text-red-600 transition-colors"><Trash2 size={18} strokeWidth={2.5} /></button>
                                    </div>
                                </td>
                            </tr>

                            <tr className="hover:bg-gray-50 transition-colors">
                                <td className="py-5 px-6">
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 bg-[#ddd6fe] border-2 border-[#121212] flex items-center justify-center text-purple-700 font-bold flex-shrink-0">
                                            <FileText size={18} strokeWidth={2.5} />
                                        </div>
                                        <span className="font-bold text-base truncate">The Psychology of...</span>
                                    </div>
                                </td>
                                <td className="py-5 px-6">
                                    <span className="inline-block bg-[#dcfce7] text-green-800 border-2 border-green-800 text-[10px] uppercase font-bold py-1 px-2">Published</span>
                                </td>
                                <td className="py-5 px-6 text-gray-500 text-sm font-semibold">Oct 15, 2023</td>
                                <td className="py-5 px-6">
                                    <div className="flex gap-3 justify-end">
                                        <button className="hover:text-blue-600 transition-colors"><Edit2 size={18} strokeWidth={2.5} /></button>
                                        <button className="hover:text-red-600 transition-colors"><Trash2 size={18} strokeWidth={2.5} /></button>
                                    </div>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                {/* Activity Feed */}
                <div className="bg-white border-2 border-[#121212] shadow-[6px_6px_0px_0px_#121212] flex flex-col">
                    <div className="p-6 pb-2">
                        <h3 className="text-xl font-bold uppercase flex items-center gap-3">
                            <Clock className="text-[#7c3aed]" size={24} strokeWidth={2.5} />
                            Activity
                        </h3>
                    </div>

                    <div className="p-6 pt-4 flex-1 relative">
                        {/* Vertical Line */}
                        <div className="absolute left-[47px] top-6 bottom-12 w-0.5 bg-gray-200"></div>

                        <div className="flex flex-col gap-8 relative z-10">
                            {/* Activity Item 1 */}
                            <div className="flex gap-4">
                                <div className="w-12 h-12 rounded-full border-2 border-[#121212] bg-[#fce96a] flex items-center justify-center flex-shrink-0 shadow-[2px_2px_0px_0px_#121212] bg-white ring-4 ring-white">
                                    <Users size={18} strokeWidth={2.5} />
                                </div>
                                <div className="pt-1">
                                    <p className="font-bold text-[15px] leading-tight">New subscription from <a href="#" className="text-blue-600 underline decoration-2 underline-offset-2">alex_dev.io</a></p>
                                    <p className="text-[10px] font-black uppercase text-gray-500 mt-1">2 minutes ago</p>
                                </div>
                            </div>

                            {/* Activity Item 2 */}
                            <div className="flex gap-4">
                                <div className="w-12 h-12 rounded-full border-2 border-[#121212] bg-[#e0e7ff] flex items-center justify-center flex-shrink-0 shadow-[2px_2px_0px_0px_#121212] bg-white ring-4 ring-white">
                                    <MessageSquare size={18} strokeWidth={2.5} />
                                </div>
                                <div className="pt-1">
                                    <p className="font-bold text-[15px] leading-tight">New comment on "CSS Container Queries"</p>
                                    <p className="text-[10px] font-black uppercase text-gray-500 mt-1">45 minutes ago</p>
                                </div>
                            </div>

                            {/* Activity Item 3 */}
                            <div className="flex gap-4">
                                <div className="w-12 h-12 rounded-full border-2 border-[#121212] bg-[#a5f3fc] flex items-center justify-center flex-shrink-0 shadow-[2px_2px_0px_0px_#121212] bg-white ring-4 ring-white">
                                    <UploadCloud size={18} strokeWidth={2.5} />
                                </div>
                                <div className="pt-1">
                                    <p className="font-bold text-[15px] leading-tight">Deployment Successful: v2.4.1</p>
                                    <p className="text-[10px] font-black uppercase text-gray-500 mt-1">2 hours ago</p>
                                </div>
                            </div>

                            {/* Activity Item 4 */}
                            <div className="flex gap-4">
                                <div className="w-12 h-12 rounded-full border-2 border-[#121212] bg-[#fbcfe8] flex items-center justify-center flex-shrink-0 shadow-[2px_2px_0px_0px_#121212] bg-white ring-4 ring-white">
                                    <Eye size={18} strokeWidth={2.5} />
                                </div>
                                <div className="pt-1">
                                    <p className="font-bold text-[15px] leading-tight">Your post hit 10,000 views!</p>
                                    <p className="text-[10px] font-black uppercase text-gray-500 mt-1">Yesterday</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="p-6 pt-0 mt-auto">
                        <button className="w-full bg-[#f4f4f4] border-2 border-[#121212] font-bold text-sm tracking-wide py-3 hover:bg-[#e5e5e5] transition-colors">
                            VIEW FULL HISTORY
                        </button>
                    </div>
                </div>

            </div>
        </div>
    )
}
