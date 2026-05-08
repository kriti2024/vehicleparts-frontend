import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

export default function Login() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [message, setMessage] = useState('')

  const onSubmit = (event: React.FormEvent) => {
    event.preventDefault()
    setMessage('')

    // This frontend currently ships without a backend auth contract.
    // We still provide a login UI so "Forgot password" has a natural entry point.
    if (!email.trim() || !password) {
      setMessage('Please enter your email and password.')
      return
    }

    // Navigate to dashboard for now.
    navigate('/')
  }

  return (
    <div className="auth-shell">
      <div className="auth-card">
        <div className="auth-header">
          <div className="auth-brand">VehicleParts Admin</div>
          <p className="auth-subtitle">Sign in to continue.</p>
        </div>

        {message && <div className="banner banner-error">{message}</div>}

        <form onSubmit={onSubmit} className="auth-form">
          <div className="form-group">
            <label htmlFor="loginEmail">Email</label>
            <input
              id="loginEmail"
              type="email"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label htmlFor="loginPassword">Password</label>
            <input
              id="loginPassword"
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button className="btn btn-primary auth-submit" type="submit">
            Sign in
          </button>
        </form>

        <div className="auth-footer">
          <Link className="auth-link" to="/forgot-password">
            Forgot password?
          </Link>
        </div>
      </div>
    </div>
  )
}

