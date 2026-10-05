import { useEffect, useState } from 'react'
import { listPaymentTracking } from '@/api/client'
import { ApiError } from '@/lib/api'
import type { StudentPaymentTrackingDto } from '@/types/api'

export function PaymentsChannel() {
  const [rows, setRows] = useState<StudentPaymentTrackingDto[]>([])
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    listPaymentTracking()
      .then(setRows)
      .catch((err: unknown) => {
        setError(err instanceof ApiError ? err.message : 'Failed to load payments')
      })
  }, [])

  return (
    <div className="dc-panel">
      <h3>Payment tracking</h3>
      {error ? <p className="form-error">{error}</p> : null}
      {rows.length === 0 && !error ? (
        <p className="dc-empty">No payment rows yet.</p>
      ) : (
        <div className="dc-stack">
          {rows.map((r) => (
            <div className="dc-row" key={r.studentId}>
              <div>
                <strong>{r.studentFullName}</strong>
                <span>
                  {r.studentEmail}
                  {r.note ? ` · ${r.note}` : ''}
                </span>
              </div>
              <div style={{ textAlign: 'right' }}>
                <span className="dc-chip">
                  {r.paymentReceived ? 'paid' : 'unpaid'}
                </span>
                <div className="muted">
                  prepaid: {r.prepaidClassCount ?? 0}
                  {r.recordedAmount != null ? ` · ${r.recordedAmount}` : ''}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
