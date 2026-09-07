"use client"

import Link from "next/link"
import { Menu, X } from "lucide-react"
import { useState } from "react"
import BrandMark from "./BrandMark"
import ConnectDialog from "./ConnectDialog"
import { useAuth } from "@/lib/auth"

export default function Nav({ loginRequired = false, loginNext }: { loginRequired?: boolean; loginNext?: string }) {
  const [loginOpen, setLoginOpen] = useState(loginRequired)
  const [menuOpen, setMenuOpen] = useState(false)
  const { isAuthenticated, isLoading, logout } = useAuth()
  const links = (
    <>
      <Link href="/articles" className="font-bold hover:bg-tertiary-fixed">Articles</Link>
      <Link href="/a-propos" className="font-bold hover:bg-tertiary-fixed">À propos</Link>
      <Link href="/contact" className="font-bold hover:bg-tertiary-fixed">Contact</Link>
    </>
  )

  return (
    <nav className="sticky top-0 z-50 border-b-2 border-on-surface bg-surface/95 backdrop-blur" aria-label="Navigation principale">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4">
        <BrandMark />
        <div className="hidden items-center gap-7 text-sm md:flex">
          {links}
          {!isLoading && (isAuthenticated ? (
            <>
              <Link href="/admin" className="neo-button bg-on-surface px-5 py-2.5 text-surface">Administration</Link>
              <button className="border-b-2 border-transparent font-bold hover:border-tertiary-fixed" onClick={() => void logout()}>Déconnexion</button>
            </>
          ) : (
            <button onClick={() => setLoginOpen(true)} className="neo-button bg-tertiary-fixed px-5 py-2.5 font-bold">Connexion</button>
          ))}
        </div>
        <button className="neo-button bg-white p-2 md:hidden" onClick={() => setMenuOpen((value) => !value)} aria-label="Afficher le menu" aria-expanded={menuOpen}>{menuOpen ? <X /> : <Menu />}</button>
      </div>
      {menuOpen && (
        <div className="flex flex-col gap-4 border-t-2 border-on-surface bg-surface px-5 py-5 md:hidden">
          {links}
          {isAuthenticated ? <Link href="/admin" className="font-bold">Administration</Link> : <button className="text-left font-bold" onClick={() => setLoginOpen(true)}>Connexion</button>}
        </div>
      )}
      <ConnectDialog open={loginOpen} onClose={() => setLoginOpen(false)} redirectTo={loginNext} />
    </nav>
  )
}
