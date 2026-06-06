import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import authService from '../services/authService'
import './register.css'

const passwordRe = /^(?=.{8,16}$)(?=.*[A-Z])(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]).*$/

export default function Register() {
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [email, setEmail] = useState('')
  const [address, setAddress] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const navigate = useNavigate()

  const validate = () => {
    if (firstName.trim().length < 2) return 'First name must be at least 2 characters.'
    if (lastName.trim().length < 2) return 'Last name must be at least 2 characters.'
    const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRe.test(email)) return 'Please enter a valid email.'
    if (!passwordRe.test(password)) return 'Password must be 8-16 chars, include an uppercase and a special character.'
    return ''
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSuccess('')
    const v = validate()
    if (v) return setError(v)

    try {
      const name = `${firstName.trim()} ${lastName.trim()}`.trim()
      const res = await authService.register({ name, email, address, password })
      if (res && res.success) {
        setSuccess('Registration successful. Redirecting to login...')
        setTimeout(() => navigate('/login'), 1200)
      } else {
        setError(res.message || 'Registration failed')
      }
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Registration error')
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-center">
        <div className="auth-card">
          <div className="brand-block">
            <div className="brand-icon">SR</div>
            <h2 className="title">Create account</h2>
            <p className="subtitle">Join Store Ratings and start reviewing stores in minutes.</p>
          </div>

          {error && <div className="alert">{error}</div>}
          {success && <div className="success">{success}</div>}

          <form className="form" onSubmit={handleSubmit}>
            <div className="form-grid">
              <div className="field">
                <label>First name</label>
                <input
                  type="text"
                  placeholder="John"
                  value={firstName}
                  onChange={e => setFirstName(e.target.value)}
                  required
                />
              </div>
              <div className="field">
                <label>Last name</label>
                <input
                  type="text"
                  placeholder="Doe"
                  value={lastName}
                  onChange={e => setLastName(e.target.value)}
                  required
                />
              </div>
            </div>

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
              <label>Address</label>
              <textarea
                placeholder="123 Main St, City, Country"
                value={address}
                onChange={e => setAddress(e.target.value)}
              />
            </div>

            <div className="field">
              <label>Password</label>
              <input
                type="password"
                placeholder="Create a password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
              />
            </div>

            <button className="btn-submit" type="submit">Create account</button>
          </form>

          <p className="small">
            Already have an account? <Link to="/login">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  )
}
