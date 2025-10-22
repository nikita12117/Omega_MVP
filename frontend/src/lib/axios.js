import axios from 'axios';

const API_BASE = `${process.env.REACT_APP_BACKEND_URL}/api`;

// Create axios instance with default config
const apiClient = axios.create({
  baseURL: API_BASE,
  withCredentials: true, // Send cookies with requests
});

// Request interceptor to add Authorization header
apiClient.interceptors.request.use(
  (config) => {
    // Get token from localStorage
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

// Response interceptor to handle common errors
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const errorType = error.response?.headers?.['x-error-type'];
    
    // Handle 401 Unauthorized
    if (error.response?.status === 401) {
      // Check if it's a demo expiry error
      if (errorType === 'demo_expired') {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        localStorage.removeItem('omega_tokens');
        
        // Redirect to /demo which will show DemoExpiredPanel
        if (!window.location.pathname.includes('/demo')) {
          window.location.href = '/demo';
        }
      } else {
        // Regular unauthorized - redirect to login
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        localStorage.removeItem('omega_tokens');
        
        if (!window.location.pathname.includes('/login')) {
          window.location.href = '/login';
        }
      }
    }
    
    // Handle 403 Forbidden - phone verification required
    if (error.response?.status === 403 && errorType === 'phone_verification_required') {
      // Don't redirect, let the page handle showing phone verification modal
      // The error will be caught by the calling component
    }
    
    return Promise.reject(error);
  }
);

export default apiClient;
