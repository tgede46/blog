import Link from "next/link"

export default function BrandMark({ href = "/", className = "text-2xl" }: { href?: string; className?: string }) {
  return (
    <Link href={href} className={`font-heading font-black tracking-tight text-on-surface ${className}`}>
      Gedeon<span className="bg-tertiary-fixed px-0.5">.</span>
    </Link>
  )
}
