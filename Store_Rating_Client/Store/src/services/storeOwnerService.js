import axios from 'axios'

const API_BASE = 'http://localhost:4000/api/store-owner'

const getAuthHeaders = () => {
  const token = localStorage.getItem('token')
  return token ? { Authorization: `Bearer ${token}` } : {}
}

const storeOwnerService = {
  getDashboard: async () => {
    const { data } = await axios.get(`${API_BASE}/dashboard`, { headers: getAuthHeaders() })
    return data
  },

  getRatings: async ({ storeId = '', sortBy = 'rating', order = 'DESC' } = {}) => {
    const params = { sortBy, order }
    if (storeId) params.storeId = storeId

    

    const { data } = await axios.get(`${API_BASE}/ratings`, {
      headers: getAuthHeaders(),
      params
    })

    return data
  }
}

export default storeOwnerService
