// ============================================
// ENHANCED AXIOS INSTANCE
// Auto token refresh & error handling
// ============================================

import axios from 'axios';

// API Base URL - Check multiple env variable names for flexibility
// Supports: VITE_API_URL or VITE_API_BASE_URL
const getApiUrl = () => {
  const envUrl = import.meta.env.VITE_API_URL || import.meta.env.VITE_API_BASE_URL;
  if (envUrl) {
    // Remove trailing slash if present
    const cleanUrl = envUrl.replace(/\/$/, '');
    // Add /api if not already present
    return cleanUrl.endsWith('/api') ? cleanUrl : `${cleanUrl}/api`;
  }
  return 'http://localhost:5000/api';
};

const API_BASE_URL = getApiUrl();
console.log('🌐 API Base URL:', API_BASE_URL); // Helpful for debugging

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true, // Send cookies
});

// Request Interceptor - Add token to all requests
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response Interceptor - Auto refresh token on 401
axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    // If 401 and not already retried
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // Try to refresh token
        const response = await axios.post(
          `${API_BASE_URL}/auth/refresh`,
          {},
          { withCredentials: true }
        );

        const newToken = response.data.data?.accessToken || response.data.accessToken;

        if (newToken) {
          localStorage.setItem('token', newToken);
          originalRequest.headers.Authorization = `Bearer ${newToken}`;
          return axiosInstance(originalRequest);
        }
      } catch (refreshError) {
        // Refresh failed, clear auth and redirect to login
        localStorage.removeItem('token');
        localStorage.removeItem('role');
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;

