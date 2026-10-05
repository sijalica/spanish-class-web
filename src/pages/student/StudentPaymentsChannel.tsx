import { useEffect, useState } from 'react'
import { listMyPaymentTracking } from '@/api/client'
import { ApiError } from '@/lib/api'
import type { MyPaymentTrackingDto } from '@/types/api'

export function StudentPaymentsChannel() {
  const [rows, setRows] = useState<MyPaymentTrackingDto[]>([])
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    listMyPaymentTracking()
      .then(setRows)
      .catch((err: unknown) => {
        setError(err instanceof ApiError ? err.message : 'Failed to load')
      })
  }, [])

  return (
    <div className="dc-panel">
      <h3>Payments</h3>
      {error ? <p className="form-error">{error}</p> : null}
      {rows.length === 0 && !error ? (
        <p className="dc-empty">No payment records.</p>
      ) : (
        <div className="dc-stack">
          {rows.map((r) => (
            <div className="dc-row" key={r.professorId}>
              <div>
                <strong>{r.professorFullName}</strong>
                <span>{r.note ?? ''}</span>
              </div>
              <div style={{ textAlign: 'right' }}>
                <span className="dc-chip">
                  {r.paymentReceived ? 'paid' : 'unpaid'}
                </span>
                <div className="muted">prepaid: {r.prepaidClassCount ?? 0}</div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
