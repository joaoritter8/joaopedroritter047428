export type AuthTokens = {
  accessToken: string
  refreshToken: string
  accessExpiresAt: number // epoch ms
  refreshExpiresAt: number // epoch ms
}

const KEY = 'pet_manager_tokens_v1'

export function loadTokens(): AuthTokens | null {
  try {
    const raw = localStorage.getItem(KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw) as AuthTokens
    if (!parsed.accessToken || !parsed.refreshToken) return null
    return parsed
  } catch {
    return null
  }
}

export function saveTokens(tokens: AuthTokens) {
  localStorage.setItem(KEY, JSON.stringify(tokens))
}

export function clearTokens() {
  localStorage.removeItem(KEY)
}
