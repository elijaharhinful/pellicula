import axios from 'axios';

// API base URL from environment variables with fallback to localhost
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api/v1';

// Create axios instance with base configuration
const api = axios.create({
  baseURL: API_BASE_URL,
});

/**
 * Request interceptor to automatically add authentication token to all requests
 * Retrieves JWT token from localStorage and adds it to Authorization header
 */
api.interceptors.request.use((config) => {
  // Get JWT token from localStorage
  const token = localStorage.getItem('token');
  if (token) {
    // Add Bearer token to Authorization header
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;