import Link from "next/link"

export default function NotFound() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[#fbfaf7] px-5 text-center">
      <div>
        <p className="font-heading text-8xl font-black text-[#e5ddfa]">404</p>
        <h1 className="mt-2 font-heading text-4xl font-black text-[#1d2433]">Cette page n’existe pas.</h1>
        <p className="mt-4 text-[#596275]">Elle a peut-être été déplacée ou supprimée.</p>
        <Link href="/" className="mt-7 inline-block rounded-full bg-[#1d2433] px-7 py-3 font-bold text-white">Retour à l’accueil</Link>
      </div>
    </main>
  )
}
