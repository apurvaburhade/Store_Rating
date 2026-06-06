import React, { useEffect, useMemo, useState } from 'react'
import adminService from '../services/adminService'
import './dashboard.css'

const recentEvents = [
  { title: 'New review submitted', detail: 'Café Breeze received a new 5-star review.', time: '2 minutes ago' },
  { title: 'Store verification', detail: 'Ocean Market was approved by admin.', time: '22 minutes ago' },
  { title: 'Rating updated', detail: 'Hilltop Shop average moved to 4.7.', time: '1 hour ago' },
  { title: 'New user onboarded', detail: 'A store owner account was created.', time: '3 hours ago' },
]

export default function AdminDashboard() {
  const [dashboard, setDashboard] = useState(null)
  const [users, setUsers] = useState([])
  const [stores, setStores] = useState([])
  const [storeOwners, setStoreOwners] = useState([])
  const [selectedUser, setSelectedUser] = useState(null)
  const [searchUser, setSearchUser] = useState('')
  const [searchStore, setSearchStore] = useState('')
  const [userSort, setUserSort] = useState('name')
  const [storeSort, setStoreSort] = useState('name')
  const [userRoleFilter, setUserRoleFilter] = useState('')
  const [newUser, setNewUser] = useState({ name: '', email: '', password: '', address: '', role: 'Normal' })
  const [newStore, setNewStore] = useState({ owner_id: '', name: '', email: '', address: '' })
  const [loading, setLoading] = useState(true)
  const [savingUser, setSavingUser] = useState(false)
  const [savingStore, setSavingStore] = useState(false)
  const [error, setError] = useState('')
  const [successMessage, setSuccessMessage] = useState('')

  const user = useMemo(() => {
    try {
      return JSON.parse(localStorage.getItem('user') || '{}')
    } catch {
      return {}
    }
  }, [])

  const resetMessages = () => {
    setError('')
    setSuccessMessage('')
  }

  const loadData = async () => {
    try {
      setLoading(true)
      const [dashboardRes, usersRes, storesRes, ownersRes] = await Promise.all([
        adminService.getDashboard(),
        adminService.getUsers({ search: searchUser, sortBy: userSort, order: 'ASC', role: userRoleFilter }),
        adminService.getStores({ search: searchStore, sortBy: storeSort, order: 'ASC' }),
        adminService.getUsers({ role: 'Store Owner', sortBy: 'name', order: 'ASC' })
      ])
      setDashboard(dashboardRes.dashboard)
      setUsers(usersRes.users)
      setStores(storesRes.stores)
      setStoreOwners(ownersRes.users)
      setError('')
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to load admin data')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [searchUser, searchStore, userSort, storeSort, userRoleFilter])

  const handleUserSelect = async (userId) => {
    resetMessages()
    try {
      setLoading(true)
      const { user: selected } = await adminService.getUserDetails(userId)
      setSelectedUser(selected)
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to load user details')
    } finally {
      setLoading(false)
    }
  }
  

  const handleAddUser = async (e) => {
    e.preventDefault()
    resetMessages()
    try {
      setSavingUser(true)
      await adminService.addUser(newUser)
      setSuccessMessage('User created successfully')
      setNewUser({ name: '', email: '', password: '', address: '', role: 'Normal' })
      loadData()
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to create user')
    } finally {
      setSavingUser(false)
    }
  }

  const handleAddStore = async (e) => {
    e.preventDefault()
    resetMessages()
    try {
      setSavingStore(true)
      await adminService.addStore(newStore)
      setSuccessMessage('Store created successfully')
      setNewStore({ owner_id: '', name: '', email: '', address: '' })
      loadData()
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to create store')
    } finally {
      setSavingStore(false)
    }
  }

  return (
    <main className="dashboard-page">
      <div className="dashboard-shell">
        <section className="dashboard-hero">
          <div>
            <p className="eyebrow">Admin dashboard</p>
            <h1>Welcome back, {user.name || 'Administrator'}</h1>
            <p className="hero-copy">Manage users, stores, and performance metrics from one polished control center.</p>
          </div>
          <div className="hero-actions">
            <button className="secondary-btn">Review pending tasks</button>
            <button className="primary-btn">Invite a team member</button>
          </div>
        </section>

        <section className="metrics-grid">
          <article className="metric-card">
            <p className="metric-label">Total users</p>
            <h2>{dashboard?.totalUsers ?? '--'}</h2>
            <p className="metric-note">All normal & store owner accounts</p>
          </article>
          <article className="metric-card">
            <p className="metric-label">Total stores</p>
            <h2>{dashboard?.totalStores ?? '--'}</h2>
            <p className="metric-note">Stores available on the platform</p>
          </article>
          <article className="metric-card">
            <p className="metric-label">Total ratings</p>
            <h2>{dashboard?.totalRatings ?? '--'}</h2>
            <p className="metric-note">Reviews submitted by customers</p>
          </article>
        </section>

        <section className="admin-actions-grid">
          <div className="panel action-panel">
            <div className="panel-header">
              <div>
                <h2>Add new user</h2>
                <p>Create Normal, Store Owner, or Admin accounts.</p>
              </div>
            </div>
            <form className="admin-form" onSubmit={handleAddUser}>
              <div className="form-grid two-columns">
                <label>
                  Name
                  <input
                    type="text"
                    value={newUser.name}
                    onChange={e => setNewUser({ ...newUser, name: e.target.value })}
                    required
                    placeholder="Full name"
                  />
                </label>
                <label>
                  Email
                  <input
                    type="email"
                    value={newUser.email}
                    onChange={e => setNewUser({ ...newUser, email: e.target.value })}
                    required
                    placeholder="admin@example.com"
                  />
                </label>
              </div>
              <div className="form-grid two-columns">
                <label>
                  Password
                  <input
                    type="password"
                    value={newUser.password}
                    onChange={e => setNewUser({ ...newUser, password: e.target.value })}
                    required
                    placeholder="Secure password"
                  />
                </label>
                <label>
                  Role
                  <select
                    value={newUser.role}
                    onChange={e => setNewUser({ ...newUser, role: e.target.value })}
                  >
                    <option value="Normal">Normal</option>
                    <option value="Store Owner">Store Owner</option>
                    <option value="Admin">Admin</option>
                  </select>
                </label>
              </div>
              <label>
                Address
                <textarea
                  value={newUser.address}
                  onChange={e => setNewUser({ ...newUser, address: e.target.value })}
                  required
                  placeholder="Address details"
                />
              </label>
              <button className="primary-btn" type="submit" disabled={savingUser}>
                {savingUser ? 'Creating user...' : 'Add user'}
              </button>
            </form>
          </div>

          <div className="panel action-panel">
            <div className="panel-header">
              <div>
                <h2>Add new store</h2>
                <p>Assign a store to an existing Store Owner.</p>
              </div>
            </div>
            <form className="admin-form" onSubmit={handleAddStore}>
              <label>
                Store owner
                <select
                  value={newStore.owner_id}
                  onChange={e => setNewStore({ ...newStore, owner_id: e.target.value })}
                  required
                >
                  <option value="">Select owner</option>
                  {storeOwners.map((owner) => (
                    <option key={owner.id} value={owner.id}>{owner.name} ({owner.email})</option>
                  ))}
                </select>
              </label>
              <div className="form-grid two-columns">
                <label>
                  Store name
                  <input
                    type="text"
                    value={newStore.name}
                    onChange={e => setNewStore({ ...newStore, name: e.target.value })}
                    required
                    placeholder="Store name"
                  />
                </label>
                <label>
                  Store email
                  <input
                    type="email"
                    value={newStore.email}
                    onChange={e => setNewStore({ ...newStore, email: e.target.value })}
                    required
                    placeholder="store@example.com"
                  />
                </label>
              </div>
              <label>
                Address
                <textarea
                  value={newStore.address}
                  onChange={e => setNewStore({ ...newStore, address: e.target.value })}
                    required
                    placeholder="Store address"
                  />
              </label>
              <button className="primary-btn" type="submit" disabled={savingStore}>
                {savingStore ? 'Creating store...' : 'Add store'}
              </button>
            </form>
          </div>
        </section>

        {successMessage && <div className="success-banner">{successMessage}</div>}

        <section className="dashboard-grid listings-grid">
          <div className="panel panel-large">
            <div className="panel-header">
              <div>
                <h2>Users</h2>
                <p>View users by name, email, address, and role.</p>
              </div>
              <div className="panel-actions">
                <input
                  className="search-input"
                  type="search"
                  placeholder="Search users"
                  value={searchUser}
                  onChange={e => setSearchUser(e.target.value)}
                />
                <select value={userRoleFilter} onChange={e => setUserRoleFilter(e.target.value)}>
                  <option value="">Filter by role</option>
                  <option value="Normal">Normal users only</option>
                  <option value="Store Owner">Store Owners only</option>
                  <option value="Admin">Admins only</option>
                </select>
              </div>
            </div>

            <div className="table-card">
              <div className="table-row table-head">
                <span>Name</span>
                <span>Email</span>
                <span>Role</span>
                <span>Address</span>
              </div>
              {loading ? (
                <div className="table-loading">Loading users...</div>
              ) : users.length === 0 ? (
                <div className="table-empty">No users found.</div>
              ) : (
                users.map((userRecord) => (
                  <div
                    key={userRecord.id}
                    className="table-row clickable"
                    onClick={() => handleUserSelect(userRecord.id)}
                  >
                    <span>{userRecord.name}</span>
                    <span>{userRecord.email}</span>
                    <span>{userRecord.role}</span>
                    <span>{userRecord.address}</span>
                  </div>
                ))
              )}
            </div>

            {selectedUser && (
              <div className="detail-panel">
                <h3>User details</h3>
                <div className="detail-row">
                  <span>Name</span>
                  <strong>{selectedUser.name}</strong>
                </div>
                <div className="detail-row">
                  <span>Email</span>
                  <strong>{selectedUser.email}</strong>
                </div>
                <div className="detail-row">
                  <span>Address</span>
                  <strong>{selectedUser.address}</strong>
                </div>
                <div className="detail-row">
                  <span>Role</span>
                  <strong>{selectedUser.role}</strong>
                </div>
                {selectedUser.role === 'Store Owner' && (
                  <div className="detail-row">
                    <span>Rating</span>
                    <strong>{selectedUser.rating ?? '0.00'}</strong>
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="panel panel-large">
            <div className="panel-header">
              <div>
                <h2>Stores</h2>
                <p>View stores by name, email, address, and rating.</p>
              </div>
              <div className="panel-actions">
                <input
                  className="search-input"
                  type="search"
                  placeholder="Search stores"
                  value={searchStore}
                  onChange={e => setSearchStore(e.target.value)}
                />
                <select value={storeSort} onChange={e => setStoreSort(e.target.value)}>
                  <option value="name">Sort by name</option>
                  <option value="email">Sort by email</option>
                  <option value="address">Sort by address</option>
                </select>
              </div>
            </div>

            <div className="table-card table-card-small">
              <div className="table-row table-head">
                <span>Store</span>
                <span>Rating</span>
                <span>Email</span>
                <span>Status</span>
              </div>
              {loading ? (
                <div className="table-loading">Loading stores...</div>
              ) : stores.length === 0 ? (
                <div className="table-empty">No stores available.</div>
              ) : (
                stores.map((store) => (
                  <div key={store.id} className="table-row">
                    <span>{store.name}</span>
                    <span>{store.rating}</span>
                    <span>{store.email}</span>
                    <span className={`status-chip ${store.rating >= 4.5 ? 'green' : 'pending'}`}>
                      {store.rating >= 4.5 ? 'Top' : 'Review'}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>
        </section>

        <section className="insight-section">
          <div className="insight-grid">
            <div className="insight-card">
              <h3>Pending tasks</h3>
              <p>12 items need review before the end of day.</p>
            </div>
            <div className="insight-card">
              <h3>Team notes</h3>
              <p>Keep store owners updated on rating improvements.</p>
            </div>
            <div className="insight-card">
              <h3>Uptime</h3>
              <p>All systems are healthy and responding normally.</p>
            </div>
          </div>

          <div className="activity-panel">
            <div className="panel-header">
              <h2>Recent admin activity</h2>
            </div>
            <div className="activity-list">
              {recentEvents.map((event) => (
                <div key={event.time} className="activity-item">
                  <div>
                    <p className="activity-title">{event.title}</p>
                    <p className="activity-detail">{event.detail}</p>
                  </div>
                  <span className="activity-time">{event.time}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {error && <div className="page-error">{error}</div>}
      </div>
    </main>
  )
}
