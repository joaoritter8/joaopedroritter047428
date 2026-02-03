import * as React from 'react';
import { login as loginApi, refresh as refreshApi } from './api/auth-api';
import { clearTokens, loadTokens, saveTokens, type AuthTokens } from './storage';
import { setAuthHooks } from '@/shared/api/api-client';

type AuthUser = { username: string }

type AuthContextValue = {
  tokens: AuthTokens | null
  user: AuthUser | null
  login: (username: string, password: string) => Promise<void>
  logout: () => void
  ensureFreshToken: () => Promise<string | null>
}

const AuthContext = React.createContext<AuthContextValue | undefined>(undefined)

function now() {
  return Date.now()
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [tokens, setTokens] = React.useState<AuthTokens | null>(() => {
    if (typeof window === 'undefined') return null
    return loadTokens()
  })

  const user = React.useMemo<AuthUser | null>(() => {
   
    const username = tokens ? (localStorage.getItem('pet_manager_user') ?? '') : ''
    return username ? { username } : null
  }, [tokens])

  const logout = React.useCallback(() => {
    setTokens(null)
    clearTokens()
    localStorage.removeItem('pet_manager_user')
  }, [])

  const persist = React.useCallback((next: AuthTokens, username?: string) => {
    setTokens(next)
    saveTokens(next)
    if (username) localStorage.setItem('pet_manager_user', username)
  }, [])

  const ensureFreshToken = React.useCallback(async () => {
    if (!tokens) return null

    
    if (tokens.refreshExpiresAt <= now()) {
      logout()
      return null
    }

    
    const SKEW_MS = 20_000
    if (tokens.accessExpiresAt - SKEW_MS > now()) return tokens.accessToken

  
    const res = await refreshApi(tokens.refreshToken)
    const next: AuthTokens = {
      accessToken: res.access_token,
      refreshToken: res.refresh_token,
      accessExpiresAt: now() + res.expires_in * 1000,
      refreshExpiresAt: now() + res.refresh_expires_in * 1000,
    }
    persist(next)
    return next.accessToken
  }, [logout, persist, tokens])

  const doLogin = React.useCallback(
    async (username: string, password: string) => {
      const res = await loginApi({ username, password })
      const next: AuthTokens = {
        accessToken: res.access_token,
        refreshToken: res.refresh_token,
        accessExpiresAt: now() + res.expires_in * 1000,
        refreshExpiresAt: now() + res.refresh_expires_in * 1000,
      }
      persist(next, username)
    },
    [persist],
  )

  React.useEffect(() => {
    setAuthHooks({
      getAccessToken: () => tokens?.accessToken ?? null,
      refreshAccessToken: ensureFreshToken,
      logout,
    })
  }, [ensureFreshToken, logout, tokens])

  const value = React.useMemo<AuthContextValue>(
    () => ({ tokens, user, login: doLogin, logout, ensureFreshToken }),
    [doLogin, ensureFreshToken, logout, tokens, user],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = React.useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
