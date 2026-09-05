"use client"

import { useEffect, useState } from "react"
import { QRCodeSVG } from "qrcode.react"
import { api, type MFAStatus } from "@/lib/api"

export default function SecuritySettings() {
  const [status, setStatus] = useState<MFAStatus | null>(null)
  const [totpSetup, setTotpSetup] = useState<{ secret: string; provisioning_uri: string } | null>(null)
  const [totpCode, setTotpCode] = useState("")
  const [emailCodeSent, setEmailCodeSent] = useState(false)
  const [emailCode, setEmailCode] = useState("")
  const [recoveryCodes, setRecoveryCodes] = useState<string[]>([])
  const [currentPassword, setCurrentPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [message, setMessage] = useState("")
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    api.auth.mfaStatus().then(setStatus).catch((error) => setMessage(error instanceof Error ? error.message : "Chargement impossible."))
  }, [])

  async function startTotp() {
    setLoading(true)
    setMessage("")
    try {
      setTotpSetup(await api.auth.setupTotp())
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Configuration impossible.")
    } finally {
      setLoading(false)
    }
  }

  async function confirmTotp(event: React.FormEvent) {
    event.preventDefault()
    setLoading(true)
    setMessage("")
    try {
      const result = await api.auth.confirmTotp(totpCode)
      setRecoveryCodes(result.recovery_codes)
      setTotpSetup(null)
      setTotpCode("")
      setStatus((current) => current ? { ...current, totp_enabled: true } : current)
      setMessage("Authenticator activé. Conserve les codes de récupération.")
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Code incorrect.")
    } finally {
      setLoading(false)
    }
  }

  async function startEmailMfa() {
    setLoading(true)
    setMessage("")
    try {
      await api.auth.setupEmailMfa()
      setEmailCodeSent(true)
      setMessage("Un code a été envoyé à ton adresse email.")
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Envoi impossible.")
    } finally {
      setLoading(false)
    }
  }

  async function confirmEmailMfa(event: React.FormEvent) {
    event.preventDefault()
    setLoading(true)
    setMessage("")
    try {
      await api.auth.confirmEmailMfa(emailCode)
      setEmailCodeSent(false)
      setEmailCode("")
      setStatus((current) => current ? { ...current, email_enabled: true } : current)
      setMessage("Double authentification par email activée.")
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Code incorrect.")
    } finally {
      setLoading(false)
    }
  }

  async function changePassword(event: React.FormEvent) {
    event.preventDefault()
    if (newPassword !== confirmPassword) {
      setMessage("Les deux nouveaux mots de passe ne correspondent pas.")
      return
    }
    setLoading(true)
    setMessage("")
    try {
      await api.auth.changePassword(currentPassword, newPassword)
      setCurrentPassword("")
      setNewPassword("")
      setConfirmPassword("")
      setMessage("Mot de passe modifié.")
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Modification impossible.")
    } finally {
      setLoading(false)
    }
  }

  const field = "neo-field mt-2 w-full bg-[#f8f7f4] px-4 py-3 outline-none focus:border-violet-500"

  return (
    <section className="mt-12">
      <p className="text-sm font-semibold text-violet-700">Sécurité du compte</p>
      <h2 className="mt-1 font-heading text-3xl font-black">Connexion et double authentification</h2>
      <p aria-live="polite" className="mt-4 min-h-6 text-sm font-semibold text-violet-700">{message}</p>

      <div className="mt-4 grid gap-6 lg:grid-cols-2">
        <div className="neo-card space-y-5 p-6">
          <div>
            <h3 className="font-heading text-xl font-bold">Application Authenticator</h3>
            <p className="mt-2 text-sm text-[#596275]">{status?.totp_enabled ? "Activée" : "Non activée"}</p>
          </div>
          {!totpSetup && !status?.totp_enabled && <button disabled={loading} onClick={() => void startTotp()} className="neo-button bg-primary-fixed px-5 py-3 font-bold">Configurer Authenticator</button>}
          {totpSetup && <form onSubmit={confirmTotp} className="space-y-4">
            <div className="w-fit border-2 border-on-surface bg-white p-3"><QRCodeSVG value={totpSetup.provisioning_uri} size={180} /></div>
            <p className="break-all font-mono text-xs">{totpSetup.secret}</p>
            <label className="block font-semibold">Code à 6 chiffres<input value={totpCode} onChange={(event) => setTotpCode(event.target.value)} className={field} inputMode="numeric" autoComplete="one-time-code" required /></label>
            <button disabled={loading} className="neo-button bg-tertiary-fixed px-5 py-3 font-bold">Confirmer</button>
          </form>}
          {recoveryCodes.length > 0 && <div className="border-2 border-on-surface bg-node-green p-4"><p className="font-bold">Codes de récupération — à enregistrer maintenant</p><ul className="mt-3 grid grid-cols-2 gap-2 font-mono text-sm">{recoveryCodes.map((code) => <li key={code}>{code}</li>)}</ul></div>}
        </div>

        <div className="neo-card space-y-5 p-6">
          <div>
            <h3 className="font-heading text-xl font-bold">Code par email</h3>
            <p className="mt-2 text-sm text-[#596275]">{status?.email_enabled ? "Activé" : status?.email_available ? "Disponible, mais non activé" : "SMTP à configurer avant activation"}</p>
          </div>
          {!status?.email_enabled && !emailCodeSent && <button disabled={loading || !status?.email_available} onClick={() => void startEmailMfa()} className="neo-button bg-ts-blue px-5 py-3 font-bold disabled:opacity-50">Envoyer le code d’activation</button>}
          {emailCodeSent && <form onSubmit={confirmEmailMfa} className="space-y-4"><label className="block font-semibold">Code reçu<input value={emailCode} onChange={(event) => setEmailCode(event.target.value)} className={field} inputMode="numeric" autoComplete="one-time-code" required /></label><button disabled={loading} className="neo-button bg-tertiary-fixed px-5 py-3 font-bold">Activer l’email</button></form>}
        </div>
      </div>

      <form onSubmit={changePassword} className="neo-card mt-6 space-y-5 p-6">
        <h3 className="font-heading text-xl font-bold">Modifier le mot de passe</h3>
        <div className="grid gap-5 md:grid-cols-3">
          <label className="font-semibold">Mot de passe actuel<input type="password" value={currentPassword} onChange={(event) => setCurrentPassword(event.target.value)} className={field} autoComplete="current-password" required /></label>
          <label className="font-semibold">Nouveau mot de passe<input type="password" value={newPassword} onChange={(event) => setNewPassword(event.target.value)} className={field} minLength={8} autoComplete="new-password" required /></label>
          <label className="font-semibold">Confirmer<input type="password" value={confirmPassword} onChange={(event) => setConfirmPassword(event.target.value)} className={field} minLength={8} autoComplete="new-password" required /></label>
        </div>
        <button disabled={loading} className="neo-button bg-primary px-5 py-3 font-bold text-white">Modifier le mot de passe</button>
      </form>
    </section>
  )
}
