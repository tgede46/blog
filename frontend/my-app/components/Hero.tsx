import Link from "next/link"

export default function Hero({ description }: { description?: string }) {
  return (
    <section className="grid min-h-[650px] items-center gap-12 py-20 md:grid-cols-[1.1fr_.9fr]">
      <div>
        <p className="mb-5 inline-flex rounded-full bg-[#f4d9e8] px-4 py-2 text-xs font-bold uppercase tracking-[.18em]">Développement · Architecture · Produit</p>
        <h1 className="max-w-[11ch] font-heading text-5xl font-black leading-[.98] tracking-[-.05em] sm:text-7xl">Je construis, j’apprends, je partage.</h1>
        <p className="mt-7 max-w-xl text-lg leading-8 text-[#596275]">{description || "Des notes concrètes de Gedeon Kpara sur le web, le code maintenable et les décisions qui transforment une idée en produit utile."}</p>
        <div className="mt-9 flex flex-wrap gap-4"><Link href="/articles" className="rounded-full bg-[#1d2433] px-7 py-3.5 font-bold text-white">Lire les articles</Link><Link href="/a-propos" className="rounded-full border border-[#1d2433] px-7 py-3.5 font-bold">Me découvrir</Link></div>
      </div>
      <div className="relative mx-auto aspect-square w-full max-w-[450px]" aria-hidden="true">
        <div className="absolute inset-5 rotate-6 rounded-[3rem] bg-[#d9e8ff]" />
        <div className="absolute inset-0 -rotate-3 rounded-[3rem] bg-[#f9e7a9]" />
        <svg viewBox="0 0 500 500" className="relative h-full w-full"><path d="M100 350c28-104 80-170 158-198 73-26 138 29 153 99 15 68-27 143-99 164-84 25-188 3-212-65Z" fill="#fffaf0" stroke="#1d2433" strokeWidth="4"/><rect x="135" y="184" width="234" height="151" rx="16" fill="#fff" stroke="#1d2433" strokeWidth="4"/><path d="M162 220h80M162 246h150M162 272h105" stroke="#8b5cf6" strokeWidth="10" strokeLinecap="round"/><path d="m215 366 26-31h52l28 31" fill="#f4d9e8" stroke="#1d2433" strokeWidth="4"/><circle cx="392" cy="126" r="30" fill="#d6f3df" stroke="#1d2433" strokeWidth="4"/></svg>
      </div>
    </section>
  )
}
