import React, { useEffect, useState } from 'react'
import authService from '../services/authService'
import storeOwnerService from '../services/storeOwnerService'
import ChangePasswordModal from '../components/ChangePasswordModal'
import './storeOwnerDashboard.css'

const formatDate = (value) => {
  try {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric', month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit'
    }).format(new Date(value))
  } catch {
    return value
  }
}

const formatNumber = (value, digits = 2) => {
  const numberValue = Number(value)
  if (Number.isFinite(numberValue)) {
    return numberValue.toFixed(digits)
  }
  return value ?? '--'
}

export default function StoreOwnerDashboard() {
  const [dashboard, setDashboard] = useState(null)
  const [ratings, setRatings] = useState([])
  const [selectedStoreId, setSelectedStoreId] = useState('')
  const [sortBy, setSortBy] = useState('rating')
  const [order, setOrder] = useState('DESC')
  const [loadingDashboard, setLoadingDashboard] = useState(true)
  const [loadingRatings, setLoadingRatings] = useState(true)
  const [toastMessage, setToastMessage] = useState('')
  const [toastType, setToastType] = useState('success')
  const [passwordModalOpen, setPasswordModalOpen] = useState(false)
  const [passwordLoading, setPasswordLoading] = useState(false)
  const [passwordServerError, setPasswordServerError] = useState('')
  const [error, setError] = useState('')

  const loadDashboard = async () => {
    try {
      setLoadingDashboard(true)
      const { dashboard: dashboardData } = await storeOwnerService.getDashboard()
      setDashboard(dashboardData)
      setError('')
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to load store owner dashboard')
    } finally {
      setLoadingDashboard(false)
    }
  }

  const loadRatings = async () => {
    try {
      setLoadingRatings(true)
      const { ratings: fetchedRatings } = await storeOwnerService.getRatings({
        storeId: selectedStoreId,
        sortBy,
        order
      })
      setRatings(fetchedRatings)
      setError('')
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to load ratings')
    } finally {
      setLoadingRatings(false)
    }
  }

  useEffect(() => {
    loadDashboard()
  }, [])

  useEffect(() => {
    loadRatings()
  }, [selectedStoreId, sortBy, order])

  useEffect(() => {
    if (!toastMessage) return
    const timeout = setTimeout(() => setToastMessage(''), 4200)
    return () => clearTimeout(timeout)
  }, [toastMessage])

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    window.location.href = '/login'
  }

  const openPasswordModal = () => {
    setPasswordServerError('')
    setPasswordModalOpen(true)
  }

  const closePasswordModal = () => {
    setPasswordModalOpen(false)
  }

  const handlePasswordSubmit = async ({ currentPassword, newPassword }) => {
    setPasswordServerError('')

    try {
      setPasswordLoading(true)
      await authService.updatePassword({ currentPassword, newPassword })
      setToastMessage('Password updated successfully.')
      setToastType('success')
      closePasswordModal()
    } catch (err) {
      const message = err.response?.data?.message || 'Unable to update password.'
      setPasswordServerError(message)
      setToastMessage(message)
      setToastType('error')
      throw new Error(message)
    } finally {
      setPasswordLoading(false)
    }
  }

  const stores = dashboard?.stores || []

  return (
    <div className="owner-dashboard-page">
      <div className="owner-dashboard-shell">
        <header className="owner-dashboard-header">
          <div className="owner-brand-block">
            <div className="owner-brand-mark">SO</div>
            <div>
              <p className="owner-brand-title">Store Owner Dashboard</p>
              <p className="owner-brand-subtitle">Review store performance and see who rated your stores.</p>
            </div>
          </div>

          <div className="owner-dashboard-actions">
            <button className="btn btn-ghost" type="button" onClick={openPasswordModal}>Change Password</button>
            <button className="btn btn-primary" type="button" onClick={handleLogout}>Logout</button>
          </div>
        </header>

        <main className="owner-dashboard-main">
          {toastMessage && (
            <div className={`owner-toast ${toastType}`}>{toastMessage}</div>
          )}

          <section className="owner-metrics-grid">
            <article className="metric-card">
              <p className="metric-label">Average rating</p>
              <h2>{loadingDashboard ? 'Loading...' : dashboard ? formatNumber(dashboard.averageRating) : '--'}</h2>
              <p className="metric-note">Across all your stores</p>
            </article>

            <article className="metric-card">
              <p className="metric-label">Total ratings</p>
              <h2>{loadingDashboard ? 'Loading...' : dashboard ? dashboard.totalRatings : '--'}</h2>
              <p className="metric-note">Ratings submitted by users</p>
            </article>

            <article className="metric-card">
              <p className="metric-label">Owned stores</p>
              <h2>{loadingDashboard ? 'Loading...' : dashboard ? dashboard.stores.length : '--'}</h2>
              <p className="metric-note">Stores assigned to you</p>
            </article>
          </section>

          <section className="owner-section card">
            <div className="section-header">
              <div>
                <h3>Your stores</h3>
                <p className="section-copy">Average rating and rating count for each store you own.</p>
              </div>
            </div>

            {loadingDashboard ? (
              <div className="section-loading">Loading stores...</div>
            ) : stores.length === 0 ? (
              <div className="section-empty">No stores are currently assigned to your account.</div>
            ) : (
              <div className="owner-table-wrapper">
                <div className="owner-table-head owner-table-row">
                  <div>Store name</div>
                  <div>Avg rating</div>
                  <div>Total ratings</div>
                </div>
                {stores.map((store) => (
                  <div className="owner-table-row" key={store.storeId}>
                    <div>{store.storeName}</div>
                    <div>{formatNumber(store.averageRating)}</div>
                    <div>{store.totalRatings}</div>
                  </div>
                ))}
              </div>
            )}
          </section>

          <section className="owner-section card">
            <div className="section-header section-header--space">
              <div>
                <h3>Ratings received</h3>
                <p className="section-copy">View who rated your stores and when.</p>
              </div>
              <div className="filter-row">
                <label>
                  Store
                  <select value={selectedStoreId} onChange={(e) => setSelectedStoreId(e.target.value)}>
                    <option value="">All stores</option>
                    {stores.map((store) => (
                      <option key={store.storeId} value={store.storeId}>{store.storeName}</option>
                    ))}
                  </select>
                </label>

                <label>
                  Sort by
                  <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
                    <option value="rating">Rating</option>
                    <option value="storeName">Store</option>
                    <option value="submittedAt">Submitted at</option>
                  </select>
                </label>

                <label>
                  Order
                  <select value={order} onChange={(e) => setOrder(e.target.value)}>
                    <option value="DESC">Newest first</option>
                    <option value="ASC">Oldest first</option>
                  </select>
                </label>
              </div>
            </div>

            {loadingRatings ? (
              <div className="section-loading">Loading ratings...</div>
            ) : ratings.length === 0 ? (
              <div className="section-empty">No ratings found for the selected filter.</div>
            ) : (
              <div className="owner-ratings-table-wrapper">
                <div className="owner-ratings-table-head owner-table-row">
                  <div>User</div>
                  <div>Store</div>
                  <div>Rating</div>
                  <div>Date</div>
                </div>
                {ratings.map((rating) => (
                  <div className="owner-table-row owner-ratings-table-row" key={rating.ratingId}>
                    <div>{rating.userName}</div>
                    <div>{rating.storeName}</div>
                    <div><span className="rating-pill">{rating.rating}</span></div>
                    <div>{formatDate(rating.submittedAt)}</div>
                  </div>
                ))}
              </div>
            )}
          </section>

          {error && <div className="owner-status-banner error">{error}</div>}
        </main>

        <ChangePasswordModal
          visible={passwordModalOpen}
          onClose={closePasswordModal}
          onSubmit={handlePasswordSubmit}
          loading={passwordLoading}
          serverError={passwordServerError}
        />
      </div>
    </div>
  )
}
