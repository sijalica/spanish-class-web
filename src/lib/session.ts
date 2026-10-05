import type { AuthResponse } from '@/types/api'

const ACCESS_KEY = 'ev_access_token'
const REFRESH_KEY = 'ev_refresh_token'
const USER_KEY = 'ev_user'

export interface StoredUser {
  userId: number
  email: string
  fullName: string
  role: AuthResponse['role']
}

export function saveSession(auth: AuthResponse): void {
  localStorage.setItem(ACCESS_KEY, auth.accessToken)
  localStorage.setItem(REFRESH_KEY, auth.refreshToken)
  localStorage.setItem(
    USER_KEY,
    JSON.stringify({
      userId: auth.userId,
      email: auth.email,
      fullName: auth.fullName,
      role: auth.role,
    } satisfies StoredUser),
  )
}

export function clearSession(): void {
  localStorage.removeItem(ACCESS_KEY)
  localStorage.removeItem(REFRESH_KEY)
  localStorage.removeItem(USER_KEY)
}

export function getAccessToken(): string | null {
  return localStorage.getItem(ACCESS_KEY)
}

export function getRefreshToken(): string | null {
  return localStorage.getItem(REFRESH_KEY)
}

export function getStoredUser(): StoredUser | null {
  const raw = localStorage.getItem(USER_KEY)
  if (!raw) return null
  try {
    return JSON.parse(raw) as StoredUser
  } catch {
    return null
  }
}

export function updateTokens(accessToken: string, refreshToken: string): void {
  localStorage.setItem(ACCESS_KEY, accessToken)
  localStorage.setItem(REFRESH_KEY, refreshToken)
}
