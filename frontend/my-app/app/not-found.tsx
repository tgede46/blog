import Link from "next/link"

export default function NotFound() {
  return (
    <main className="graphic-grid relative flex min-h-screen items-center justify-center overflow-hidden bg-surface px-5 py-16 text-on-surface">
      <div className="absolute left-[8%] top-[12%] h-20 w-20 -rotate-12 border-2 border-on-surface bg-js-rose hard-shadow" aria-hidden="true" />
      <div className="absolute bottom-[10%] right-[8%] h-28 w-28 rotate-12 border-2 border-on-surface bg-ts-blue hard-shadow" aria-hidden="true" />
      <section className="neo-card relative z-10 w-full max-w-3xl p-7 text-center sm:p-12">
        <p className="mx-auto w-fit -rotate-2 border-2 border-on-surface bg-primary-fixed px-5 py-2 text-sm font-black uppercase tracking-[.2em] hard-shadow-sm">Erreur de navigation</p>
        <p className="mt-8 font-heading text-[clamp(7rem,24vw,13rem)] font-black leading-[.72] tracking-[-.08em] text-on-surface" aria-hidden="true">404</p>
        <h1 className="mt-10 font-heading text-4xl font-black sm:text-5xl">Cette page s’est perdue dans le code.</h1>
        <p className="mx-auto mt-5 max-w-xl text-lg leading-8 text-on-surface/70">L’adresse est peut-être incorrecte, ou la page a été déplacée pendant une mise à jour.</p>
        <nav className="mt-9 flex flex-wrap justify-center gap-4" aria-label="Liens après erreur">
          <Link href="/" className="neo-button bg-tertiary-fixed px-6 py-3 font-black uppercase tracking-wide">Retour à l’accueil</Link>
          <Link href="/articles" className="neo-button bg-node-green px-6 py-3 font-black uppercase tracking-wide">Voir les articles</Link>
          <Link href="/contact" className="neo-button bg-white px-6 py-3 font-black uppercase tracking-wide">Signaler le problème</Link>
        </nav>
        <p className="mt-10 border-t-2 border-on-surface pt-5 font-mono text-xs font-bold uppercase tracking-widest">Java · TypeScript · Python</p>
      </section>
    </main>
  )
}
