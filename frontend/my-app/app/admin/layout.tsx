"use client"

import React, { useState } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { Search, Bell, Settings, LayoutDashboard, FileText, PenSquare, Image as ImageIcon, BookOpen, LifeBuoy, LogOut, User } from "lucide-react"
import { useAuth } from "@/lib/auth"

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname()
    const router = useRouter()
    const { user, logout } = useAuth()
    const [isNotificationsOpen, setIsNotificationsOpen] = useState(false)
    const [isProfileOpen, setIsProfileOpen] = useState(false)

    const handleLogout = () => {
        setIsProfileOpen(false)
        logout()
        router.push("/")
    }

    const isActive = (path: string) => {
        return pathname === path
    }

    const navItemClass = (path: string) => {
        const base = "flex items-center gap-3 px-4 py-3 font-semibold transition-all rounded-md"
        if (isActive(path)) {
            return `${base} bg-[#fce96a] border-2 border-[#121212] shadow-[4px_4px_0px_0px_#121212] font-bold`
        }
        return `${base} hover:bg-gray-100 border-2 border-transparent hover:border-[#121212]`
    }

    return (
        <div className="flex h-screen w-full bg-[#fdfdfc] text-[#121212] font-sans overflow-hidden">
            {/* Sidebar */}
            <aside className="w-[260px] flex-shrink-0 border-r-2 border-[#121212] bg-[#fdfdfc] flex flex-col h-full relative z-20">
                <div className="p-6 pb-2">
                    <div className="border-2 border-[#121212] bg-[#f4f4f4] p-4 flex flex-col items-center justify-center text-center shadow-[4px_4px_0px_0px_#121212]">
                        <h2 className="font-black text-lg leading-tight uppercase">Editor Console</h2>
                        <p className="text-[10px] font-bold text-gray-500 tracking-widest mt-1">NEO-BRUTALIST V1.0</p>
                    </div>
                </div>

                <nav className="flex-1 px-4 py-6 flex flex-col gap-3">
                    <Link href="/admin" className={navItemClass("/admin")}>
                        <LayoutDashboard size={20} strokeWidth={isActive("/admin") ? 2.5 : 2} />
                        <span>Dashboard</span>
                    </Link>
                    <Link href="/admin/posts" className={navItemClass("/admin/posts")}>
                        <FileText size={20} strokeWidth={isActive("/admin/posts") ? 2.5 : 2} />
                        <span>All Posts</span>
                    </Link>
                    <Link href="/admin/new" className={navItemClass("/admin/new")}>
                        <PenSquare size={20} strokeWidth={isActive("/admin/new") ? 2.5 : 2} />
                        <span>New Post</span>
                    </Link>
                    <Link href="/admin/media" className={navItemClass("/admin/media")}>
                        <ImageIcon size={20} strokeWidth={isActive("/admin/media") ? 2.5 : 2} />
                        <span>Media</span>
                    </Link>
                    <Link href="/admin/settings" className={`${navItemClass("/admin/settings")} mt-4`}>
                        <Settings size={20} strokeWidth={isActive("/admin/settings") ? 2.5 : 2} />
                        <span>Settings</span>
                    </Link>
                </nav>

                <div className="p-6">
                    <Link href="/admin/new" className="w-full bg-[#6d28d9] text-white border-2 border-[#121212] font-black uppercase tracking-wider py-4 shadow-[4px_4px_0px_0px_#121212] hover:translate-y-[2px] hover:translate-x-[2px] hover:shadow-[2px_2px_0px_0px_#121212] flex items-center justify-center transition-all">
                        Publish Post
                    </Link>
                </div>

                <div className="px-6 pb-6 pt-2 flex flex-col gap-4 text-xs font-bold text-gray-500">
                    <Link href="#" className="flex items-center gap-2 hover:text-black transition-colors">
                        <BookOpen size={14} strokeWidth={2.5} />
                        Docs
                    </Link>
                    <Link href="#" className="flex items-center gap-2 hover:text-black transition-colors">
                        <LifeBuoy size={14} strokeWidth={2.5} />
                        Support
                    </Link>
                </div>
            </aside>

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col h-full overflow-hidden">

                {/* Top Navbar */}
                <header className="h-[70px] flex-shrink-0 border-b-2 border-[#121212] bg-[#fdfdfc] flex items-center justify-between px-6 z-10">
                    <div className="flex items-center h-full">
                        <h1 className="font-black text-xl tracking-tighter mr-8 border-b-[4px] border-[#fce96a] h-full flex items-center pt-1">
                            DEVBLOG ADMIN
                        </h1>
                        <nav className="flex items-center gap-6 h-full font-bold text-sm text-gray-500 tracking-wide uppercase">
                            <Link href="#" className="text-[#121212] h-full flex items-center border-b-[4px] border-[#fce96a] pt-1">Analytics</Link>
                            <Link href="#" className="h-full flex items-center pt-1 hover:text-[#121212] transition-colors">Posts</Link>
                            <Link href="#" className="h-full flex items-center pt-1 hover:text-[#121212] transition-colors">Drafts</Link>
                        </nav>
                    </div>

                    <div className="flex items-center gap-6">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} strokeWidth={2.5} />
                            <input
                                type="text"
                                placeholder="Search resources..."
                                className="pl-10 pr-4 py-2 w-[280px] bg-white border-2 border-[#121212] text-sm font-medium outline-none focus:border-blue-600 focus:shadow-[2px_2px_0px_0px_#121212] transition-all"
                            />
                        </div>

                        <div className="relative">
                            <button
                                onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
                                className="relative hover:scale-110 transition-transform cursor-pointer"
                            >
                                <Bell size={22} strokeWidth={2.5} />
                                <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full border-2 border-white"></span>
                            </button>

                            {/* Notifications Dropdown */}
                            {isNotificationsOpen && (
                                <div className="absolute top-10 right-0 w-[300px] bg-white border-4 border-[#121212] shadow-[4px_4px_0px_0px_#121212] flex flex-col animate-in slide-in-from-top-2 duration-200 z-50">
                                    <div className="bg-[#fce96a] border-b-2 border-[#121212] p-3">
                                        <h3 className="font-black uppercase text-sm">Notifications</h3>
                                    </div>
                                    <div className="flex flex-col">
                                        <div className="p-4 border-b-2 border-dashed border-[#121212] hover:bg-gray-50 cursor-pointer">
                                            <p className="font-bold text-sm">New subscriber: Alex</p>
                                            <p className="text-xs text-gray-500 font-bold uppercase mt-1">2m ago</p>
                                        </div>
                                        <div className="p-4 border-b-2 border-dashed border-[#121212] hover:bg-gray-50 cursor-pointer">
                                            <p className="font-bold text-sm">System update completed</p>
                                            <p className="text-xs text-gray-500 font-bold uppercase mt-1">1h ago</p>
                                        </div>
                                    </div>
                                    <button className="p-3 bg-[#f4f4f4] text-xs font-black uppercase text-center hover:bg-[#e5e5e5] transition-colors">
                                        Mark all as read
                                    </button>
                                </div>
                            )}
                        </div>

                        <button className="hover:scale-110 transition-transform">
                            <Settings size={22} strokeWidth={2.5} />
                        </button>

                        {/* Profile Menu */}
                        <div className="relative ml-2">
                            <button
                                onClick={() => { setIsProfileOpen(!isProfileOpen); setIsNotificationsOpen(false) }}
                                className="w-10 h-10 border-2 border-[#121212] overflow-hidden bg-blue-100 flex items-center justify-center cursor-pointer hover:shadow-[2px_2px_0px_0px_#121212] transition-all"
                            >
                                {user?.avatar_url
                                    ? <img src={user.avatar_url} alt={user.name} className="w-full h-full object-cover" />
                                    : <User size={18} strokeWidth={2.5} />
                                }
                            </button>

                            {isProfileOpen && (
                                <div className="absolute top-12 right-0 w-[220px] bg-white border-4 border-[#121212] shadow-[4px_4px_0px_0px_#121212] flex flex-col z-50 animate-in slide-in-from-top-2 duration-200">
                                    {/* Profile Header */}
                                    <div className="bg-[#ddd6fe] border-b-2 border-[#121212] p-4 flex items-center gap-3">
                                        <div className="w-10 h-10 border-2 border-[#121212] overflow-hidden flex-shrink-0 bg-blue-100 flex items-center justify-center">
                                            {user?.avatar_url
                                                ? <img src={user.avatar_url} alt={user.name} className="w-full h-full object-cover" />
                                                : <User size={16} strokeWidth={2.5} />
                                            }
                                        </div>
                                        <div>
                                            <p className="font-black text-sm">{user?.name ?? "Admin"}</p>
                                            <p className="text-[10px] font-bold text-gray-600 uppercase">{user?.email}</p>
                                        </div>
                                    </div>

                                    {/* Menu items */}
                                    <div className="flex flex-col">
                                        <Link href="/admin/settings" onClick={() => setIsProfileOpen(false)} className="flex items-center gap-3 px-4 py-3 font-bold text-sm hover:bg-gray-50 border-b-2 border-dashed border-gray-200 transition-colors">
                                            <User size={16} strokeWidth={2.5} />
                                            Mon profil
                                        </Link>
                                        <Link href="/admin/settings" onClick={() => setIsProfileOpen(false)} className="flex items-center gap-3 px-4 py-3 font-bold text-sm hover:bg-gray-50 border-b-2 border-dashed border-gray-200 transition-colors">
                                            <Settings size={16} strokeWidth={2.5} />
                                            Paramètres
                                        </Link>
                                        <button
                                            onClick={handleLogout}
                                            className="flex items-center gap-3 px-4 py-3 font-black text-sm text-red-600 hover:bg-red-50 transition-colors w-full text-left uppercase tracking-wide"
                                        >
                                            <LogOut size={16} strokeWidth={2.5} />
                                            Se déconnecter
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </header>

                {/* Scrollable Dashboard Content */}
                <main className="flex-1 overflow-y-auto p-10 bg-[#fdfdfc]">
                    {children}
                </main>
            </div>

        </div>
    )
}
