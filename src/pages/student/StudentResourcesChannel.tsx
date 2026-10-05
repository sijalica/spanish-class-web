import { useEffect, useState } from 'react'
import { listStudentResources } from '@/api/client'
import { ApiError } from '@/lib/api'
import type { ProfessorResourcesDto } from '@/types/api'

export function StudentResourcesChannel() {
  const [libs, setLibs] = useState<ProfessorResourcesDto[]>([])
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    listStudentResources()
      .then(setLibs)
      .catch((err: unknown) => {
        setError(err instanceof ApiError ? err.message : 'Failed to load resources')
      })
  }, [])

  return (
    <div className="dc-panel">
      <h3>Shared libraries</h3>
      {error ? <p className="form-error">{error}</p> : null}
      {libs.length === 0 && !error ? (
        <p className="dc-empty">No resources yet.</p>
      ) : (
        libs.map((lib) => (
          <div key={lib.professorId} className="dc-message">
            <header>
              <strong>{lib.professorFullName}</strong>
            </header>
            {(lib.sections ?? []).length === 0 ? (
              <p className="dc-empty">No sections.</p>
            ) : (
              lib.sections.map((s) => (
                <div key={s.id} style={{ marginTop: 10 }}>
                  <span className="dc-chip">#{s.name}</span>
                  <div className="dc-stack" style={{ marginTop: 8 }}>
                    {(s.files ?? []).map((f) => (
                      <div className="dc-row" key={f.id}>
                        <span>{f.originalFilename}</span>
                      </div>
                    ))}
                    {(s.files ?? []).length === 0 ? (
                      <p className="dc-empty">Empty section</p>
                    ) : null}
                  </div>
                </div>
              ))
            )}
          </div>
        ))
      )}
    </div>
  )
}
