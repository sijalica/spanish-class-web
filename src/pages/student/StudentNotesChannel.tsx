import { useEffect, useState } from 'react'
import { listSharedNotes } from '@/api/client'
import { ApiError } from '@/lib/api'
import type { NoteDto } from '@/types/api'

export function StudentNotesChannel() {
  const [notes, setNotes] = useState<NoteDto[]>([])
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    listSharedNotes()
      .then(setNotes)
      .catch((err: unknown) => {
        setError(err instanceof ApiError ? err.message : 'Failed to load notes')
      })
  }, [])

  return (
    <div className="dc-panel">
      <h3>Shared with you</h3>
      {error ? <p className="form-error">{error}</p> : null}
      {notes.length === 0 && !error ? (
        <p className="dc-empty">No shared notes yet.</p>
      ) : (
        notes.map((n) => (
          <article key={n.id} className="dc-message">
            <header>
              <strong>{n.professorFullName ?? 'Professor'}</strong>
              <em>{n.kind}</em>
              <time>{n.createdAt?.replace('T', ' ').slice(0, 16)}</time>
            </header>
            <p>{n.content}</p>
          </article>
        ))
      )}
    </div>
  )
}
