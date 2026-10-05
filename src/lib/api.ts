import type { AuthResponse } from '@/types/api'
import {
  clearSession,
  getAccessToken,
  getRefreshToken,
  updateTokens,
} from '@/lib/session'

const baseUrl = (import.meta.env.VITE_API_BASE_URL ?? '').replace(/\/$/, '')

export class ApiError extends Error {
  status: number
  body: unknown

  constructor(status: number, message: string, body?: unknown) {
    super(message)
    this.status = status
    this.body = body
  }
}

function newRequestId(): string {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
    return crypto.randomUUID()
  }
  return `req-${Date.now()}`
}

async function parseBody(res: Response): Promise<unknown> {
  const text = await res.text()
  if (!text) return null
  try {
    return JSON.parse(text)
  } catch {
    return text
  }
}

async function refreshAccessToken(): Promise<string | null> {
  const refreshToken = getRefreshToken()
  if (!refreshToken) return null

  const res = await fetch(`${baseUrl}/api/auth/refresh`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Request-Id': newRequestId(),
    },
    body: JSON.stringify({ refreshToken }),
  })

  if (!res.ok) {
    clearSession()
    return null
  }

  const data = (await res.json()) as AuthResponse
  updateTokens(data.accessToken, data.refreshToken)
  return data.accessToken
}

export async function apiFetch<T>(
  path: string,
  options: RequestInit = {},
  retry = true,
): Promise<T> {
  const headers = new Headers(options.headers)
  if (!headers.has('Content-Type') && options.body) {
    headers.set('Content-Type', 'application/json')
  }
  headers.set('X-Request-Id', headers.get('X-Request-Id') ?? newRequestId())

  const token = getAccessToken()
  if (token) {
    headers.set('Authorization', `Bearer ${token}`)
  }

  const res = await fetch(`${baseUrl}${path}`, { ...options, headers })

  if (res.status === 401 && retry && !path.startsWith('/api/auth/')) {
    const next = await refreshAccessToken()
    if (next) {
      return apiFetch<T>(path, options, false)
    }
  }

  if (!res.ok) {
    const body = await parseBody(res)
    const message =
      typeof body === 'object' &&
      body !== null &&
      'message' in body &&
      typeof (body as { message: unknown }).message === 'string'
        ? (body as { message: string }).message
        : `Request failed (${res.status})`
    throw new ApiError(res.status, message, body)
  }

  if (res.status === 204) {
    return undefined as T
  }

  return (await parseBody(res)) as T
}
