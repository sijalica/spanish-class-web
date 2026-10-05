import { useEffect, useState } from 'react'
import { listMyProfessors } from '@/api/auth'
import { useAuth } from '@/auth/AuthContext'
import { ApiError } from '@/lib/api'
import type { ConnectedProfessor } from '@/types/api'
import { AppShell } from '@/components/AppShell'
import '@/styles/dashboard.css'

export function StudentHomePage() {
  const { user } = useAuth()
  const [professors, setProfessors] = useState<ConnectedProfessor[]>([])
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false
    listMyProfessors()
      .then((rows) => {
        if (!cancelled) setProfessors(rows)
      })
      .catch((err: unknown) => {
        if (!cancelled) {
          setError(
            err instanceof ApiError ? err.message : 'Failed to load professors',
          )
        }
      })
    return () => {
      cancelled = true
    }
  }, [])

  return (
    <AppShell title="Student">
      <section className="panel">
        <h2>Welcome, {user?.fullName}</h2>
        <p className="muted">
          Professors who connected you show up here. Homework, resources, and
          shared notes come next.
        </p>
      </section>

      <section className="panel">
        <h3>My professors</h3>
        {error ? <p className="form-error">{error}</p> : null}
        {professors.length === 0 && !error ? (
          <p className="muted">No professor connections yet.</p>
        ) : (
          <ul className="list">
            {professors.map((p) => (
              <li key={p.professorId}>
                <strong>{p.fullName}</strong>
                <span>{p.email}</span>
              </li>
            ))}
          </ul>
        )}
      </section>
    </AppShell>
  )
}
