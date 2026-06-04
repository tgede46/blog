import React from "react"

export default function Newsletter() {
  return (
    <section className="py-24 mb-24 bg-on-surface text-surface px-8 md:px-16 border-2 border-on-surface relative overflow-hidden">
      <div className="absolute top-0 right-0 w-64 h-64 bg-tertiary-fixed/10 blur-3xl rounded-full translate-x-1/2 -translate-y-1/2" />
      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        <div className="space-y-6">
          <h2 className="font-headline font-bold text-4xl md:text-5xl leading-tight">Rejoignez la communauté de développeurs.</h2>
          <p className="text-surface/70 text-lg">Chaque semaine, recevez une sélection de ressources, des conseils exclusifs et les coulisses de mes projets directement dans votre boîte mail.</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-4">
          <input
            className="flex-grow bg-surface/5 px-6 py-4 font-body focus:border-tertiary-fixed focus:ring-0 text-surface"
            placeholder="votre@email.com"
            type="email"
            style={{ border: "2px solid rgba(240,237,237,0.2)" }}
          />
          <button className="bg-tertiary-fixed text-on-tertiary-fixed border-2 border-on-surface px-8 py-4 font-headline font-bold uppercase tracking-widest hard-shadow-sm hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all">S&apos;inscrire</button>
        </div>
      </div>
    </section>
  )
}
