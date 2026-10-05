import type { ReactNode } from 'react'
import { useAuth } from '@/auth/AuthContext'

export function AppShell({
  title,
  children,
}: {
  title: string
  children: ReactNode
}) {
  const { user, logout } = useAuth()
  const appName = import.meta.env.VITE_APP_NAME || 'Español Vivo'

  return (
    <div className="app-shell">
      <header className="topbar">
        <div>
          <p className="brand-mini">{appName}</p>
          <h1>{title}</h1>
        </div>
        <div className="topbar-actions">
          <span className="user-chip">{user?.email}</span>
          <button type="button" className="ghost" onClick={() => void logout()}>
            Sign out
          </button>
        </div>
      </header>
      <main>{children}</main>
    </div>
  )
}
