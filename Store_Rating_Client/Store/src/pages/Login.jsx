import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import authService from '../services/authService'
import './login.css'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [remember, setRemember] = useState(false)
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    try {
      const res = await authService.login({ email, password })
      if (res && res.token) {
        localStorage.setItem('token', res.token)
        localStorage.setItem('user', JSON.stringify(res.user || {}))
        navigate('/dashboard')
      } else {
        setError(res.message || 'Login failed')
      }
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Login error')
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-center">
        <div className="auth-card">
          <div className="brand-block">
            <div className="brand-icon">SR</div>
            <h2 className="title">Store Ratings</h2>
            <p className="subtitle">Sign in to manage stores, reviews, and ratings.</p>
          </div>

          {error && <div className="alert">{error}</div>}

          <form className="form" onSubmit={handleSubmit}>
            <div className="field">
              <label>Email</label>
              <input
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="field">
              <label>Password</label>
              <input
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
              />
            </div>

            <div className="row between">
              <label className="remember">
                <input type="checkbox" checked={remember} onChange={e => setRemember(e.target.checked)} />
                Remember me
              </label>
              <Link to="/forgot" className="forgot">Forgot password?</Link>
            </div>

            <button className="btn-submit" type="submit">Sign in</button>
          </form>

          <p className="small">New to Store Ratings? <Link to="/register">Create an account</Link></p>
        </div>
      </div>
    </div>
  )
}
