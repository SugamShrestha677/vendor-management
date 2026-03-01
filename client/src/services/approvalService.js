import axios from 'axios'

const API_URL = 'http://localhost:5000/api/approvals'

const getAuthHeaders = () => {
  const token = localStorage.getItem('token')
  return { Authorization: `Bearer ${token}` }
}

export const getPendingApprovals = async (params = {}) => {
  const response = await axios.get(`${API_URL}/pending`, {
    params,
    headers: getAuthHeaders()
  })
  return response.data
}

export const getApprovalById = async (id) => {
  const response = await axios.get(`${API_URL}/${id}`, {
    headers: getAuthHeaders()
  })
  return response.data
}

export const approveRequest = async (id, comment = '') => {
  const response = await axios.post(`${API_URL}/${id}/approve`, { comment }, {
    headers: getAuthHeaders()
  })
  return response.data
}

export const rejectRequest = async (id, rejectionReason) => {
  const response = await axios.post(`${API_URL}/${id}/reject`, { rejectionReason }, {
    headers: getAuthHeaders()
  })
  return response.data
}

export const getApprovalHistory = async (requestId) => {
  const response = await axios.get(`${API_URL}/${requestId}/history`, {
    headers: getAuthHeaders()
  })
  return response.data
}

export const bulkApprove = async (approvalIds) => {
  const response = await axios.post(`${API_URL}/bulk/approve`, { approvalIds }, {
    headers: getAuthHeaders()
  })
  return response.data
}

export const delegateApproval = async (id, delegateToUserId) => {
  const response = await axios.post(`${API_URL}/${id}/delegate`, { delegateToUserId }, {
    headers: getAuthHeaders()
  })
  return response.data
}
