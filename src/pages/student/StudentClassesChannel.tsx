import { useEffect, useMemo, useState } from 'react'
import { listStudentClasses } from '@/api/client'
import { ApiError } from '@/lib/api'
import type { ClassSession } from '@/types/api'

function monthBounds(year: number, month: number) {
  const from = new Date(year, month, 1, 0, 0, 0)
  const to = new Date(year, month + 1, 0, 23, 59, 59)
  const pad = (n: number) => String(n).padStart(2, '0')
  const fmt = (d: Date) =>
    `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`
  return { from: fmt(from), to: fmt(to) }
}

function dayKey(iso: string) {
  return iso.slice(0, 10)
}

export function StudentClassesChannel() {
  const now = new Date()
  const [year, setYear] = useState(now.getFullYear())
  const [month, setMonth] = useState(now.getMonth())
  const [classes, setClasses] = useState<ClassSession[]>([])
  const [selectedDay, setSelectedDay] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false
    const { from, to } = monthBounds(year, month)
    listStudentClasses(from, to)
      .then((rows) => {
        if (!cancelled) setClasses(rows)
      })
      .catch((err: unknown) => {
        if (!cancelled) {
          setError(err instanceof ApiError ? err.message : 'Failed to load classes')
        }
      })
    return () => {
      cancelled = true
    }
  }, [year, month])

  const byDay = useMemo(() => {
    const map = new Map<string, ClassSession[]>()
    for (const c of classes) {
      const key = dayKey(c.scheduledAt)
      const list = map.get(key) ?? []
      list.push(c)
      map.set(key, list)
    }
    return map
  }, [classes])

  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const startWeekday = new Date(year, month, 1).getDay()
  const monthLabel = new Date(year, month, 1).toLocaleString(undefined, {
    month: 'long',
    year: 'numeric',
  })
  const dayClasses =
    selectedDay != null ? (byDay.get(selectedDay) ?? []) : []

  function shiftMonth(delta: number) {
    const d = new Date(year, month + delta, 1)
    setYear(d.getFullYear())
    setMonth(d.getMonth())
    setSelectedDay(null)
  }

  return (
    <>
      <div className="dc-panel">
        <div className="dc-row">
          <h3 style={{ margin: 0 }}>{monthLabel}</h3>
          <div style={{ display: 'flex', gap: 8 }}>
            <button type="button" className="dc-btn ghost" onClick={() => shiftMonth(-1)}>
              ←
            </button>
            <button type="button" className="dc-btn ghost" onClick={() => shiftMonth(1)}>
              →
            </button>
          </div>
        </div>
        {error ? <p className="form-error">{error}</p> : null}
        <div className="dc-cal">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((d) => (
            <div key={d} className="dc-cal-head">
              {d}
            </div>
          ))}
          {Array.from({ length: startWeekday }).map((_, i) => (
            <div key={`pad-${i}`} className="dc-cal-cell empty" />
          ))}
          {Array.from({ length: daysInMonth }).map((_, i) => {
            const day = i + 1
            const key = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
            const count = byDay.get(key)?.length ?? 0
            return (
              <button
                key={key}
                type="button"
                className={`dc-cal-cell${selectedDay === key ? ' active' : ''}`}
                onClick={() => setSelectedDay(key)}
              >
                <span>{day}</span>
                {count > 0 ? <em>{count}</em> : null}
              </button>
            )
          })}
        </div>
      </div>

      {selectedDay ? (
        <div className="dc-panel">
          <h3>Classes on {selectedDay}</h3>
          {dayClasses.length === 0 ? (
            <p className="dc-empty">No classes this day.</p>
          ) : (
            <div className="dc-stack">
              {dayClasses.map((c) => (
                <div className="dc-row" key={c.id}>
                  <div>
                    <strong>{c.title}</strong>
                    <span>
                      {c.scheduledAt.replace('T', ' ').slice(0, 16)} ·{' '}
                      {c.durationMinutes} min
                      {c.professorFullName ? ` · ${c.professorFullName}` : ''}
                    </span>
                  </div>
                  <span className="dc-chip">{c.status ?? 'SCHEDULED'}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      ) : (
        <div className="dc-panel">
          <h3>This month</h3>
          {classes.length === 0 && !error ? (
            <p className="dc-empty">No enrolled classes this month.</p>
          ) : (
            <div className="dc-stack">
              {classes.map((c) => (
                <div className="dc-row" key={c.id}>
                  <div>
                    <strong>{c.title}</strong>
                    <span>
                      {c.scheduledAt.replace('T', ' ').slice(0, 16)}
                      {c.professorFullName ? ` · ${c.professorFullName}` : ''}
                    </span>
                  </div>
                  <span className="dc-chip">{c.status ?? 'SCHEDULED'}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </>
  )
}
