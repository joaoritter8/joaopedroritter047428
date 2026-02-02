import { api } from '@/shared/api/api-client'

export type AuthRequestDto = {
  username: string
  password: string
}

export type AuthResponseDto = {
  access_token: string
  refresh_token: string
  expires_in: number
  refresh_expires_in: number
}

export async function login(payload: AuthRequestDto) {
  const { data } = await api.post<AuthResponseDto>('/autenticacao/login', payload)
  return data
}

export async function refresh(refreshToken: string) {
  const { data } = await api.put<AuthResponseDto>(
    '/autenticacao/refresh',
    { refresh_token: refreshToken },
    { headers: { Authorization: `Bearer ${refreshToken}` } },
  )
  return data
}
