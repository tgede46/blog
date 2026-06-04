import React from "react"

type Variant = "js" | "ts" | "node" | "neutral"

const variantClass: Record<Variant, string> = {
  js: "bg-js-rose",
  ts: "bg-ts-blue",
  node: "bg-node-green",
  neutral: "bg-surface-container-lowest",
}

export default function TechChip({
  label,
  variant = "neutral",
  size = 12,
}: {
  label: string
  variant?: Variant
  size?: number
}) {
  const px = size
  const style: React.CSSProperties = {
    width: px,
    height: px,
    minWidth: px,
    minHeight: px,
  }

  return (
    <div
      className={`rounded-full border-2 border-on-surface flex items-center justify-center ${variantClass[variant]} hard-shadow-sm`}
      style={style}
      aria-label={label}
      role="img"
    >
      <span className="text-[12px] text-on-surface leading-none" style={{ paddingLeft: 2, paddingRight: 2 }}>
        {label}
      </span>
    </div>
  )
}
