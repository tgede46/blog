import Image from "next/image"
import React from "react"

export default function Hero() {
  return (
    <section className="py-24 md:py-32 flex flex-col md:flex-row items-center gap-16 border-b-2 border-on-surface/10">
      <div className="flex-1 space-y-8">
        <div className="inline-block px-3 py-1 bg-js-rose border-2 border-on-surface font-headline font-bold text-sm uppercase tracking-widest hard-shadow-sm">
          Développeur &amp; Formateur
        </div>
        <h1 className="font-headline font-bold text-5xl md:text-7xl leading-[1.1] tracking-tight text-on-surface">
          Apprenez le <span className="underline decoration-tertiary-fixed decoration-8 underline-offset-4">Java</span>, TypeScript et Python.
        </h1>
        <p className="text-xl md:text-2xl text-on-surface/80 max-w-2xl leading-relaxed">
          À travers différents articles et vidéos, je partage mon expérience pour vous aider à devenir un meilleur développeur web.
        </p>
        <div className="flex flex-wrap gap-6 pt-4">
          <button className="bg-primary-fixed border-2 border-on-surface px-8 py-4 font-headline font-bold text-lg uppercase tracking-wider hard-shadow hover:translate-x-[4px] hover:translate-y-[4px] hover:shadow-none transition-all">À propos</button>
          <button className="bg-surface-container-lowest border-2 border-on-surface px-8 py-4 font-headline font-bold text-lg uppercase tracking-wider hard-shadow hover:translate-x-[4px] hover:translate-y-[4px] hover:shadow-none transition-all">Contact</button>
        </div>
      </div>
      <div className="flex-1 relative hidden lg:block">
        <div className="w-full aspect-square border-2 border-on-surface bg-tertiary-fixed rotate-3 absolute inset-0 -z-10"></div>
        <div className="w-full aspect-square border-2 border-on-surface bg-surface-container-lowest overflow-hidden">
          <Image
            alt="Developer workspace"
            className="w-full h-full object-cover grayscale contrast-125"
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuAjv-WVi68JkRH1ksbhp_ZL8dbplUsZt7ykqPE5ZyHLKoawEkob6X7Oj65Bn1cKlweaNn_HWO40T3l9LuTG8RrzkwuE4P-JbDcGP4aCHhsf47C5t1mjmQdfkn1a0a3IEC06IPTmqQxFIHKdEjJ0sg3pMEgj_uyscFYp3SFBPfTiaKa9N3lxhpGqV5wbH1LDEBcirEuudqlTo4eySBgjDAv347cFQe9viQ8Oi--9GL-pm6jCPIKnXykoE6wWbA6sJIF4HjzJJRWDmS2q"
            width={800}
            height={800}
            loading="eager"
          />
        </div>
      </div>
    </section>
  )
}
