const API_URL = import.meta.env.VITE_API_URL || 'https://kaamgar-api.onrender.com';

// Get token from localStorage
const getToken = () => localStorage.getItem('token');

// API request helper
const apiRequest = async (endpoint, options = {}) => {
  const token = getToken();

  const config = {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
  };

  const response = await fetch(`${API_URL}${endpoint}`, config);

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Request failed' }));
    throw new Error(error.message || 'Request failed');
  }

  return response.json();
};

// Auth API
export const authAPI = {
  register: (data) => apiRequest('/api/auth/register', {
    method: 'POST',
    body: JSON.stringify(data),
  }),

  login: (data) => apiRequest('/api/auth/login', {
    method: 'POST',
    body: JSON.stringify(data),
  }),

  getProfile: () => apiRequest('/api/auth/me'),

  updateProfile: (data) => apiRequest('/api/auth/me', {
    method: 'PUT',
    body: JSON.stringify(data),
  }),
};

// Workers API
export const workersAPI = {
  getAll: () => apiRequest('/api/workers'),

  getOne: (id) => apiRequest(`/api/workers/${id}`),

  create: (data) => apiRequest('/api/workers', {
    method: 'POST',
    body: JSON.stringify(data),
  }),

  update: (id, data) => apiRequest(`/api/workers/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  }),

  delete: (id) => apiRequest(`/api/workers/${id}`, {
    method: 'DELETE',
  }),

  toggleStatus: (id) => apiRequest(`/api/workers/${id}/toggle-status`, {
    method: 'PATCH',
  }),
};

// Attendance API
export const attendanceAPI = {
  getAll: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return apiRequest(`/api/attendance${query ? `?${query}` : ''}`);
  },

  getByDate: (date) => apiRequest(`/api/attendance/date/${date}`),

  mark: (data) => apiRequest('/api/attendance', {
    method: 'POST',
    body: JSON.stringify(data),
  }),

  bulkMark: (records) => apiRequest('/api/attendance/bulk', {
    method: 'POST',
    body: JSON.stringify({ records }),
  }),

  delete: (id) => apiRequest(`/api/attendance/${id}`, {
    method: 'DELETE',
  }),
};

// Advances API
export const advancesAPI = {
  getAll: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return apiRequest(`/api/advances${query ? `?${query}` : ''}`);
  },

  create: (data) => apiRequest('/api/advances', {
    method: 'POST',
    body: JSON.stringify(data),
  }),

  update: (id, data) => apiRequest(`/api/advances/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  }),

  delete: (id) => apiRequest(`/api/advances/${id}`, {
    method: 'DELETE',
  }),

  getWorkerMonthly: (workerId, month, year) =>
    apiRequest(`/api/advances/worker/${workerId}/monthly?month=${month}&year=${year}`),
};

// Holidays API
export const holidaysAPI = {
  getAll: (year) => apiRequest(`/api/holidays${year ? `?year=${year}` : ''}`),

  create: (data) => apiRequest('/api/holidays', {
    method: 'POST',
    body: JSON.stringify(data),
  }),

  update: (id, data) => apiRequest(`/api/holidays/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  }),

  delete: (id) => apiRequest(`/api/holidays/${id}`, {
    method: 'DELETE',
  }),
};

export default {
  auth: authAPI,
  workers: workersAPI,
  attendance: attendanceAPI,
  advances: advancesAPI,
  holidays: holidaysAPI,
};
