"use client"

import { AlertCircle, KeyRound, Loader2, Mail, ShieldCheck, X } from "lucide-react"
import React, { useRef, useState } from "react"
import { createPortal } from "react-dom"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth"
import { api, type MFAMethod } from "@/lib/api"
import { safeInternalPath } from "@/lib/navigation"

type ConnectDialogProps = {
  open: boolean
  onClose: () => void
  redirectTo?: string
}

export default function ConnectDialog({ open, onClose, redirectTo }: ConnectDialogProps) {
  const router = useRouter()
  const { login, verifyMfa } = useAuth()
  const dialogRef = useRef<HTMLDivElement>(null)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [challengeToken, setChallengeToken] = useState("")
  const [methods, setMethods] = useState<MFAMethod[]>([])
  const [method, setMethod] = useState<MFAMethod>("totp")
  const [code, setCode] = useState("")

  const closeDialog = React.useCallback(() => {
    setChallengeToken("")
    setMethods([])
    setCode("")
    setError(null)
    onClose()
  }, [onClose])

  React.useEffect(() => {
    if (!open) {
      return
    }

    const previousFocus = document.activeElement instanceof HTMLElement ? document.activeElement : null
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = "hidden"
    requestAnimationFrame(() => {
      dialogRef.current?.querySelector<HTMLElement>("input, button")?.focus()
    })

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        closeDialog()
        return
      }
      if (event.key === "Tab") {
        const focusable = Array.from(
          dialogRef.current?.querySelectorAll<HTMLElement>(
            'button:not([disabled]), input:not([disabled]), [href], [tabindex]:not([tabindex="-1"])',
          ) || [],
        )
        if (!focusable.length) return
        const first = focusable[0]
        const last = focusable[focusable.length - 1]
        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault()
          last.focus()
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault()
          first.focus()
        }
      }
    }

    window.addEventListener("keydown", onKeyDown)

    return () => {
      window.removeEventListener("keydown", onKeyDown)
      document.body.style.overflow = previousOverflow
      previousFocus?.focus()
    }
  }, [closeDialog, open])

  if (!open || typeof document === "undefined") {
    return null
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setIsLoading(true)
    try {
      const result = await login(email, password)
      if (result.mfa_required && result.challenge_token) {
        const availableMethods = result.methods || []
        const preferredMethod = availableMethods.includes("totp") ? "totp" : availableMethods[0] || "recovery"
        setChallengeToken(result.challenge_token)
        setMethods(availableMethods)
        setMethod(preferredMethod)
        if (preferredMethod === "email") await api.auth.sendEmailCode(result.challenge_token)
      } else {
        closeDialog()
        router.push(safeInternalPath(redirectTo))
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Email ou mot de passe incorrect.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleMfaSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    setError(null)
    setIsLoading(true)
    try {
      await verifyMfa(challengeToken, method, code.trim())
      closeDialog()
      router.push(safeInternalPath(redirectTo))
    } catch (err) {
      setError(err instanceof Error ? err.message : "Code incorrect ou expiré.")
    } finally {
      setIsLoading(false)
    }
  }

  const chooseMethod = async (nextMethod: MFAMethod) => {
    setMethod(nextMethod)
    setCode("")
    setError(null)
    if (nextMethod === "email") {
      setIsLoading(true)
      try {
        await api.auth.sendEmailCode(challengeToken)
      } catch (err) {
        setError(err instanceof Error ? err.message : "Impossible d’envoyer le code.")
      } finally {
        setIsLoading(false)
      }
    }
  }

  return createPortal(
    <div
      className="fixed inset-0 z-[100] flex items-start justify-center overflow-y-auto bg-black/50 px-4 py-10 sm:items-center"
      role="presentation"
      onMouseDown={closeDialog}
    >
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="connect-dialog-title"
        className="relative max-h-[calc(100vh-5rem)] w-full max-w-2xl overflow-y-auto border-2 border-[#2c3550] bg-[#fbf8f1] px-6 py-6 text-[#23304a] shadow-[8px_8px_0px_0px_#2c3550] sm:px-8 sm:py-7"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <button
          type="button"
          onClick={closeDialog}
          aria-label="Fermer"
          className="absolute right-6 top-5 rounded-md p-1 text-[#23304a] transition-colors hover:bg-black/5"
        >
          <X size={30} strokeWidth={2.25} />
        </button>

        <h2
          id="connect-dialog-title"
          className="text-[clamp(2.25rem,3vw,3.45rem)] font-normal leading-none tracking-[-0.04em]"
        >
          {challengeToken ? "Double authentification" : "Se connecter"}
        </h2>

        {error && (
          <div className="mt-4 flex items-center gap-3 rounded-xl border-2 border-red-300 bg-red-50 px-4 py-3 text-red-700" role="alert">
            <AlertCircle size={18} className="shrink-0" />
            <p className="text-sm font-medium">{error}</p>
          </div>
        )}

        {!challengeToken ? <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <label className="block space-y-2 text-lg">
            <span className="block text-[1.1rem] font-normal">Email</span>
            <input
              id="login-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="h-12 w-full border-2 border-[#2c3550] bg-transparent px-4 text-[1rem] outline-none transition-colors focus:bg-white"
              required
              disabled={isLoading}
              autoComplete="email"
            />
          </label>

          <label className="block space-y-2 text-lg">
            <span className="block text-[1.1rem] font-normal">Mot de passe</span>
            <input
              id="login-password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="h-12 w-full border-2 border-[#2c3550] bg-transparent px-4 text-[1rem] outline-none transition-colors focus:bg-white"
              required
              disabled={isLoading}
              autoComplete="current-password"
            />
          </label>

          <button
            id="login-submit"
            type="submit"
            disabled={isLoading}
            className="flex h-14 w-full items-center justify-center gap-2 border-2 border-[#2c3550] bg-[#f4e1ad] text-[1.1rem] font-bold text-[#23304a] shadow-[4px_4px_0px_0px_#2c3550] transition-all hover:translate-x-1 hover:translate-y-1 hover:shadow-none disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isLoading && <Loader2 size={18} className="animate-spin" />}
            Se connecter
          </button>
        </form> : <form className="mt-8 space-y-6" onSubmit={handleMfaSubmit}>
          <div className="flex flex-wrap gap-3">
            {methods.includes("totp") && <button type="button" onClick={() => void chooseMethod("totp")} className={`neo-button flex items-center gap-2 px-4 py-2 font-bold ${method === "totp" ? "bg-primary-fixed" : "bg-white"}`}><ShieldCheck size={18} />Authenticator</button>}
            {methods.includes("email") && <button type="button" onClick={() => void chooseMethod("email")} className={`neo-button flex items-center gap-2 px-4 py-2 font-bold ${method === "email" ? "bg-tertiary-fixed" : "bg-white"}`}><Mail size={18} />Email</button>}
            {methods.includes("recovery") && <button type="button" onClick={() => void chooseMethod("recovery")} className={`neo-button flex items-center gap-2 px-4 py-2 font-bold ${method === "recovery" ? "bg-node-green" : "bg-white"}`}><KeyRound size={18} />Récupération</button>}
          </div>
          <p className="text-sm leading-6 text-[#596275]">
            {method === "totp" ? "Saisis le code à 6 chiffres de ton application Authenticator." : method === "email" ? `Un code a été envoyé à ${email}.` : "Saisis l’un de tes codes de récupération."}
          </p>
          <label className="block space-y-2 text-lg">
            <span className="block text-[1.1rem] font-normal">Code de sécurité</span>
            <input value={code} onChange={(event) => setCode(event.target.value)} inputMode={method === "recovery" ? "text" : "numeric"} autoComplete="one-time-code" className="h-12 w-full border-2 border-[#2c3550] bg-transparent px-4 text-center font-mono text-xl tracking-[.25em] outline-none focus:bg-white" required disabled={isLoading} />
          </label>
          <button type="submit" disabled={isLoading} className="flex h-14 w-full items-center justify-center gap-2 border-2 border-[#2c3550] bg-[#f4e1ad] text-[1.1rem] font-bold shadow-[4px_4px_0px_0px_#2c3550] transition-all hover:translate-x-1 hover:translate-y-1 hover:shadow-none disabled:opacity-60">
            {isLoading && <Loader2 size={18} className="animate-spin" />}
            Vérifier et se connecter
          </button>
        </form>}
      </div>
    </div>,
    document.body,
  )
}