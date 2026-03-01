import axios from 'axios'

const API_URL = 'http://localhost:5000/api/auth'

export const login = async (email, password) => {
  const response = await axios.post(`${API_URL}/login`, { email, password })
  return response.data
}

export const register = async (userData) => {
  const response = await axios.post(`${API_URL}/register`, userData)
  return response.data
}

export const logout = async () => {
  const token = localStorage.getItem('token')
  const response = await axios.post(`${API_URL}/logout`, {}, {
    headers: { Authorization: `Bearer ${token}` }
  })
  return response.data
}

export const getProfile = async () => {
  const token = localStorage.getItem('token')
  const response = await axios.get(`${API_URL}/profile`, {
    headers: { Authorization: `Bearer ${token}` }
  })
  return response.data
}

export const updateProfile = async (userData) => {
  const token = localStorage.getItem('token')
  const response = await axios.put(`${API_URL}/profile`, userData, {
    headers: { Authorization: `Bearer ${token}` }
  })
  return response.data
}

export const changePassword = async (currentPassword, newPassword) => {
  const token = localStorage.getItem('token')
  const response = await axios.post(`${API_URL}/change-password`, 
    { currentPassword, newPassword },
    { headers: { Authorization: `Bearer ${token}` } }
  )
  return response.data
}

export const requestPasswordReset = async (email) => {
  const response = await axios.post(`${API_URL}/request-password-reset`, { email })
  return response.data
}

export const resetPassword = async (token, password) => {
  const response = await axios.post(`${API_URL}/reset-password/${token}`, { password })
  return response.data
}
