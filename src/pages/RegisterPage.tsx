import { useState, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '@/auth/AuthContext'
import { ApiError } from '@/lib/api'
import type { Role, SpanishLevel } from '@/types/api'
import '@/styles/auth.css'

export function RegisterPage() {
  const { register } = useAuth()
  const navigate = useNavigate()
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [role, setRole] = useState<Role>('STUDENT')
  const [level, setLevel] = useState<SpanishLevel>('BEGINNER')
  const [error, setError] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)
  const appName = import.meta.env.VITE_APP_NAME || 'Español Vivo'

  async function onSubmit(e: FormEvent) {
    e.preventDefault()
    setError(null)
    setBusy(true)
    try {
      const user = await register({
        fullName,
        email,
        password,
        role,
        level: role === 'STUDENT' ? level : undefined,
      })
      navigate(user.role === 'PROFESSOR' ? '/professor' : '/student', {
        replace: true,
      })
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Could not register')
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="auth-shell">
      <div className="auth-hero">
        <p className="auth-kicker">Join the studio</p>
        <h1 className="brand">{appName}</h1>
        <p className="auth-lead">
          Create a professor or student account. Welcome email is sent when mail
          is enabled on the API.
        </p>
      </div>

      <form className="auth-card" onSubmit={onSubmit}>
        <h2>Create account</h2>
        <label>
          Full name
          <input
            required
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
          />
        </label>
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
        <label>
          Password
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
          I am a
          <select
            value={role}
            onChange={(e) => setRole(e.target.value as Role)}
          >
            <option value="STUDENT">Student</option>
            <option value="PROFESSOR">Professor</option>
          </select>
        </label>
        {role === 'STUDENT' ? (
          <label>
            Level
            <select
              value={level}
              onChange={(e) => setLevel(e.target.value as SpanishLevel)}
            >
              <option value="BEGINNER">Beginner</option>
              <option value="INTERMEDIATE">Intermediate</option>
              <option value="ADVANCED">Advanced</option>
              <option value="NATIVE">Native</option>
            </select>
          </label>
        ) : null}
        {error ? <p className="form-error">{error}</p> : null}
        <button type="submit" disabled={busy}>
          {busy ? 'Creating…' : 'Create account'}
        </button>
        <p className="auth-switch">
          Already registered? <Link to="/login">Sign in</Link>
        </p>
      </form>
    </div>
  )
}
