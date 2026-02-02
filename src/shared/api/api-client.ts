import axios, { AxiosError, type InternalAxiosRequestConfig } from 'axios'
import { env } from '../config/env'

declare module 'axios' {
  export interface AxiosRequestConfig {
    skipAuth?: boolean
  }
}

export const api = axios.create({
  baseURL: env.apiBaseUrl,
})


type AuthHooks = {
  getAccessToken: () => string | null
  refreshAccessToken: () => Promise<string | null> // returns new access token
  logout: () => void
}

let authHooks: AuthHooks | null = null
export function setAuthHooks(hooks: AuthHooks) {
  authHooks = hooks
}

api.interceptors.request.use(async (config: InternalAxiosRequestConfig) => {
  if (!config.skipAuth) {
    const token = authHooks?.getAccessToken()
    if (token) {
      config.headers = config.headers ?? {}
      const headers = config.headers
      const axiosHeaders = headers as { get?: (name: string) => string | null; set?: (name: string, value: string) => void }
      if (axiosHeaders.set && axiosHeaders.get) {
        if (!axiosHeaders.get('Authorization')) axiosHeaders.set('Authorization', `Bearer ${token}`)
      } else {
        const plain = headers as Record<string, string>
        if (!plain.Authorization && !plain.authorization) {
          plain.Authorization = `Bearer ${token}`
        }
      }
    }
  }
  return config
})

let refreshPromise: Promise<string | null> | null = null

api.interceptors.response.use(
  (res) => res,
  async (error: AxiosError) => {
    const status = error.response?.status
    const original = error.config

    if (status === 401 && original && !original.headers?.['x-retried'] && !original.skipAuth) {
      try {
        original.headers = original.headers ?? {}
        original.headers['x-retried'] = '1'

        refreshPromise = refreshPromise ?? authHooks?.refreshAccessToken() ?? Promise.resolve(null)
        const newToken = await refreshPromise
        refreshPromise = null

        if (newToken) {
          original.headers.Authorization = `Bearer ${newToken}`
          return api.request(original)
        }
        authHooks?.logout()
        if (typeof window !== 'undefined') window.location.replace('/login')
      } catch {
        refreshPromise = null
        authHooks?.logout()
        if (typeof window !== 'undefined') window.location.replace('/login')
      }
    }

    return Promise.reject(error)
  },
)
