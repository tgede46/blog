"use client"

import React, { useState } from "react"
import { Copy, Check } from "lucide-react"

type Props = {
    code: string
    filename?: string
}



export default function CodeBlock({ code, filename = "snippet.ts" }: Props) {
    const [copied, setCopied] = useState(false)

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(code)
            setCopied(true)
            setTimeout(() => setCopied(false), 2000)
        } catch {
            // Fallback for older browsers
            const textarea = document.createElement("textarea")
            textarea.value = code
            document.body.appendChild(textarea)
            textarea.select()
            document.execCommand("copy")
            document.body.removeChild(textarea)
            setCopied(true)
            setTimeout(() => setCopied(false), 2000)
        }
    }

    return (
        <div className="overflow-hidden border border-[#2d2d2d] bg-[#222] text-[#d7d7d7] shadow-[4px_4px_0px_0px_#212121]">
            <div className="flex items-center justify-between border-b border-white/10 bg-[#2b2b2b] px-4 py-2 text-[10px] uppercase tracking-[0.22em] text-white/50">
                <span>{filename}</span>
                <div className="flex items-center gap-3">
                    {/* Copy Button */}
                    <button
                        onClick={handleCopy}
                        className={`flex items-center gap-1.5 px-2.5 py-1 border border-white/15 rounded-sm text-[10px] uppercase tracking-[0.18em] font-bold transition-all cursor-pointer ${copied
                                ? "bg-green-600/30 text-green-400 border-green-500/40"
                                : "bg-white/5 text-white/50 hover:bg-white/15 hover:text-white/80"
                            }`}
                        aria-label="Copy code"
                    >
                        {copied ? (
                            <>
                                <Check size={12} strokeWidth={2.5} />
                                Copied!
                            </>
                        ) : (
                            <>
                                <Copy size={12} strokeWidth={2.5} />
                                Copy
                            </>
                        )}
                    </button>
                    {/* Traffic light dots */}
                    <div className="flex items-center gap-1.5">
                        <span className="h-2 w-2 rounded-full bg-[#ff5f56]" />
                        <span className="h-2 w-2 rounded-full bg-[#ffbd2e]" />
                        <span className="h-2 w-2 rounded-full bg-[#27c93f]" />
                    </div>
                </div>
            </div>
            <pre className="overflow-x-auto px-5 py-5 font-mono text-[0.94rem] leading-8 text-[#d7d7d7]">
                <code>{code}</code>
            </pre>
        </div>
    )
}
