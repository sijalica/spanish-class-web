import { useState, type FormEvent } from 'react'
import { scheduleClass } from '@/api/client'
import { ApiError } from '@/lib/api'
import type { ClassSession } from '@/types/api'

export function ClassesChannel() {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [scheduledAt, setScheduledAt] = useState('')
  const [durationMinutes, setDurationMinutes] = useState(60)
  const [sectionName, setSectionName] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [created, setCreated] = useState<ClassSession | null>(null)
  const [busy, setBusy] = useState(false)

  async function onSubmit(e: FormEvent) {
    e.preventDefault()
    setBusy(true)
    setError(null)
    setCreated(null)
    try {
      // datetime-local → ISO-ish local without Z; backend expects LocalDateTime
      const iso = scheduledAt.length === 16 ? `${scheduledAt}:00` : scheduledAt
      const session = await scheduleClass({
        title,
        description: description || undefined,
        scheduledAt: iso,
        durationMinutes,
        newResourceSectionName: sectionName.trim() || undefined,
      })
      setCreated(session)
      setTitle('')
      setDescription('')
      setSectionName('')
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Could not schedule class')
    } finally {
      setBusy(false)
    }
  }

  return (
    <>
      <div className="dc-panel">
        <h3>Schedule a class</h3>
        <p className="muted">
          There is no list endpoint yet — newly created classes show below. You
          can attach or create a resources section (e.g. Subjunctive).
        </p>
        <form className="dc-form" onSubmit={onSubmit}>
          <label>
            Title
            <input required value={title} onChange={(e) => setTitle(e.target.value)} />
          </label>
          <label>
            Description
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </label>
          <label>
            When
            <input
              type="datetime-local"
              required
              value={scheduledAt}
              onChange={(e) => setScheduledAt(e.target.value)}
            />
          </label>
          <label>
            Duration (minutes)
            <input
              type="number"
              min={15}
              required
              value={durationMinutes}
              onChange={(e) => setDurationMinutes(Number(e.target.value))}
            />
          </label>
          <label>
            Resource section name (optional)
            <input
              value={sectionName}
              onChange={(e) => setSectionName(e.target.value)}
              placeholder="Subjunctive"
            />
          </label>
          {error ? <p className="form-error">{error}</p> : null}
          <button type="submit" disabled={busy}>
            {busy ? 'Scheduling…' : 'Schedule'}
          </button>
        </form>
      </div>

      {created ? (
        <div className="dc-panel">
          <h3>Created</h3>
          <div className="dc-row">
            <div>
              <strong>
                #{created.id} {created.title}
              </strong>
              <span>
                {created.scheduledAt} · {created.durationMinutes} min
                {created.resourceSection
                  ? ` · resources: ${created.resourceSection.name}`
                  : ''}
              </span>
            </div>
            <span className="dc-chip">{created.status ?? 'SCHEDULED'}</span>
          </div>
        </div>
      ) : null}
    </>
  )
}
