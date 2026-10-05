import { useEffect, useState } from 'react'
import { getStudentProgress } from '@/api/client'
import { ApiError } from '@/lib/api'
import type { StudentProgressDto } from '@/types/api'

export function ProgressChannel() {
  const [data, setData] = useState<StudentProgressDto | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    getStudentProgress()
      .then(setData)
      .catch((err: unknown) => {
        setError(err instanceof ApiError ? err.message : 'Failed to load progress')
      })
  }, [])

  return (
    <div className="dc-panel">
      <h3>Your progress</h3>
      {error ? <p className="form-error">{error}</p> : null}
      {data ? (
        <div className="dc-stack">
          <div className="dc-row">
            <strong>Level</strong>
            <span className="dc-chip">{data.level}</span>
          </div>
          <div className="dc-row">
            <strong>Total points</strong>
            <span>{data.totalPoints}</span>
          </div>
          <div className="dc-row">
            <strong>Submitted homework</strong>
            <span>{data.numberOfSubmittedHomework}</span>
          </div>
          <div className="dc-row">
            <strong>Average score</strong>
            <span>{data.averageScore}</span>
          </div>
        </div>
      ) : !error ? (
        <p className="dc-empty">Loading…</p>
      ) : null}
    </div>
  )
}
