import { useEffect, useState, type FormEvent } from 'react'
import {
  createHomework,
  gradeSubmission,
  listHomeworkForClass,
  listHomeworkSubmissions,
  listProfessorClasses,
} from '@/api/client'
import { ApiError } from '@/lib/api'
import type {
  ClassSession,
  HomeworkDto,
  HomeworkSubmissionDto,
} from '@/types/api'

export function ProfessorHomeworkChannel() {
  const [classes, setClasses] = useState<ClassSession[]>([])
  const [classId, setClassId] = useState<number | ''>('')
  const [homework, setHomework] = useState<HomeworkDto[]>([])
  const [selectedHw, setSelectedHw] = useState<number | null>(null)
  const [submissions, setSubmissions] = useState<HomeworkSubmissionDto[]>([])
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [dueDate, setDueDate] = useState('')
  const [maxPoints, setMaxPoints] = useState(10)
  const [gradeDrafts, setGradeDrafts] = useState<
    Record<number, { grade: string; feedback: string }>
  >({})
  const [error, setError] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)
  const [ok, setOk] = useState<string | null>(null)

  useEffect(() => {
    listProfessorClasses()
      .then((rows) => {
        const sorted = [...rows].sort((a, b) =>
          (b.scheduledAt ?? '').localeCompare(a.scheduledAt ?? ''),
        )
        setClasses(sorted)
        if (sorted[0]) setClassId(sorted[0].id)
      })
      .catch((err: unknown) => {
        setError(err instanceof ApiError ? err.message : 'Failed to load classes')
      })
  }, [])

  async function refreshHomework(id: number) {
    setHomework(await listHomeworkForClass(id))
  }

  useEffect(() => {
    if (classId === '') {
      setHomework([])
      setSelectedHw(null)
      setSubmissions([])
      return
    }
    let cancelled = false
    listHomeworkForClass(classId)
      .then((rows) => {
        if (!cancelled) {
          setHomework(rows)
          setSelectedHw(null)
          setSubmissions([])
        }
      })
      .catch((err: unknown) => {
        if (!cancelled) {
          setError(err instanceof ApiError ? err.message : 'Failed to load homework')
        }
      })
    return () => {
      cancelled = true
    }
  }, [classId])

  async function openSubmissions(homeworkId: number) {
    setSelectedHw(homeworkId)
    setError(null)
    try {
      const rows = await listHomeworkSubmissions(homeworkId)
      setSubmissions(rows)
      const drafts: Record<number, { grade: string; feedback: string }> = {}
      for (const s of rows) {
        drafts[s.id] = {
          grade: s.grade != null ? String(s.grade) : '',
          feedback: s.professorFeedback ?? '',
        }
      }
      setGradeDrafts(drafts)
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Failed to load submissions')
    }
  }

  async function onCreate(e: FormEvent) {
    e.preventDefault()
    if (classId === '') return
    setBusy(true)
    setError(null)
    setOk(null)
    try {
      const iso = dueDate.length === 16 ? `${dueDate}:00` : dueDate
      await createHomework(classId, {
        title,
        description: description || undefined,
        dueDate: iso,
        maxPoints,
      })
      setTitle('')
      setDescription('')
      setOk('Homework created')
      await refreshHomework(classId)
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Could not create homework')
    } finally {
      setBusy(false)
    }
  }

  async function onGrade(submissionId: number) {
    const draft = gradeDrafts[submissionId]
    if (!draft || draft.grade === '') {
      setError('Enter a grade')
      return
    }
    setBusy(true)
    setError(null)
    setOk(null)
    try {
      await gradeSubmission(submissionId, {
        grade: Number(draft.grade),
        feedback: draft.feedback || undefined,
      })
      setOk('Graded')
      if (selectedHw != null) {
        await openSubmissions(selectedHw)
      }
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Could not grade')
    } finally {
      setBusy(false)
    }
  }

  const selected = homework.find((h) => h.id === selectedHw)

  return (
    <>
      <div className="dc-panel">
        <h3>Class</h3>
        <div className="dc-form">
          <label>
            Assign / review for
            <select
              value={classId}
              onChange={(e) =>
                setClassId(e.target.value ? Number(e.target.value) : '')
              }
            >
              {classes.length === 0 ? (
                <option value="">No classes yet</option>
              ) : null}
              {classes.map((c) => (
                <option key={c.id} value={c.id}>
                  #{c.id} {c.title} · {c.scheduledAt?.replace('T', ' ').slice(0, 16)}
                </option>
              ))}
            </select>
          </label>
        </div>
      </div>

      <div className="dc-panel">
        <h3>Create homework</h3>
        <form className="dc-form" onSubmit={onCreate}>
          <label>
            Title
            <input
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
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
            Due
            <input
              type="datetime-local"
              required
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
            />
          </label>
          <label>
            Max points
            <input
              type="number"
              min={1}
              required
              value={maxPoints}
              onChange={(e) => setMaxPoints(Number(e.target.value))}
            />
          </label>
          {error ? <p className="form-error">{error}</p> : null}
          {ok ? <p className="muted">{ok}</p> : null}
          <button type="submit" disabled={busy || classId === ''}>
            {busy ? 'Saving…' : 'Create'}
          </button>
        </form>
      </div>

      <div className="dc-panel">
        <h3>Homework for this class</h3>
        {homework.length === 0 ? (
          <p className="dc-empty">No homework yet.</p>
        ) : (
          <div className="dc-stack">
            {homework.map((h) => (
              <div className="dc-row" key={h.id}>
                <div>
                  <strong>{h.title}</strong>
                  <span>
                    max {h.maxPoints}
                    {h.dueDate
                      ? ` · due ${h.dueDate.replace('T', ' ').slice(0, 16)}`
                      : ''}
                  </span>
                </div>
                <button
                  type="button"
                  className="dc-btn ghost"
                  onClick={() => void openSubmissions(h.id)}
                >
                  Submissions
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {selectedHw != null ? (
        <div className="dc-panel">
          <h3>
            Submissions
            {selected ? ` · ${selected.title}` : ''}
          </h3>
          {submissions.length === 0 ? (
            <p className="dc-empty">No submissions yet.</p>
          ) : (
            <div className="dc-stack">
              {submissions.map((s) => (
                <article key={s.id} className="dc-message">
                  <header>
                    <strong>{s.studentFullName}</strong>
                    <em>{s.status}</em>
                    <time>
                      {s.submittedAt?.replace('T', ' ').slice(0, 16) ?? ''}
                    </time>
                  </header>
                  <p>{s.content || '(no text)'}</p>
                  {s.hasAttachment ? (
                    <p className="muted">
                      Attachment: {s.attachmentOriginalFilename ?? 'file'}
                    </p>
                  ) : null}
                  <div className="dc-form" style={{ marginTop: 10, maxWidth: '100%' }}>
                    <label>
                      Grade
                      <input
                        type="number"
                        min={0}
                        value={gradeDrafts[s.id]?.grade ?? ''}
                        onChange={(e) =>
                          setGradeDrafts((prev) => ({
                            ...prev,
                            [s.id]: {
                              grade: e.target.value,
                              feedback: prev[s.id]?.feedback ?? '',
                            },
                          }))
                        }
                      />
                    </label>
                    <label>
                      Feedback
                      <textarea
                        rows={2}
                        value={gradeDrafts[s.id]?.feedback ?? ''}
                        onChange={(e) =>
                          setGradeDrafts((prev) => ({
                            ...prev,
                            [s.id]: {
                              grade: prev[s.id]?.grade ?? '',
                              feedback: e.target.value,
                            },
                          }))
                        }
                      />
                    </label>
                    <button
                      type="button"
                      disabled={busy}
                      onClick={() => void onGrade(s.id)}
                    >
                      {s.status === 'GRADED' ? 'Update grade' : 'Grade'}
                    </button>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      ) : null}
    </>
  )
}
