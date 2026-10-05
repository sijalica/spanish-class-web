import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useAuth } from '@/auth/AuthContext'
import type { Role } from '@/types/api'

export function RequireAuth({ role }: { role?: Role }) {
  const { user, isAuthenticated } = useAuth()
  const location = useLocation()

  if (!isAuthenticated || !user) {
    return <Navigate to="/login" replace state={{ from: location }} />
  }

  if (role && user.role !== role) {
    return (
      <Navigate
        to={user.role === 'PROFESSOR' ? '/professor' : '/student'}
        replace
      />
    )
  }

  return <Outlet />
}
