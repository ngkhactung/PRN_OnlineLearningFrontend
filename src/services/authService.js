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

// Auth Service
export const authService = {
  // Login function
  async login(credentials) {
    try {
      const response = await api.post(API_CONFIG.ENDPOINTS.AUTH.LOGIN, {
        email: credentials.email,
        password: credentials.password,
      });
      
      if (response.data.success) {
        const { token, user } = response.data.data;
        
        // Store token and user info
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(user));
        
        return {
          success: true,
          data: response.data.data,
          message: response.data.message,
        };
      } else {
        return {
          success: false,
          message: response.data.message || 'Login failed',
        };
      }
    } catch (error) {
      console.error('Login error:', error);
      // Handle backend error response format
      if (error.response?.data) {
        return {
          success: false,
          message: error.response.data.message || 'Login failed. Please try again.',
        };
      }
      return {
        success: false,
        message: 'Network error. Please check your connection and try again.',
      };
    }
  },

  // Register function (step 1: send OTP)
  async register(userData) {
    try {
      const response = await api.post(API_CONFIG.ENDPOINTS.AUTH.REGISTER, {
        fullname: userData.fullname,
        email: userData.email,
        password: userData.password,
      });
      
      if (response.data.success) {
        return {
          success: true,
          message: response.data.message || 'OTP has been sent to your email.',
        };
      } else {
        return {
          success: false,
          message: response.data.message || 'Registration failed',
        };
      }
    } catch (error) {
      console.error('Registration error:', error);
      if (error.response?.data) {
        return {
          success: false,
          message: error.response.data.message || 'Registration failed. Please try again.',
        };
      }
      return {
        success: false,
        message: 'Network error. Please check your connection and try again.',
      };
    }
  },

  // Verify registration with OTP
  async verifyRegister(verifyData) {
    try {
      const response = await api.post(API_CONFIG.ENDPOINTS.AUTH.VERIFY_REGISTER, {
        email: verifyData.email,
        otpCode: verifyData.otpCode,
        fullName: verifyData.fullName,
        password: verifyData.password,
      });
      
      if (response.data.success) {
        const { token, user } = response.data.data;
        
        // Store token and user info
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(user));
        
        return {
          success: true,
          data: response.data.data,
          message: response.data.message || 'Account created successfully.',
        };
      } else {
        return {
          success: false,
          message: response.data.message || 'Verification failed',
        };
      }
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Verification failed. Please try again.',
      };
    }
  },

  // Forgot password
  async forgotPassword(email) {
    try {
      const response = await api.post(API_CONFIG.ENDPOINTS.AUTH.FORGOT_PASSWORD, {
        email: email,
      });
      
      if (response.data.success) {
        return {
          success: true,
          message: response.data.message || 'OTP has been sent to your email.',
        };
      } else {
        return {
          success: false,
          message: response.data.message || 'Failed to send OTP',
        };
      }
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to send OTP. Please try again.',
      };
    }
  },

  // Verify forgot password OTP
  async verifyForgotPassword(verifyData) {
    try {
      const response = await api.post(API_CONFIG.ENDPOINTS.AUTH.VERIFY_FORGOT_PASSWORD, {
        email: verifyData.email,
        otpCode: verifyData.otpCode,
      });
      
      if (response.data.success) {
        return {
          success: true,
          message: response.data.message || 'OTP verified successfully.',
        };
      } else {
        return {
          success: false,
          message: response.data.message || 'OTP verification failed',
        };
      }
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Verification failed. Please try again.',
      };
    }
  },

  // Change password
  async changePassword(passwordData) {
    try {
      const response = await api.post(API_CONFIG.ENDPOINTS.AUTH.CHANGE_PASSWORD, {
        email: passwordData.email,
        newPassword: passwordData.newPassword,
        confirmNewPassword: passwordData.confirmNewPassword,
      });
      
      if (response.data.success) {
        return {
          success: true,
          message: response.data.message || 'Password changed successfully.',
        };
      } else {
        return {
          success: false,
          message: response.data.message || 'Failed to change password',
        };
      }
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to change password. Please try again.',
      };
    }
  },

  // Send OTP
  async sendOtp(email) {
    try {
      const response = await api.post(API_CONFIG.ENDPOINTS.AUTH.SEND_OTP, {
        email: email,
      });
      
      if (response.data.success) {
        return {
          success: true,
          message: response.data.message || 'A new OTP has been sent to your email.',
        };
      } else {
        return {
          success: false,
          message: response.data.message || 'Failed to send OTP',
        };
      }
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to send OTP. Please try again.',
      };
    }
  },

  // Utility functions
  getToken() {
    return localStorage.getItem('token');
  },

  getCurrentUser() {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  },

  isAuthenticated() {
    return !!this.getToken();
  },

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/auth';
  },
};

export default authService;
