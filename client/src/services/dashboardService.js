import axios from 'axios'

const API_URL = 'https://vendor-management-backend-yte6.onrender.com/api/dashboard'

const getAuthHeaders = () => {
  const token = localStorage.getItem('token')
  return { Authorization: `Bearer ${token}` }
}

export const getDashboardStats = async () => {
  const response = await axios.get(API_URL, {
    headers: getAuthHeaders()
  })
  return response.data
}

export const getRecentActivity = async () => {
  const response = await axios.get(`${API_URL}/activity`, {
    headers: getAuthHeaders()
  })
  return response.data
}

export const getChartData = async (type) => {
  const response = await axios.get(`${API_URL}/chart/${type}`, {
    headers: getAuthHeaders()
  })
  return response.data
}
