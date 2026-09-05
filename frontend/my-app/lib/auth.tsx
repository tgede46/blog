"use client"

import React, { createContext, useCallback, useContext, useEffect, useState } from "react"
import { api, UserProfile } from "./api"

type AuthContextType = {
  user: UserProfile | null
  token: string | null
  isLoading: boolean
  login: (email: string, password: string) => Promise<void>
  logout: () => void
  isAuthenticated: boolean
}

const AuthContext = createContext<AuthContextType | null>(null)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(null)
  const [token, setToken] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  // On mount, rehydrate from localStorage
  useEffect(() => {
    const storedToken = localStorage.getItem("blog_access_token")
    const storedUser = localStorage.getItem("blog_user")
    if (storedToken && storedUser) {
      try {
        setToken(storedToken)
        setUser(JSON.parse(storedUser))
      } catch {
        localStorage.removeItem("blog_access_token")
        localStorage.removeItem("blog_user")
      }
    }
    setIsLoading(false)
  }, [])

  const login = useCallback(async (email: string, password: string) => {
    const response = await api.auth.login(email, password)
    localStorage.setItem("blog_access_token", response.access_token)
    localStorage.setItem("blog_user", JSON.stringify(response.user))
    // Also write to cookie so the middleware edge function can read it
    document.cookie = `blog_access_token=${response.access_token}; path=/; SameSite=Strict`
    setToken(response.access_token)
    setUser(response.user)
  }, [])

  const logout = useCallback(() => {
    api.auth.logout()
    localStorage.removeItem("blog_access_token")
    localStorage.removeItem("blog_user")
    // Clear the cookie
    document.cookie = "blog_access_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT"
    setToken(null)
    setUser(null)
  }, [])

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isLoading,
        login,
        logout,
        isAuthenticated: !!token,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) {
    throw new Error("useAuth must be used inside <AuthProvider>")
  }
  return ctx
}
