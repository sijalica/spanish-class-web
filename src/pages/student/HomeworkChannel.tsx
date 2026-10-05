import { useEffect, useState, type FormEvent } from 'react'
import { listPendingHomework, submitHomework } from '@/api/client'
import { ApiError } from '@/lib/api'
import type { HomeworkDto } from '@/types/api'

export function HomeworkChannel() {
  const [rows, setRows] = useState<HomeworkDto[]>([])
  const [activeId, setActiveId] = useState<number | null>(null)
  const [content, setContent] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)
  const [ok, setOk] = useState<string | null>(null)

  async function refresh() {
    setRows(await listPendingHomework())
  }

  useEffect(() => {
    listPendingHomework()
      .then(setRows)
      .catch((err: unknown) => {
        setError(err instanceof ApiError ? err.message : 'Failed to load homework')
      })
  }, [])

  async function onSubmit(e: FormEvent) {
    e.preventDefault()
    if (activeId == null) return
    setBusy(true)
    setError(null)
    setOk(null)
    try {
      await submitHomework(activeId, content)
      setContent('')
      setActiveId(null)
      setOk('Submitted')
      await refresh()
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Submit failed')
    } finally {
      setBusy(false)
    }
  }

  return (
    <>
      <div className="dc-panel">
        <h3>Pending homework</h3>
        {error ? <p className="form-error">{error}</p> : null}
        {ok ? <p className="muted">{ok}</p> : null}
        {rows.length === 0 && !error ? (
          <p className="dc-empty">Nothing pending.</p>
        ) : (
          <div className="dc-stack">
            {rows.map((h) => (
              <div className="dc-row" key={h.id}>
                <div>
                  <strong>{h.title}</strong>
                  <span>
                    {h.description ?? 'No description'} · max {h.maxPoints}
                  </span>
                </div>
                <button
                  type="button"
                  className="dc-btn ghost"
                  onClick={() => setActiveId(h.id)}
                >
                  Submit
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {activeId != null ? (
        <div className="dc-panel">
          <h3>Submit homework #{activeId}</h3>
          <form className="dc-form" onSubmit={onSubmit}>
            <label>
              Your answer
              <textarea
                required
                rows={5}
                value={content}
                onChange={(e) => setContent(e.target.value)}
              />
            </label>
            <button type="submit" disabled={busy}>
              {busy ? 'Sending…' : 'Send submission'}
            </button>
          </form>
        </div>
      ) : null}
    </>
  )
}
