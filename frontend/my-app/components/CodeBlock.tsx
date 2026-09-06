"use client"

import { useState } from "react"
import { Check, Copy } from "lucide-react"

type Props = {
  code: string
  filename?: string
}

export default function CodeBlock({ code, filename = "snippet.ts" }: Props) {
  const [copied, setCopied] = useState(false)

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(code)
    } catch {
      const textarea = document.createElement("textarea")
      textarea.value = code
      document.body.appendChild(textarea)
      textarea.select()
      document.execCommand("copy")
      document.body.removeChild(textarea)
    }
    setCopied(true)
    window.setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="my-8 overflow-hidden rounded-2xl border border-[#1d2433]/15 bg-[#1d2433] text-[#e8eaef] shadow-[0_12px_40px_rgba(29,36,51,0.18)]">
      <div className="flex items-center justify-between border-b border-white/10 px-5 py-3">
        <span className="font-mono text-xs text-white/55">{filename}</span>
        <button
          type="button"
          onClick={() => void handleCopy()}
          className={`flex items-center gap-1.5 rounded-md px-2.5 py-1 text-xs font-semibold transition-colors ${
            copied ? "bg-emerald-500/20 text-emerald-300" : "bg-white/5 text-white/60 hover:bg-white/10 hover:text-white"
          }`}
          aria-label="Copier le code"
        >
          {copied ? <Check size={14} /> : <Copy size={14} />}
          {copied ? "Copié" : "Copier"}
        </button>
      </div>
      <pre className="overflow-x-auto px-5 py-5 font-mono text-[0.95rem] leading-7">
        <code>{code}</code>
      </pre>
    </div>
  )
}
