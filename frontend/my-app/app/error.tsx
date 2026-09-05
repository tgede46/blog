"use client"

import { useEffect } from "react"

export default function GlobalError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <main className="flex min-h-[70vh] items-center justify-center bg-[#fbfaf7] px-5 text-center">
      <div>
        <p className="text-sm font-bold uppercase tracking-[.2em] text-red-600">Erreur</p>
        <h1 className="mt-3 font-heading text-4xl font-black text-[#1d2433]">Quelque chose s’est mal passé.</h1>
        <p className="mt-4 text-[#596275]">La page n’a pas pu être chargée. Vous pouvez relancer la requête.</p>
        <button onClick={reset} className="neo-button mt-7 bg-tertiary-fixed px-7 py-3 font-black uppercase tracking-wide">Réessayer</button>
      </div>
    </main>
  )
}
