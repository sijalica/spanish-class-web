import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import * as authApi from '@/api/client'
import {
  clearSession,
  getRefreshToken,
  getStoredUser,
  saveSession,
  type StoredUser,
} from '@/lib/session'
import type { LoginRequest, RegisterRequest } from '@/types/api'

interface AuthContextValue {
  user: StoredUser | null
  isAuthenticated: boolean
  login: (body: LoginRequest) => Promise<StoredUser>
  register: (body: RegisterRequest) => Promise<StoredUser>
  logout: () => Promise<void>
}

const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<StoredUser | null>(() => getStoredUser())

  const login = useCallback(async (body: LoginRequest) => {
    const auth = await authApi.login(body)
    saveSession(auth)
    const next: StoredUser = {
      userId: auth.userId,
      email: auth.email,
      fullName: auth.fullName,
      role: auth.role,
    }
    setUser(next)
    return next
  }, [])

  const register = useCallback(async (body: RegisterRequest) => {
    const auth = await authApi.register(body)
    saveSession(auth)
    const next: StoredUser = {
      userId: auth.userId,
      email: auth.email,
      fullName: auth.fullName,
      role: auth.role,
    }
    setUser(next)
    return next
  }, [])

  const logout = useCallback(async () => {
    const refreshToken = getRefreshToken()
    try {
      if (refreshToken) {
        await authApi.logout(refreshToken)
      }
    } catch {
      // still clear local session
    } finally {
      clearSession()
      setUser(null)
    }
  }, [])

  const value = useMemo(
    () => ({
      user,
      isAuthenticated: Boolean(user),
      login,
      register,
      logout,
    }),
    [user, login, register, logout],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return ctx
}
