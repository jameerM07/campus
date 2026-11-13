import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to attach JWT token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for token expiration
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      const currentPath = window.location.pathname;
      if (!currentPath.includes('/login') && !currentPath.includes('/register')) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      }
    }
    return Promise.reject(error);
  }
);

// Authentication API
export const authAPI = {
  login: (credentials) => api.post('/auth/login', credentials),
  registerStudent: (data) => api.post('/auth/student/register', data),
  registerOwner: (data) => api.post('/auth/owner/register', data),
  getCurrentUser: () => api.get('/auth/me'),
};

// Colleges API
export const collegeAPI = {
  getAllColleges: (params) => api.get('/colleges', { params }),
  getCollegeById: (id) => api.get(`/colleges/${id}`),
  getCities: () => api.get('/colleges/cities'),
  getStates: () => api.get('/colleges/states'),
  getDistricts: (state) => api.get('/colleges/districts', { params: { state } }),
  getTaluks: (state, district) => api.get('/colleges/taluks', { params: { state, district } }),
  getLocationHierarchy: () => api.get('/colleges/hierarchy'),
  getCollegesByCity: (city) => api.get('/colleges/by-city', { params: { city } }),
  getNearestColleges: (lat, lon) => api.get('/colleges/nearest', { params: { lat, lon } }),
};

// Properties API
export const propertyAPI = {
  searchProperties: (filters) => api.post('/properties/public/search', filters),
  getFeaturedProperties: () => api.get('/properties/public/featured'),
  getPropertyDetails: (id, userLat, userLng) => {
    const params = {};
    if (userLat) params.userLat = userLat;
    if (userLng) params.userLng = userLng;
    return api.get(`/properties/${id}`, { params });
  },
};

// Student API
export const studentAPI = {
  getDashboard: () => api.get('/student/dashboard'),
  createBooking: (data) => api.post('/student/bookings', data),
  getMyBookings: () => api.get('/student/bookings'),
  cancelBooking: (id) => api.patch(`/student/bookings/${id}/cancel`),
  toggleSaveProperty: (propertyId) => api.post(`/student/saved/${propertyId}`),
  getSavedProperties: () => api.get('/student/saved'),
  getNotifications: () => api.get('/student/notifications'),
  markNotificationRead: (id) => api.patch(`/student/notifications/${id}/read`),
  markAllNotificationsRead: () => api.patch('/student/notifications/read-all'),
};

// Owner API
export const ownerAPI = {
  getDashboard: () => api.get('/owner/dashboard'),
  getMyProperties: () => api.get('/owner/properties'),
  createProperty: (data) => api.post('/owner/properties', data),
  updateProperty: (id, data) => api.put(`/owner/properties/${id}`, data),
  deleteProperty: (id) => api.delete(`/owner/properties/${id}`),
  updateAvailability: (id, availableRooms) => api.patch(`/owner/properties/${id}/availability`, { availableRooms }),
  getIncomingBookings: () => api.get('/owner/bookings'),
  updateBookingStatus: (id, data) => api.patch(`/owner/bookings/${id}/status`, data),
  getNotifications: () => api.get('/owner/notifications'),
};

// Admin API
export const adminAPI = {
  getDashboard: () => api.get('/admin/dashboard'),
  getAllProperties: () => api.get('/admin/properties'),
  getPendingProperties: () => api.get('/admin/properties/pending'),
  approveProperty: (id) => api.patch(`/admin/properties/${id}/approve`),
  rejectProperty: (id, reason) => api.patch(`/admin/properties/${id}/reject`, { reason }),
  removeProperty: (id) => api.delete(`/admin/properties/${id}`),
  getAllStudents: () => api.get('/admin/students'),
  getAllOwners: () => api.get('/admin/owners'),
  getVerifications: () => api.get('/admin/verifications'),
  verifyOwner: (id, approved, reason) => api.patch(`/admin/verifications/${id}/verify`, { approved, reason }),
  updateUserStatus: (id, status) => api.patch(`/admin/users/${id}/status`, { status }),
  getAllBookings: () => api.get('/admin/bookings'),
};

// File Upload API
export const uploadAPI = {
  uploadFile: (file) => {
    const formData = new FormData();
    formData.append('file', file);
    return api.post('/uploads', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },
};

export default api;

