import { useEffect, useState } from 'react'
import { listConnectedStudents } from '@/api/auth'
import { useAuth } from '@/auth/AuthContext'
import { ApiError } from '@/lib/api'
import type { ConnectedStudent } from '@/types/api'
import { AppShell } from '@/components/AppShell'
import '@/styles/dashboard.css'

export function ProfessorHomePage() {
  const { user } = useAuth()
  const [students, setStudents] = useState<ConnectedStudent[]>([])
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false
    listConnectedStudents()
      .then((rows) => {
        if (!cancelled) setStudents(rows)
      })
      .catch((err: unknown) => {
        if (!cancelled) {
          setError(err instanceof ApiError ? err.message : 'Failed to load roster')
        }
      })
    return () => {
      cancelled = true
    }
  }, [])

  return (
    <AppShell title="Professor">
      <section className="panel">
        <h2>Welcome, {user?.fullName}</h2>
        <p className="muted">
          Your connected students appear below. Next screens will cover classes,
          resources, notes, and homework.
        </p>
      </section>

      <section className="panel">
        <h3>Roster</h3>
        {error ? <p className="form-error">{error}</p> : null}
        {students.length === 0 && !error ? (
          <p className="muted">No students connected yet.</p>
        ) : (
          <ul className="list">
            {students.map((s) => (
              <li key={s.studentId}>
                <strong>{s.fullName}</strong>
                <span>{s.email}</span>
              </li>
            ))}
          </ul>
        )}
      </section>
    </AppShell>
  )
}
