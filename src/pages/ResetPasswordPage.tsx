import { useMemo, useState, type FormEvent } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { resetPassword } from '@/api/client'
import { ApiError } from '@/lib/api'
import '@/styles/auth.css'

export function ResetPasswordPage() {
  const [params] = useSearchParams()
  const token = useMemo(() => params.get('token')?.trim() ?? '', [params])
  const navigate = useNavigate()
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)
  const appName = import.meta.env.VITE_APP_NAME || 'Español Vivo'

  async function onSubmit(e: FormEvent) {
    e.preventDefault()
    setError(null)
    if (!token) {
      setError('Missing reset token. Request a new link from the sign-in page.')
      return
    }
    if (password !== confirm) {
      setError('Passwords do not match')
      return
    }
    setBusy(true)
    try {
      await resetPassword(token, password)
      navigate('/login', { replace: true })
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Could not reset password')
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="auth-shell">
      <div className="auth-hero">
        <p className="auth-kicker">Spanish tutoring</p>
        <h1 className="brand">{appName}</h1>
        <p className="auth-lead">Choose a new password for your account.</p>
      </div>

      <form className="auth-card" onSubmit={onSubmit}>
        <h2>Reset password</h2>
        {!token ? (
          <>
            <p className="form-error">
              This reset link is missing a token. Request a new one.
            </p>
            <p className="auth-switch">
              <Link to="/forgot-password">Forgot password</Link>
            </p>
          </>
        ) : (
          <>
            <label>
              New password
              <input
                type="password"
                autoComplete="new-password"
                required
                minLength={8}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </label>
            <label>
              Confirm password
              <input
                type="password"
                autoComplete="new-password"
                required
                minLength={8}
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
              />
            </label>
            {error ? <p className="form-error">{error}</p> : null}
            <button type="submit" disabled={busy}>
              {busy ? 'Saving…' : 'Update password'}
            </button>
            <p className="auth-switch">
              <Link to="/login">Back to sign in</Link>
            </p>
          </>
        )}
      </form>
    </div>
  )
}
