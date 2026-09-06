import type { ReactNode } from "react"

type CalloutProps = {
  children: ReactNode
  variant?: "quote" | "tip"
  className?: string
}

export default function Callout({ children, variant = "quote", className = "" }: CalloutProps) {
  if (variant === "tip") {
    return (
      <aside
        className={`rounded-2xl border border-[#93c5fd] bg-[#e8f2ff] px-5 py-4 text-[1.02rem] leading-8 text-[#1d2433] ${className}`}
      >
        {children}
      </aside>
    )
  }

  return (
    <blockquote
      className={`relative rounded-xl border border-[#1d2433] bg-[#fdf8f6] px-6 py-5 text-[#1d2433] shadow-[4px_4px_0_0_#1d2433] ${className}`}
    >
      <span className="mb-2 block font-serif text-3xl leading-none text-[#b08968]" aria-hidden="true">
        “
      </span>
      <div className="text-[1.05rem] italic leading-8">{children}</div>
    </blockquote>
  )
}
