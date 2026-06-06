import axios from 'axios'

const API_BASE = 'http://localhost:4000/api/auth'




const register = async (payload) => {
  const { data } = await axios.post(`${API_BASE}/register`, payload)
  return data
}



const login = async (payload) => {
  const { data } = await axios.post(`${API_BASE}/login`, payload)
  return data
}

const updatePassword = async (payload) => {
  const token = localStorage.getItem('token')
  const { data } = await axios.post(`${API_BASE}/update-password`, payload, {
    headers: token ? { Authorization: `Bearer ${token}` } : {}
  })
  return data
}

export default { register, login, updatePassword }
