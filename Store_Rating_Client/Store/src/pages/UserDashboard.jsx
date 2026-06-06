import React, { useEffect, useState } from 'react'
import userService from '../services/userService'
import authService from '../services/authService'
import ChangePasswordModal from '../components/ChangePasswordModal'
import './userDashboard.css'

export default function UserDashboard() {
  const [stores, setStores] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [sortBy, setSortBy] = useState('name')
  const [ratingInputs, setRatingInputs] = useState({})
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false)
  const [passwordLoading, setPasswordLoading] = useState(false)
  const [passwordServerError, setPasswordServerError] = useState('')
  const [toastMessage, setToastMessage] = useState('')
  const [toastType, setToastType] = useState('success')
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [searchPopup, setSearchPopup] = useState({ visible: false, query: '', results: [] })
  const [selectedStore, setSelectedStore] = useState(null)

  const loadStores = async () => {
    try {
      setLoading(true)
      const { stores: fetchedStores } = await userService.getStores({ search, sortBy, order: 'ASC' })
      setStores(fetchedStores)
      setError('')
      if (search.trim()) {
        setSearchPopup({ visible: true, query: search.trim(), results: fetchedStores })
      } else {
        setSearchPopup(prev => ({ ...prev, visible: false }))
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to load stores')
      setSearchPopup(prev => ({ ...prev, visible: false }))
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadStores()
  }, [search, sortBy])

  useEffect(() => {
    if (!stores.length) return
    setRatingInputs(prev => {
      const next = { ...prev }
      stores.forEach((store) => {
        if (next[store.id] === undefined) {
          next[store.id] = store.userRating > 0 ? store.userRating : 4
        }
      })
      return next
    })
  }, [stores])

  const updateRatingInput = (storeId, value) => {
    setRatingInputs(prev => ({ ...prev, [storeId]: Number(value) }))
  }

  const openStoreDetails = (store) => {
    setSearchPopup(prev => ({ ...prev, visible: false }))
    setSelectedStore(store)
  }

  const closeStoreDetails = () => setSelectedStore(null)

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    window.location.href = '/login'
  }

  const openPasswordModal = () => {
    setPasswordServerError('')
    setIsPasswordModalOpen(true)
  }

  const closePasswordModal = () => {
    setIsPasswordModalOpen(false)
    setPasswordServerError('')
  }

  const handlePasswordSubmit = async ({ currentPassword, newPassword }) => {
    setPasswordServerError('')

    try {
      setPasswordLoading(true)
      await authService.updatePassword({ currentPassword, newPassword })
      setToastMessage('Password updated successfully.')
      setToastType('success')
      setIsPasswordModalOpen(false)
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

  useEffect(() => {
    if (!toastMessage) return
    const timeout = setTimeout(() => setToastMessage(''), 4200)
    return () => clearTimeout(timeout)
  }, [toastMessage])

  const handleSubmitRating = async (storeId, existingRating) => {
    setMessage('')
    setError('')
    const ratingValue = ratingInputs[storeId] ?? existingRating ?? 0
    if (!ratingValue || ratingValue < 1 || ratingValue > 5) {
      setError('Please choose a rating between 1 and 5')
      return
    }

    try {
      setLoading(true)
      if (existingRating > 0) {
        await userService.updateRating({ storeId, rating: ratingValue })
        setMessage('Rating updated successfully')
      } else {
        await userService.submitRating({ storeId, rating: ratingValue })
        setMessage('Rating submitted successfully')
      }
      await loadStores()
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to submit rating')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="dashboard-page">
      <div className="dashboard-container">
        <header className="dashboard-navbar">
          <div className="dashboard-brand">
            <div className="brand-mark">S</div>
            <div>
              <p className="brand-title">Store Ratings</p>
              <p className="brand-subtitle">Admin panel</p>
            </div>
          </div>

          <div className="dashboard-actions">
            <button className="nav-btn nav-btn--ghost" type="button" onClick={openPasswordModal}>Change Password</button>
            <button className="nav-btn nav-btn--primary" type="button" onClick={handleLogout}>Logout</button>
          </div>
        </header>

        <main className="dashboard-main">
          {toastMessage && (
            <div className={`dashboard-toast ${toastType}`}>
              {toastMessage}
            </div>
          )}

          <section className="dashboard-intro card">
            <div>
              <h1>Store Dashboard</h1>
              <p className="section-copy">Manage and rate available stores with clarity, speed, and confidence.</p>
            </div>

            <div className="profile-card">
              <div className="profile-avatar">SA</div>
              <div>
                <p className="profile-name">Store Admin</p>
                <p className="profile-role">Rating manager</p>
              </div>
            </div>
          </section>

          <section className="toolbar-card card">
            <div className="toolbar-grid">
              <label className="field-group">
                <span className="field-label">Search stores</span>
                <input
                  type="search"
                  className="field-input"
                  placeholder="Search by name or address"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </label>

              <label className="field-group">
                <span className="field-label">Sort by</span>
                <select
                  className="field-input"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                >
                  <option value="name">Name</option>
                  <option value="address">Address</option>
                  <option value="rating">Rating</option>
                </select>
              </label>
            </div>
          </section>

          {searchPopup.visible && (
            <div className="search-popup-backdrop" onClick={() => setSearchPopup(prev => ({ ...prev, visible: false }))}>
              <div className="search-popup" onClick={(e) => e.stopPropagation()}>
                <div className="popup-header">
                  <div>
                    <h3>Search results</h3>
                    <p>Results for "{searchPopup.query}"</p>
                  </div>
                  <button className="popup-close" onClick={() => setSearchPopup(prev => ({ ...prev, visible: false }))}>×</button>
                </div>

                {searchPopup.results.length > 0 ? (
                  <ul className="search-popup-list">
                    {searchPopup.results.map((store) => (
                      <li key={store.id} className="search-popup-item" onClick={() => openStoreDetails(store)}>
                        {store.name}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <div className="search-popup-empty">No stores found for this query.</div>
                )}
              </div>
            </div>
          )}

          {selectedStore && (
            <div className="details-backdrop" onClick={closeStoreDetails}>
              <div className="details-card" onClick={(e) => e.stopPropagation()}>
                <div className="details-header">
                  <div>
                    <h3>{selectedStore.name}</h3>
                    <p className="details-subtitle">Store details and current rating</p>
                  </div>
                  <button className="popup-close" onClick={closeStoreDetails}>×</button>
                </div>

                <div className="details-grid">
                  <div className="details-row">
                    <span className="details-label">Address</span>
                    <span className="details-value">{selectedStore.address || 'N/A'}</span>
                  </div>
                  <div className="details-row">
                    <span className="details-label">Average rating</span>
                    <span className="details-value">{selectedStore.overallRating ?? 'Not rated'}</span>
                  </div>
                  <div className="details-row">
                    <span className="details-label">Your rating</span>
                    <span className="details-value">{selectedStore.userRating > 0 ? `${selectedStore.userRating}/5` : 'No rating yet'}</span>
                  </div>
                  {selectedStore.description && (
                    <div className="details-row details-full-width">
                      <span className="details-label">Description</span>
                      <span className="details-value">{selectedStore.description}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          <section className="table-card card">
            <div className="table-card-header">
              <div>
                <h2>Available stores</h2>
                <p className="section-copy">Quickly scan ratings, locations and reviews in one clean view.</p>
              </div>
            </div>

            <div className="store-table-wrapper">
              <div className="store-table">
                <div className="table-head">
                  <div className="table-cell table-cell--wide">Store</div>
                  <div className="table-cell table-cell--wide">Address</div>
                  <div className="table-cell">Avg rating</div>
                  <div className="table-cell">Your rating</div>
                  <div className="table-cell table-cell--action">Action</div>
                </div>

                {loading ? (
                  <div className="table-empty">Loading stores...</div>
                ) : stores.length === 0 ? (
                  <div className="table-empty">No stores found. Try broadening your search.</div>
                ) : (
                  stores.map((store) => (
                    <div key={store.id} className="table-row">
                      <div className="table-cell table-cell--wide">
                        <div className="store-name">{store.name}</div>
                      </div>
                      <div className="table-cell table-cell--wide">
                        <div className="store-address">{store.address}</div>
                      </div>
                      <div className="table-cell">
                        <span className="rating-badge">⭐ {store.overallRating || 'N/A'}</span>
                      </div>
                      <div className="table-cell">
                        <div className="rating-control">
                          <span className="rating-current">{store.userRating > 0 ? `${store.userRating}/5` : 'Not rated'}</span>
                          <select
                            className="rating-select"
                            value={ratingInputs[store.id] ?? store.userRating ?? 4}
                            onChange={(e) => updateRatingInput(store.id, e.target.value)}
                          >
                            {[1, 2, 3, 4, 5].map((value) => (
                              <option key={value} value={value}>{value}</option>
                            ))}
                          </select>
                        </div>
                      </div>
                      <div className="table-cell table-cell--action">
                        <button
                          className="action-btn"
                          type="button"
                          onClick={() => handleSubmitRating(store.id, store.userRating)}
                        >
                          {store.userRating > 0 ? 'Update' : 'Submit'}
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {message && <div className="status-banner success">{message}</div>}
            {error && <div className="status-banner error">{error}</div>}
          </section>
        </main>

        <ChangePasswordModal
          visible={isPasswordModalOpen}
          onClose={closePasswordModal}
          onSubmit={handlePasswordSubmit}
          loading={passwordLoading}
          serverError={passwordServerError}
        />
      </div>
    </div>
  )
}
