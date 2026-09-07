import Link from "next/link"

export default function Hero({ title, description }: { title?: string; description?: string }) {
  return (
    <section className="grid items-center gap-12 overflow-visible border-b-2 border-on-surface/10 py-16 md:min-h-[620px] md:grid-cols-[1.1fr_.9fr] md:gap-10 md:py-20">
      <div>
        <p className="neo-eyebrow mb-6 inline-flex -rotate-1 border-2 border-on-surface bg-js-rose px-4 py-2 hard-shadow-sm">
          Développement · Architecture · Produit
        </p>
        <h1 className="max-w-3xl font-heading text-5xl font-black leading-[.98] tracking-[-.05em] sm:text-7xl">
          {title || "Apprenez le Java, TypeScript et Python à travers différents articles"}
        </h1>
        <p className="mt-7 max-w-xl text-lg leading-8 text-[#596275]">
          {description || "Des notes concrètes de Gedeon Kpara sur le web, le code maintenable et les décisions qui transforment une idée en produit utile."}
        </p>
        <div className="mt-9 flex flex-wrap gap-5">
          <Link href="/articles" className="neo-button bg-primary-fixed px-7 py-3.5 font-black uppercase tracking-wide">
            Lire les articles
          </Link>
          <Link href="/a-propos" className="neo-button bg-ts-blue px-7 py-3.5 font-black uppercase tracking-wide">
            Me découvrir
          </Link>
        </div>
      </div>

      <div className="relative mx-auto aspect-square w-full max-w-[420px]" aria-hidden="true">
        <div className="absolute inset-[14%] rotate-[10deg] border-2 border-on-surface bg-ts-blue hard-shadow" />
        <div className="absolute inset-[8%] -rotate-[6deg] border-2 border-on-surface bg-white" />
        <div className="absolute inset-[2%] flex -rotate-3 items-center justify-center border-2 border-on-surface bg-tertiary-fixed hard-shadow">
          <svg viewBox="0 0 500 500" className="h-[88%] w-[88%]" role="img">
            <rect x="108" y="150" width="250" height="168" rx="18" fill="#fff" stroke="#1d2433" strokeWidth="5" />
            <rect x="128" y="172" width="210" height="124" rx="8" fill="#fcf9f8" stroke="#1d2433" strokeWidth="3" />
            <path d="M152 205h70M152 238h140M152 271h96" stroke="#1d2433" strokeWidth="12" strokeLinecap="round" />
            <path d="m190 348 28-30h80l30 30" fill="#f4d9e8" stroke="#1d2433" strokeWidth="4" />
            <circle cx="392" cy="148" r="34" fill="#d6f3df" stroke="#1d2433" strokeWidth="5" />
          </svg>
        </div>
      </div>
    </section>
  )
}
