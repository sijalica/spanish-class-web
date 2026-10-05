import { useEffect, useState, type FormEvent } from 'react'
import { Link } from 'react-router-dom'
import {
  connectStudentByEmail,
  disconnectStudent,
  listConnectedStudents,
} from '@/api/client'
import { ApiError } from '@/lib/api'
import type { ConnectedStudent } from '@/types/api'

export function RosterChannel() {
  const [students, setStudents] = useState<ConnectedStudent[]>([])
  const [email, setEmail] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)

  async function refresh() {
    const rows = await listConnectedStudents()
    setStudents(rows)
  }

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

  async function onConnect(e: FormEvent) {
    e.preventDefault()
    setBusy(true)
    setError(null)
    try {
      await connectStudentByEmail(email.trim())
      setEmail('')
      await refresh()
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Connect failed')
    } finally {
      setBusy(false)
    }
  }

  async function onDisconnect(studentId: number) {
    setError(null)
    try {
      await disconnectStudent(studentId)
      await refresh()
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Disconnect failed')
    }
  }

  return (
    <>
      <div className="dc-panel">
        <h3>Connect student by email</h3>
        <form className="dc-form" onSubmit={onConnect}>
          <label>
            Student email
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="student@example.com"
            />
          </label>
          {error ? <p className="form-error">{error}</p> : null}
          <button type="submit" disabled={busy}>
            {busy ? 'Connecting…' : 'Connect'}
          </button>
        </form>
      </div>

      <div className="dc-panel">
        <h3>Connected students</h3>
        {students.length === 0 ? (
          <p className="dc-empty">No students yet — connect one above.</p>
        ) : (
          <div className="dc-stack">
            {students.map((s) => (
              <div className="dc-row" key={s.studentId}>
                <div>
                  <strong>{s.fullName}</strong>
                  <span>
                    {s.email}
                    {s.level ? ` · ${s.level}` : ''}
                  </span>
                </div>
                <div style={{ display: 'flex', gap: 8 }}>
                  <Link
                    to={`/professor/roster/${s.studentId}`}
                    className="dc-btn ghost"
                  >
                    Profile
                  </Link>
                  <button
                    type="button"
                    className="dc-btn danger"
                    onClick={() => void onDisconnect(s.studentId)}
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  )
}
