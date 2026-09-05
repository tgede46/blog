"use client"

import Link from "next/link"
import { Menu, X } from "lucide-react"
import { useState } from "react"
import ConnectDialog from "./ConnectDialog"
import { useAuth } from "@/lib/auth"

export default function Nav({ loginRequired = false }: { loginRequired?: boolean }) {
  const [loginOpen, setLoginOpen] = useState(loginRequired)
  const [menuOpen, setMenuOpen] = useState(false)
  const { isAuthenticated, isLoading, logout } = useAuth()
  const links = <><Link href="/articles">Articles</Link><Link href="/a-propos">À propos</Link><Link href="/contact">Contact</Link></>

  return (
    <nav className="sticky top-0 z-50 border-b border-black/10 bg-[#fbfaf7]/95 backdrop-blur" aria-label="Navigation principale">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4">
        <Link href="/" className="font-heading text-xl font-black">Gedeon<span className="text-violet-600">.</span></Link>
        <div className="hidden items-center gap-7 text-sm font-semibold md:flex">{links}{!isLoading && (isAuthenticated ? <><Link href="/admin" className="rounded-full bg-[#1d2433] px-5 py-2.5 text-white">Administration</Link><button onClick={() => void logout()}>Déconnexion</button></> : <button onClick={() => setLoginOpen(true)} className="rounded-full border border-[#1d2433] px-5 py-2.5">Connexion</button>)}</div>
        <button className="md:hidden" onClick={() => setMenuOpen((value) => !value)} aria-label="Afficher le menu" aria-expanded={menuOpen}>{menuOpen ? <X /> : <Menu />}</button>
      </div>
      {menuOpen && <div className="flex flex-col gap-4 border-t border-black/10 px-5 py-5 font-semibold md:hidden">{links}{isAuthenticated ? <Link href="/admin">Administration</Link> : <button className="text-left" onClick={() => setLoginOpen(true)}>Connexion</button>}</div>}
      <ConnectDialog open={loginOpen} onClose={() => setLoginOpen(false)} />
    </nav>
  )
}
