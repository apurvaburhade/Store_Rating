import React from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import './header.css'



export default function Header() {
  const navigate = useNavigate()
  const token = localStorage.getItem('token')
  const user = (() => {
    try {
      return JSON.parse(localStorage.getItem('user') || '{}')
    } catch {
      return {}
    }
  })()
  const isAdmin = user.role === 'Admin'

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    navigate('/login')
  }

  const linkClass = ({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')

  return (
    <header className="site-header">
      <div className="container">
        <div className="brand">Store Ratings</div>
        <nav className="nav">
          {!token && (
            <>
              <NavLink to="/login" className={linkClass}>Login</NavLink>
              <NavLink to="/register" className={linkClass}>Register</NavLink>
            </>
          )}
          {token && (
            <>
              <NavLink to="/dashboard" className={linkClass}>Dashboard</NavLink>
              <button onClick={handleLogout} className="logout">Logout</button>
            </>
          )}
        </nav>
      </div>
    </header>
  )
}
