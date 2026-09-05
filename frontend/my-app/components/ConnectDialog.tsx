"use client"

import { X, Loader2, AlertCircle } from "lucide-react"
import React, { useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth"

type ConnectDialogProps = {
  open: boolean
  onClose: () => void
}

export default function ConnectDialog({ open, onClose }: ConnectDialogProps) {
  const router = useRouter()
  const { login } = useAuth()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  React.useEffect(() => {
    if (!open) {
      return
    }

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose()
      }
    }

    window.addEventListener("keydown", onKeyDown)

    return () => window.removeEventListener("keydown", onKeyDown)
  }, [open, onClose])

  if (!open) {
    return null
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setIsLoading(true)
    try {
      await login(email, password)
      onClose()
      router.push("/admin")
    } catch (err) {
      setError(err instanceof Error ? err.message : "Email ou mot de passe incorrect.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 px-4 py-6 backdrop-blur-[1px]"
      role="presentation"
      onMouseDown={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="connect-dialog-title"
        className="relative w-full max-w-[840px] rounded-[24px] border-2 border-[#2c3550] bg-[#fbf8f1] px-6 py-6 text-[#23304a] shadow-[4px_4px_0px_0px_#2c3550] sm:px-8 sm:py-7"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Fermer"
          className="absolute right-6 top-5 rounded-md p-1 text-[#23304a] transition-colors hover:bg-black/5"
        >
          <X size={30} strokeWidth={2.25} />
        </button>

        <h2
          id="connect-dialog-title"
          className="text-[clamp(2.25rem,3vw,3.45rem)] font-normal leading-none tracking-[-0.04em]"
        >
          Se connecter
        </h2>

        {error && (
          <div className="mt-4 flex items-center gap-3 rounded-xl border-2 border-red-300 bg-red-50 px-4 py-3 text-red-700">
            <AlertCircle size={18} className="shrink-0" />
            <p className="text-sm font-medium">{error}</p>
          </div>
        )}

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <label className="block space-y-2 text-lg">
            <span className="block text-[1.1rem] font-normal">Email</span>
            <input
              id="login-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="h-12 w-full rounded-[12px] border-2 border-[#2c3550] bg-transparent px-4 text-[1rem] outline-none transition-colors focus:border-[#23304a]"
              required
              disabled={isLoading}
              autoComplete="email"
            />
          </label>

          <label className="block space-y-2 text-lg">
            <span className="block text-[1.1rem] font-normal">Password</span>
            <input
              id="login-password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="h-12 w-full rounded-[12px] border-2 border-[#2c3550] bg-transparent px-4 text-[1rem] outline-none transition-colors focus:border-[#23304a]"
              required
              disabled={isLoading}
              autoComplete="current-password"
            />
          </label>

          <button
            id="login-submit"
            type="submit"
            disabled={isLoading}
            className="flex h-14 w-full items-center justify-center gap-2 rounded-[12px] border-2 border-[#2c3550] bg-[#f4e1ad] text-[1.1rem] font-semibold text-[#23304a] shadow-[4px_4px_0px_0px_#2c3550] transition-all hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-none disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {isLoading && <Loader2 size={18} className="animate-spin" />}
            Se connecter
          </button>
        </form>
      </div>
    </div>
  )
}