import { useMemo, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { resetPassword } from '../lib/auth'

export default function ResetPassword() {
  const [params] = useSearchParams()

  const [email, setEmail] = useState(params.get('email') ?? '')
  const [token, setToken] = useState(params.get('token') ?? '')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [done, setDone] = useState(false)

  const validationError = useMemo(() => {
    if (!email.trim()) return 'Email is required.'
    if (!token.trim()) return 'Reset code / token is required.'
    if (!newPassword) return 'New password is required.'
    if (newPassword.length < 6) return 'Password must be at least 6 characters.'
    if (newPassword !== confirmPassword) return 'Passwords do not match.'
    return ''
  }, [confirmPassword, email, newPassword, token])

  const canSubmit = !validationError && !submitting && !done

  const onSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    setError('')

    if (validationError) {
      setError(validationError)
      return
    }

    try {
      setSubmitting(true)
      await resetPassword({
        email: email.trim(),
        token: token.trim(),
        newPassword,
      })
      setDone(true)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Unable to reset password.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="auth-shell">
      <div className="auth-card">
        <div className="auth-header">
          <div className="auth-brand">Set a new password</div>
          <p className="auth-subtitle">Use the code/token you received by email.</p>
        </div>

        {error && <div className="banner banner-error">{error}</div>}
        {done && <div className="banner banner-success">Password updated successfully.</div>}

        <form onSubmit={onSubmit} className="auth-form">
          <div className="form-group">
            <label htmlFor="resetEmail">Email</label>
            <input
              id="resetEmail"
              type="email"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={submitting || done}
            />
          </div>

          <div className="form-group">
            <label htmlFor="resetToken">Reset code / token</label>
            <input
              id="resetToken"
              type="text"
              value={token}
              onChange={(e) => setToken(e.target.value)}
              disabled={submitting || done}
            />
          </div>

          <div className="form-group">
            <label htmlFor="newPassword">New password</label>
            <input
              id="newPassword"
              type="password"
              autoComplete="new-password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              disabled={submitting || done}
            />
          </div>

          <div className="form-group">
            <label htmlFor="confirmPassword">Confirm password</label>
            <input
              id="confirmPassword"
              type="password"
              autoComplete="new-password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              disabled={submitting || done}
            />
          </div>

          <button className="btn btn-primary auth-submit" type="submit" disabled={!canSubmit}>
            {submitting ? 'Saving...' : done ? 'Saved' : 'Reset password'}
          </button>
        </form>

        <div className="auth-footer">
          <Link className="auth-link" to="/login">
            Back to login
          </Link>
        </div>
      </div>
    </div>
  )
}

