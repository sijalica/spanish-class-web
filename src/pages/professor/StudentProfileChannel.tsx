import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { getStudentDetail } from '@/api/client'
import { ApiError } from '@/lib/api'
import type { StudentDetailDto } from '@/types/api'

export function StudentProfileChannel() {
  const { studentId } = useParams()
  const id = Number(studentId)
  const [detail, setDetail] = useState<StudentDetailDto | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!Number.isFinite(id)) {
      setError('Invalid student')
      return
    }
    let cancelled = false
    getStudentDetail(id)
      .then((row) => {
        if (!cancelled) setDetail(row)
      })
      .catch((err: unknown) => {
        if (!cancelled) {
          setError(err instanceof ApiError ? err.message : 'Failed to load student')
        }
      })
    return () => {
      cancelled = true
    }
  }, [id])

  return (
    <>
      <div className="dc-panel">
        <div className="dc-row">
          <h3 style={{ margin: 0 }}>Student profile</h3>
          <Link to="/professor/roster" className="dc-btn ghost">
            ← Roster
          </Link>
        </div>
        {error ? <p className="form-error">{error}</p> : null}
        {detail ? (
          <div className="dc-stack" style={{ marginTop: 12 }}>
            <div className="dc-row">
              <div>
                <strong>{detail.fullName}</strong>
                <span>{detail.email}</span>
              </div>
              <span className="dc-chip">{detail.level}</span>
            </div>
            <div className="dc-row">
              <strong>Total points</strong>
              <span>{detail.totalPoints}</span>
            </div>
            <div className="dc-row">
              <strong>Enrolled classes</strong>
              <span>{detail.enrolledClassCount}</span>
            </div>
            <div className="dc-row">
              <strong>Graded homework</strong>
              <span>{detail.numberOfGradedHomework}</span>
            </div>
            <div className="dc-row">
              <strong>Average score</strong>
              <span>{detail.averageScore.toFixed(1)}%</span>
            </div>
          </div>
        ) : !error ? (
          <p className="dc-empty">Loading…</p>
        ) : null}
      </div>

      {detail ? (
        <div className="dc-panel">
          <h3>Quick links</h3>
          <div className="dc-stack">
            <Link className="dc-channel" to="/professor/notes">
              <span className="dc-hash">#</span>
              open notes (pick this student)
            </Link>
            <Link className="dc-channel" to="/professor/payments">
              <span className="dc-hash">#</span>
              payment tracking
            </Link>
          </div>
        </div>
      ) : null}
    </>
  )
}
