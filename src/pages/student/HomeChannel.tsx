import { useAuth } from '@/auth/AuthContext'

export function StudentHomeChannel() {
  const { user } = useAuth()
  return (
    <div className="dc-panel">
      <h3>Welcome</h3>
      <p className="muted">
        Hola {user?.fullName}. Use the channels on the left for homework,
        resources, notes, and payments from your professors.
      </p>
    </div>
  )
}
