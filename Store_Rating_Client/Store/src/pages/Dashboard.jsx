import React, { useMemo } from 'react'
import { Navigate } from 'react-router-dom'
import AdminDashboard from './AdminDashboard'
import UserDashboard from './UserDashboard'
import StoreOwnerDashboard from './StoreOwnerDashboard'

export default function Dashboard() {
  const user = useMemo(() => {
    try {
      return JSON.parse(localStorage.getItem('user') || '{}')
    } catch {
      return null
    }
  }, [])

  if (!user || !user.role) {
    return <Navigate to="/login" replace />
  }

  const role = String(user.role || '').trim().toLowerCase()

  if (role === 'admin') {
    return <AdminDashboard />
  }

  if (role === 'normal' || role === 'user') {
    return <UserDashboard />
  }

  if (role === 'store owner' || role === 'storeowner' || role === 'store-owner') {
    return <StoreOwnerDashboard />
  }

  return <div className="page-error">Unauthorized access</div>
}
