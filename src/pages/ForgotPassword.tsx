import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { forgotPassword } from '../lib/auth'

function isValidEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim())
}

export default function ForgotPassword() {
  const [email, setEmail] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [sent, setSent] = useState(false)

  const canSubmit = useMemo(() => isValidEmail(email) && !submitting, [email, submitting])

  const onSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    setError('')

    if (!isValidEmail(email)) {
      setError('Please enter a valid email address.')
      return
    }

    try {
      setSubmitting(true)
      await forgotPassword({ email: email.trim() })
      setSent(true)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Unable to send reset instructions.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="auth-shell">
      <div className="auth-card">
        <div className="auth-header">
          <div className="auth-brand">Reset your password</div>
          <p className="auth-subtitle">We’ll send a reset link / code to your email.</p>
        </div>

        {error && <div className="banner banner-error">{error}</div>}
        {sent && (
          <div className="banner banner-success">
            If an account exists for <strong>{email.trim()}</strong>, reset instructions have been sent.
          </div>
        )}

        <form onSubmit={onSubmit} className="auth-form">
          <div className="form-group">
            <label htmlFor="forgotEmail">Email</label>
            <input
              id="forgotEmail"
              type="email"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={submitting || sent}
            />
          </div>

          <button className="btn btn-primary auth-submit" type="submit" disabled={!canSubmit || sent}>
            {submitting ? 'Sending...' : sent ? 'Sent' : 'Send reset instructions'}
          </button>
        </form>

        <div className="auth-footer auth-footer-split">
          <Link className="auth-link" to="/login">
            Back to login
          </Link>
          <Link className="auth-link" to={`/reset-password?email=${encodeURIComponent(email.trim())}`}>
            I already have a code
          </Link>
        </div>
      </div>
    </div>
  )
}

