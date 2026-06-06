import axios from 'axios'

const API_BASE = 'http://localhost:4000/api/admin'

const getAuthHeaders = () => {
  const token = localStorage.getItem('token')
  return token ? { Authorization: `Bearer ${token}` } : {}
}

const getDashboard = async () => {
  const { data } = await axios.get(`${API_BASE}/dashboard`, { headers: getAuthHeaders() })
  return data
}

const getUsers = async ({ search = '', sortBy = 'name', order = 'ASC', role = '' } = {}) => {
  const params = { search, sortBy, order }
  if (role) params.role = role

  const { data } = await axios.get(`${API_BASE}/users`, {
    headers: getAuthHeaders(),
    params
  })
  return data
}

const getStores = async ({ search = '', sortBy = 'name', order = 'ASC' } = {}) => {
  const { data } = await axios.get(`${API_BASE}/stores`, {
    headers: getAuthHeaders(),
    params: { search, sortBy, order }
  })
  return data
}

const getUserDetails = async (userId) => {
  const { data } = await axios.get(`${API_BASE}/users/${userId}`, {
    headers: getAuthHeaders()
  })
  return data
}

const addUser = async (payload) => {
  const { data } = await axios.post(`${API_BASE}/users`, payload, {
    headers: getAuthHeaders()
  })
  return data
}

const addStore = async (payload) => {
  const { data } = await axios.post(`${API_BASE}/stores`, payload, {
    headers: getAuthHeaders()
  })
  return data
}

export default {
  getDashboard,
  getUsers,
  getStores,
  getUserDetails,
  addUser,
  addStore
}
