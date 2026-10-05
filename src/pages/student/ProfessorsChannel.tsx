import { useEffect, useState } from 'react'
import { listMyProfessors } from '@/api/client'
import { ApiError } from '@/lib/api'
import type { ConnectedProfessor } from '@/types/api'

export function ProfessorsChannel() {
  const [rows, setRows] = useState<ConnectedProfessor[]>([])
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    listMyProfessors()
      .then(setRows)
      .catch((err: unknown) => {
        setError(err instanceof ApiError ? err.message : 'Failed to load')
      })
  }, [])

  return (
    <div className="dc-panel">
      <h3>Connected professors</h3>
      {error ? <p className="form-error">{error}</p> : null}
      {rows.length === 0 && !error ? (
        <p className="dc-empty">No professors connected yet.</p>
      ) : (
        <div className="dc-stack">
          {rows.map((p) => (
            <div className="dc-row" key={p.professorId}>
              <div>
                <strong>{p.fullName}</strong>
                <span>
                  {p.email}
                  {p.specialization ? ` · ${p.specialization}` : ''}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
