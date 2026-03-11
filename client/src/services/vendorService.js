import axios from "axios";

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000'
const API_URL = `${API_BASE}/api/vendors`;

const getAuthHeaders = () => {
  const token = localStorage.getItem("token");
  return { Authorization: `Bearer ${token}` };
};

export const getAllVendors = async (params = {}) => {
  try {
    const response = await axios.get(API_URL, {
      headers: getAuthHeaders(),
      params, // This will send category and limit as query params
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching vendors:", error);
    throw error;
  }
};

export const getVendorById = async (id) => {
  const response = await axios.get(`${API_URL}/${id}`, {
    headers: getAuthHeaders(),
  });
  return response.data;
};

export const updateVendorProfile = async (id, vendorData) => {
  const response = await axios.put(`${API_URL}/${id}`, vendorData, {
    headers: getAuthHeaders(),
  });
  return response.data;
};

export const getVendorOrders = async (id, params = {}) => {
  const response = await axios.get(`${API_URL}/${id}/orders`, {
    params,
    headers: getAuthHeaders(),
  });
  return response.data;
};

export const updateOrderStatus = async (
  vendorId,
  orderId,
  status,
  trackingNumber = "",
) => {
  const response = await axios.post(
    `${API_URL}/${vendorId}/orders/${orderId}/status`,
    { status, trackingNumber },
    { headers: getAuthHeaders() },
  );
  return response.data;
};

export const getVendorAnalytics = async (id) => {
  const response = await axios.get(`${API_URL}/${id}/analytics`, {
    headers: getAuthHeaders(),
  });
  return response.data;
};

export const getRatingAndReview = async (id) => {
  const response = await axios.get(`${API_URL}/${id}/rating`, {
    headers: getAuthHeaders(),
  });
  return response.data;
};

export const searchVendors = async (keyword, category = "") => {
  const response = await axios.get(`${API_URL}/search`, {
    params: { keyword, category },
    headers: getAuthHeaders(),
  });
  return response.data;
};
