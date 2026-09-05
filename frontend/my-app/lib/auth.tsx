"use client"

import React, { createContext, useCallback, useContext, useEffect, useState } from "react"
import { api, type UserProfile } from "./api"

type AuthContextType = {
  user: UserProfile | null
  isLoading: boolean
  login: (email: string, password: string) => Promise<void>
  logout: () => Promise<void>
  isAuthenticated: boolean
}

const AuthContext = createContext<AuthContextType | null>(null)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    let active = true
    api.auth.me().then((profile) => { if (active) setUser(profile) }).catch(() => { if (active) setUser(null) }).finally(() => { if (active) setIsLoading(false) })
    return () => { active = false }
  }, [])

  const login = useCallback(async (email: string, password: string) => {
    const response = await api.auth.login(email, password)
    const profile = "user" in response ? response.user : response
    setUser(profile?.email ? profile : await api.auth.me())
  }, [])

  const logout = useCallback(async () => {
    try { await api.auth.logout() } finally { setUser(null) }
  }, [])

  return <AuthContext.Provider value={{ user, isLoading, login, logout, isAuthenticated: Boolean(user) }}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) throw new Error("useAuth doit être utilisé dans AuthProvider")
  return context
}
