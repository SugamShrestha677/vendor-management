import axios from 'axios'

const API_URL = 'http://localhost:5000/api/vendors'

const getAuthHeaders = () => {
  const token = localStorage.getItem('token')
  return { Authorization: `Bearer ${token}` }
}

export const getAllVendors = async (params = {}) => {
  const response = await axios.get(API_URL, {
    params,
    headers: getAuthHeaders()
  })
  return response.data
}

export const getVendorById = async (id) => {
  const response = await axios.get(`${API_URL}/${id}`, {
    headers: getAuthHeaders()
  })
  return response.data
}

export const updateVendorProfile = async (id, vendorData) => {
  const response = await axios.put(`${API_URL}/${id}`, vendorData, {
    headers: getAuthHeaders()
  })
  return response.data
}

export const getVendorOrders = async (id, params = {}) => {
  const response = await axios.get(`${API_URL}/${id}/orders`, {
    params,
    headers: getAuthHeaders()
  })
  return response.data
}

export const updateOrderStatus = async (vendorId, orderId, status, trackingNumber = '') => {
  const response = await axios.post(`${API_URL}/${vendorId}/orders/${orderId}/status`, 
    { status, trackingNumber },
    { headers: getAuthHeaders() }
  )
  return response.data
}

export const getVendorAnalytics = async (id) => {
  const response = await axios.get(`${API_URL}/${id}/analytics`, {
    headers: getAuthHeaders()
  })
  return response.data
}

export const getRatingAndReview = async (id) => {
  const response = await axios.get(`${API_URL}/${id}/rating`, {
    headers: getAuthHeaders()
  })
  return response.data
}

export const searchVendors = async (keyword, category = '') => {
  const response = await axios.get(`${API_URL}/search`, {
    params: { keyword, category },
    headers: getAuthHeaders()
  })
  return response.data
}
