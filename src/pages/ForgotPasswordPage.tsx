import { useState, type FormEvent } from 'react'
import { Link } from 'react-router-dom'
import { forgotPassword } from '@/api/client'
import { ApiError } from '@/lib/api'
import '@/styles/auth.css'

export function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [done, setDone] = useState(false)
  const [busy, setBusy] = useState(false)
  const appName = import.meta.env.VITE_APP_NAME || 'Español Vivo'

  async function onSubmit(e: FormEvent) {
    e.preventDefault()
    setError(null)
    setBusy(true)
    try {
      await forgotPassword(email.trim())
      setDone(true)
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Could not send reset email')
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="auth-shell">
      <div className="auth-hero">
        <p className="auth-kicker">Spanish tutoring</p>
        <h1 className="brand">{appName}</h1>
        <p className="auth-lead">
          We will email a reset link if that address has an account.
        </p>
      </div>

      <form className="auth-card" onSubmit={onSubmit}>
        <h2>Forgot password</h2>
        {done ? (
          <>
            <p className="auth-switch">
              If an account exists for that email, reset instructions were sent.
              Check your inbox (and spam), then return to sign in.
            </p>
            <p className="auth-switch">
              <Link to="/login">Back to sign in</Link>
            </p>
          </>
        ) : (
          <>
            <label>
              Email
              <input
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </label>
            {error ? <p className="form-error">{error}</p> : null}
            <button type="submit" disabled={busy}>
              {busy ? 'Sending…' : 'Send reset link'}
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
