import axios from 'axios'

const API_BASE = 'http://localhost:4000/api/users'

const getAuthHeaders = () => {
  const token = localStorage.getItem('token')
  return token ? { Authorization: `Bearer ${token}` } : {}
}

const userService = {
  getStores: async ({ search = '', sortBy = 'name', order = 'ASC' } = {}) => {
    const params = { search, sortBy, order }
    const { data } = await axios.get(`${API_BASE}/stores`, {
      headers: getAuthHeaders(),
      params
    })
    return data
  },

  submitRating: async ({ storeId, rating }) => {
    const { data } = await axios.post(
      `${API_BASE}/ratings`,
      { storeId, rating },
      { headers: getAuthHeaders() }
    )
    return data
  },

  updateRating: async ({ storeId, rating }) => {
    const { data } = await axios.put(
      `${API_BASE}/ratings/${storeId}`,
      { rating },
      { headers: getAuthHeaders() }
    )
    return data
  }
}

export default userService
