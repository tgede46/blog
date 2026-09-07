"use client"

import React, { useEffect, useState } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { FileText, Image as ImageIcon, LayoutDashboard, LogOut, Menu, PenSquare, Settings, X } from "lucide-react"
import { useTranslations } from "next-intl"
import { useAuth } from "@/lib/auth"
import BrandMark from "@/components/BrandMark"

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const t = useTranslations("Admin")
  const tAuth = useTranslations("Auth")
  const tCommon = useTranslations("Common")
  const pathname = usePathname()
  const router = useRouter()
  const { user, logout, isLoading } = useAuth()
  const [open, setOpen] = useState(false)

  const links = [
    { href: "/admin", label: t("dashboard"), icon: LayoutDashboard },
    { href: "/admin/posts", label: t("posts"), icon: FileText },
    { href: "/admin/new", label: t("newPost"), icon: PenSquare },
    { href: "/admin/media", label: t("media"), icon: ImageIcon },
    { href: "/admin/settings", label: t("settings"), icon: Settings },
  ]

  useEffect(() => {
    if (!isLoading && !user) router.replace("/?login=required")
  }, [isLoading, router, user])

  if (isLoading || !user) {
    return <div className="graphic-grid flex min-h-screen items-center justify-center bg-surface font-semibold text-[#596275]"><span className="neo-card bg-tertiary-fixed p-6">{tAuth("sessionLoading")}</span></div>
  }

  async function handleLogout() {
    await logout()
    router.replace("/")
  }

  const sidebar = (
    <>
      <div className="flex items-center justify-between border-b-2 border-on-surface p-5">
        <BrandMark className="text-xl" />
        <button className="md:hidden" onClick={() => setOpen(false)} aria-label={tCommon("close")}><X /></button>
      </div>
      <nav className="flex-1 space-y-1 p-4">
        {links.filter(({ href }) => href !== "/admin/settings" || user.role === "admin").map(({ href, label, icon: Icon }) => {
          const active = href === "/admin" ? pathname === href : pathname.startsWith(href)
          return <Link key={href} href={href} onClick={() => setOpen(false)} className={`flex items-center gap-3 border-2 px-4 py-3 font-bold transition-all ${active ? "border-on-surface bg-primary-fixed text-on-surface active-nav-shadow" : "border-transparent text-[#596275] hover:border-on-surface hover:bg-tertiary-fixed"}`}><Icon size={19} />{label}</Link>
        })}
      </nav>
      <div className="border-t-2 border-on-surface p-4">
        <p className="truncate px-3 text-sm font-semibold">{user.name}</p>
        <p className="truncate px-3 text-xs text-[#7d8492]">{user.email}</p>
        <button onClick={() => void handleLogout()} className="mt-3 flex w-full items-center gap-3 border-2 border-transparent px-4 py-3 font-semibold text-red-700 hover:border-red-700 hover:bg-red-50"><LogOut size={18} />{tAuth("logout", { ns: "Nav" })}</button>
      </div>
    </>
  )

  return (
    <div className="graphic-grid min-h-screen bg-surface text-on-surface md:flex">
      <aside className="hidden min-h-screen w-64 shrink-0 flex-col border-r-2 border-on-surface bg-white md:flex">{sidebar}</aside>
      {open && <div className="fixed inset-0 z-50 bg-black/30 md:hidden" onClick={() => setOpen(false)}><aside className="flex h-full w-72 flex-col bg-white" onClick={(event) => event.stopPropagation()}>{sidebar}</aside></div>}
      <div className="min-w-0 flex-1">
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b-2 border-on-surface bg-white/95 px-5 backdrop-blur md:px-8">
          <button className="neo-button bg-white p-2 md:hidden" onClick={() => setOpen(true)} aria-label={tCommon("open")}><Menu /></button>
          <p className="font-heading font-bold">{t("dashboard")}</p>
          <Link href="/" className="text-sm font-semibold text-on-surface">{tCommon("viewSite")} ↗</Link>
        </header>
        <main className="p-5 sm:p-8">{children}</main>
      </div>
    </div>
  )
}
