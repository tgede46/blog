import React from "react"
import { Link as LinkIcon, Share2 } from "lucide-react"

export default function SiteFooter() {
  return (
    <footer className="bg-[#fcf9f8] dark:bg-zinc-950 border-t-2 border-[#212121] dark:border-zinc-800 mt-20">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-12 w-full px-8 py-16 max-w-7xl mx-auto font-['Atkinson_Hyperlegible'] text-base leading-relaxed">
        <div className="space-y-6">
          <div className="text-lg font-bold text-[#212121] dark:text-zinc-50 font-headline uppercase tracking-tighter">Gedeon Kpara</div>
          <p className="text-[#212121]/60 dark:text-zinc-500 max-w-xs">Partager la connaissance pour élever l&apos;ingénierie logicielle. Un article à la fois.</p>
          <div className="flex gap-4">
            <a
              className="w-10 h-10 border-2 border-on-surface flex items-center justify-center hover:bg-tertiary-fixed transition-colors hard-shadow-sm"
              href="#"
              aria-label="Lien"
            >
              <LinkIcon size={16} strokeWidth={2} className="text-on-surface" />
            </a>
            <a
              className="w-10 h-10 border-2 border-on-surface flex items-center justify-center hover:bg-tertiary-fixed transition-colors hard-shadow-sm"
              href="#"
              aria-label="Partager"
            >
              <Share2 size={16} strokeWidth={2} className="text-on-surface" />
            </a>
          </div>
        </div>
        <div className="space-y-6">
          <h4 className="font-headline font-bold uppercase text-sm tracking-widest text-on-surface">Navigation</h4>
          <ul className="space-y-4">
            <li><a className="text-[#212121]/60 dark:text-zinc-500 hover:text-[#212121] dark:hover:text-zinc-200 hover:translate-x-1 transition-transform inline-block" href="#">Articles</a></li>
            <li><a className="text-[#212121]/60 dark:text-zinc-500 hover:text-[#212121] dark:hover:text-zinc-200 hover:translate-x-1 transition-transform inline-block" href="#">Projets</a></li>
            <li><a className="text-[#212121]/60 dark:text-zinc-500 hover:text-[#212121] dark:hover:text-zinc-200 hover:translate-x-1 transition-transform inline-block" href="#">À propos</a></li>
            <li><a className="text-[#212121]/60 dark:text-zinc-500 hover:text-[#212121] dark:hover:text-zinc-200 hover:translate-x-1 transition-transform inline-block" href="#">Mentions Légales</a></li>
          </ul>
        </div>
        <div className="space-y-6">
          <h4 className="font-headline font-bold uppercase text-sm tracking-widest text-on-surface">Connect</h4>
          <div className="flex flex-wrap gap-4">
            <a className="px-4 py-2 border-2 border-on-surface font-headline font-bold text-xs uppercase tracking-widest hover:bg-tertiary-fixed transition-colors" href="#">GitHub</a>
            <a className="px-4 py-2 border-2 border-on-surface font-headline font-bold text-xs uppercase tracking-widest hover:bg-tertiary-fixed transition-colors" href="#">Twitter</a>
            <a className="px-4 py-2 border-2 border-on-surface font-headline font-bold text-xs uppercase tracking-widest hover:bg-tertiary-fixed transition-colors" href="#">Newsletter</a>
            <a className="px-4 py-2 border-2 border-on-surface font-headline font-bold text-xs uppercase tracking-widest hover:bg-tertiary-fixed transition-colors" href="#">RSS</a>
          </div>
          <div className="pt-8 text-sm text-on-surface/40">© 20226 kpara gedeon. Built with precision.</div>
        </div>
      </div>
    </footer>
  )
}
