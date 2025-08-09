import axios from 'axios';
import API_CONFIG from '../config/api';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_CONFIG.BASE_URL,
  timeout: API_CONFIG.TIMEOUT,
  headers: API_CONFIG.DEFAULT_HEADERS,
});

// Store reference to auth context update function
let authContextUpdateFunction = null;

// Function to set auth context update function
export const setAuthContextUpdate = (updateFunction) => {
  authContextUpdateFunction = updateFunction;
};

// Function to handle 401 - Unauthorized
const handle401 = () => {
  // Clear localStorage
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  
  // Update auth context
  if (authContextUpdateFunction) {
    authContextUpdateFunction(false);
  }
  
  // Redirect to login
  window.location.href = '/auth';
};

// Function to handle 403 - Forbidden
const handle403 = () => {
  // Redirect to access denied page
  window.location.href = '/access-denied';
};

// Add request interceptor to include auth token
api.interceptors.request.use(
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

// Add response interceptor to handle responses
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Check HTTP status codes
    if (error.response?.status === 401) {
      handle401();
    } else if (error.response?.status === 403) {
      handle403();
    }
    
    return Promise.reject(error);
  }
);

export { api };
export default api;
