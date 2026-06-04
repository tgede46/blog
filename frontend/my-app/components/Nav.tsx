"use client"

import Link from "next/link"
import React from "react"
import ConnectDialog from "./ConnectDialog"

export default function Nav() {
  const [open, setOpen] = React.useState(false)

  return (
    <nav className="bg-[#fcf9f8] dark:bg-zinc-950 sticky top-0 z-50">
      <div className="flex justify-between items-center w-full px-6 py-4 max-w-7xl mx-auto">
        <Link href="#" className="text-2xl font-black text-[#212121] dark:text-zinc-50 tracking-tighter font-headline">
          Gedeon Kpara
        </Link>

        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={() => setOpen(true)}
            className="bg-primary text-on-primary px-6 py-2 border-2 border-[#212121] rounded font-headline font-bold uppercase tracking-wide hard-shadow-sm hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all"
          >
            Se connecter
          </button>
        </div>
      </div>

      <ConnectDialog open={open} onClose={() => setOpen(false)} />
    </nav>
  )
}
