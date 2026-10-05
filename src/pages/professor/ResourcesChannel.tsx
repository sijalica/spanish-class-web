import { useEffect, useState, type FormEvent } from 'react'
import { createResourceSection, listProfessorResources } from '@/api/client'
import { ApiError } from '@/lib/api'
import type { ResourceSectionDto } from '@/types/api'

export function ResourcesChannel() {
  const [sections, setSections] = useState<ResourceSectionDto[]>([])
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)

  async function refresh() {
    setSections(await listProfessorResources())
  }

  useEffect(() => {
    let cancelled = false
    listProfessorResources()
      .then((rows) => {
        if (!cancelled) setSections(rows)
      })
      .catch((err: unknown) => {
        if (!cancelled) {
          setError(err instanceof ApiError ? err.message : 'Failed to load resources')
        }
      })
    return () => {
      cancelled = true
    }
  }, [])

  async function onCreate(e: FormEvent) {
    e.preventDefault()
    setBusy(true)
    setError(null)
    try {
      await createResourceSection(name.trim(), description.trim() || undefined)
      setName('')
      setDescription('')
      await refresh()
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Create failed')
    } finally {
      setBusy(false)
    }
  }

  return (
    <>
      <div className="dc-panel">
        <h3>New section</h3>
        <form className="dc-form" onSubmit={onCreate}>
          <label>
            Name
            <input required value={name} onChange={(e) => setName(e.target.value)} />
          </label>
          <label>
            Description
            <input
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </label>
          {error ? <p className="form-error">{error}</p> : null}
          <button type="submit" disabled={busy}>
            {busy ? 'Creating…' : 'Create section'}
          </button>
        </form>
      </div>

      <div className="dc-panel">
        <h3>Library</h3>
        {sections.length === 0 ? (
          <p className="dc-empty">No sections yet.</p>
        ) : (
          sections.map((section) => (
            <div key={section.id} className="dc-message">
              <header>
                <strong>#{section.name}</strong>
                <em>{section.files?.length ?? 0} files</em>
              </header>
              {section.description ? <p className="muted">{section.description}</p> : null}
              {(section.files ?? []).length > 0 ? (
                <ul className="dc-stack">
                  {section.files.map((f) => (
                    <li key={f.id} className="dc-row">
                      <span>{f.originalFilename}</span>
                      <span className="muted">
                        {f.sizeBytes != null ? `${Math.round(f.sizeBytes / 1024)} KB` : ''}
                      </span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="dc-empty">No files in this section yet (upload via API/Swagger).</p>
              )}
            </div>
          ))
        )}
      </div>
    </>
  )
}
