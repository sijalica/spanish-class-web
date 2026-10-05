import { useEffect, useState, type FormEvent } from 'react'
import {
  addStudentNote,
  listConnectedStudents,
  listStudentNotes,
} from '@/api/client'
import { ApiError } from '@/lib/api'
import type { ConnectedStudent, NoteDto } from '@/types/api'

export function NotesChannel() {
  const [students, setStudents] = useState<ConnectedStudent[]>([])
  const [studentId, setStudentId] = useState<number | ''>('')
  const [notes, setNotes] = useState<NoteDto[]>([])
  const [content, setContent] = useState('')
  const [visibility, setVisibility] = useState<'PRIVATE' | 'SHARED_WITH_STUDENT'>(
    'SHARED_WITH_STUDENT',
  )
  const [kind, setKind] = useState('GENERAL')
  const [error, setError] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)

  useEffect(() => {
    listConnectedStudents()
      .then((rows) => {
        setStudents(rows)
        if (rows[0]) setStudentId(rows[0].studentId)
      })
      .catch((err: unknown) => {
        setError(err instanceof ApiError ? err.message : 'Failed to load students')
      })
  }, [])

  useEffect(() => {
    if (studentId === '') {
      setNotes([])
      return
    }
    let cancelled = false
    listStudentNotes(studentId)
      .then((rows) => {
        if (!cancelled) setNotes(rows)
      })
      .catch((err: unknown) => {
        if (!cancelled) {
          setError(err instanceof ApiError ? err.message : 'Failed to load notes')
        }
      })
    return () => {
      cancelled = true
    }
  }, [studentId])

  async function onAdd(e: FormEvent) {
    e.preventDefault()
    if (studentId === '') return
    setBusy(true)
    setError(null)
    try {
      await addStudentNote(studentId, { content, kind, visibility })
      setContent('')
      setNotes(await listStudentNotes(studentId))
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Could not add note')
    } finally {
      setBusy(false)
    }
  }

  return (
    <>
      <div className="dc-panel">
        <h3>Student</h3>
        <div className="dc-form">
          <label>
            Channel target
            <select
              value={studentId}
              onChange={(e) =>
                setStudentId(e.target.value ? Number(e.target.value) : '')
              }
            >
              {students.length === 0 ? (
                <option value="">No connected students</option>
              ) : null}
              {students.map((s) => (
                <option key={s.studentId} value={s.studentId}>
                  {s.fullName} ({s.email})
                </option>
              ))}
            </select>
          </label>
        </div>
      </div>

      <div className="dc-panel">
        <h3>Timeline</h3>
        {notes.length === 0 ? (
          <p className="dc-empty">No notes for this student yet.</p>
        ) : (
          notes.map((n) => (
            <article key={n.id} className="dc-message">
              <header>
                <strong>{n.professorFullName ?? 'You'}</strong>
                <em>{n.kind}</em>
                <span className="dc-chip">{n.visibility}</span>
                <time>{n.createdAt?.replace('T', ' ').slice(0, 16)}</time>
              </header>
              <p>{n.content}</p>
            </article>
          ))
        )}
      </div>

      <div className="dc-panel">
        <h3>Add note</h3>
        <form className="dc-form" onSubmit={onAdd}>
          <label>
            Kind
            <select value={kind} onChange={(e) => setKind(e.target.value)}>
              <option value="GENERAL">GENERAL</option>
              <option value="OBSERVATION">OBSERVATION</option>
              <option value="GOAL">GOAL</option>
              <option value="HOMEWORK_FEEDBACK">HOMEWORK_FEEDBACK</option>
            </select>
          </label>
          <label>
            Visibility
            <select
              value={visibility}
              onChange={(e) =>
                setVisibility(e.target.value as 'PRIVATE' | 'SHARED_WITH_STUDENT')
              }
            >
              <option value="SHARED_WITH_STUDENT">SHARED_WITH_STUDENT</option>
              <option value="PRIVATE">PRIVATE</option>
            </select>
          </label>
          <label>
            Content
            <textarea
              required
              rows={4}
              value={content}
              onChange={(e) => setContent(e.target.value)}
            />
          </label>
          {error ? <p className="form-error">{error}</p> : null}
          <button type="submit" disabled={busy || studentId === ''}>
            {busy ? 'Saving…' : 'Post note'}
          </button>
        </form>
      </div>
    </>
  )
}
