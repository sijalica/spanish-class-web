import { useAuth } from '@/auth/AuthContext'

export function ProfessorHomeChannel() {
  const { user } = useAuth()
  return (
    <div className="dc-panel">
      <h3>Welcome back</h3>
      <p className="muted">
        Hola {user?.fullName}. Pick a channel on the left — like Discord —
        to manage roster, classes, resources, notes, and payments.
      </p>
    </div>
  )
}
