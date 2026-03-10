import axios from 'axios'

const API_URL = 'https://vendor-management-backend-yte6.onrender.com/api/requests'

const getAuthHeaders = () => {
  const token = localStorage.getItem('token')
  return { Authorization: `Bearer ${token}` }
}

export const createRequest = async (requestData) => {
  const response = await axios.post(API_URL, requestData, {
    headers: getAuthHeaders()
  })
  return response.data
}

export const getAllRequests = async (params = {}) => {
  const response = await axios.get(API_URL, {
    params,
    headers: getAuthHeaders()
  })
  return response.data
}

export const getRequestById = async (id) => {
  const response = await axios.get(`${API_URL}/${id}`, {
    headers: getAuthHeaders()
  })
  return response.data
}

export const updateRequest = async (id, requestData) => {
  const response = await axios.put(`${API_URL}/${id}`, requestData, {
    headers: getAuthHeaders()
  })
  return response.data
}

export const deleteRequest = async (id) => {
  const response = await axios.delete(`${API_URL}/${id}`, {
    headers: getAuthHeaders()
  })
  return response.data
}

export const submitRequest = async (id) => {
  const response = await axios.post(`${API_URL}/${id}/submit`, {}, {
    headers: getAuthHeaders()
  })
  return response.data
}

export const getRequestsByStatus = async (status, params = {}) => {
  const response = await axios.get(`${API_URL}/status/${status}`, {
    params,
    headers: getAuthHeaders()
  })
  return response.data
}

export const addAttachment = async (id, attachment) => {
  const response = await axios.post(`${API_URL}/${id}/attachment`, attachment, {
    headers: getAuthHeaders()
  })
  return response.data
}

export const removeAttachment = async (id, attachmentId) => {
  const response = await axios.delete(`${API_URL}/${id}/attachment/${attachmentId}`, {
    headers: getAuthHeaders()
  })
  return response.data
}
