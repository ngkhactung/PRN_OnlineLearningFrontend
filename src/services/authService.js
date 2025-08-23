import api, { setAuthContextUpdate } from './apiClient';
import API_CONFIG from '../config/api';
import { ExternalLoginType } from '../constants/enums';

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

  // Social Login Methods
  // Get login URL for social provider
  async getLoginUrl(loginType) {
    try {
      const response = await api.get(`${API_CONFIG.ENDPOINTS.AUTH.GET_LOGIN_URL}/${loginType}`);
      
      if (response.data.success) {
        return {
          success: true,
          loginUrl: response.data.data,
          message: response.data.message
        };
      } else {
        return {
          success: false,
          message: response.data.message || 'Failed to get login URL'
        };
      }
    } catch (error) {
      console.error('Get login URL error:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to get login URL. Please try again.'
      };
    }
  },

  // Handle login callback
  async handleLoginCallback(loginType, code, state) {
    try {
      const response = await api.post(API_CONFIG.ENDPOINTS.AUTH.LOGIN_CALLBACK, {
        loginType: loginType,
        code: code,
        state: state
      });
      
      if (response.data.success) {
        const { token, user } = response.data.data;
        
        // Store token and user info
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(user));
        
        return {
          success: true,
          data: response.data.data,
          message: response.data.message || 'Login successful'
        };
      } else {
        return {
          success: false,
          message: response.data.message || 'Social login failed'
        };
      }
    } catch (error) {
      console.error('Social login callback error:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Social login failed. Please try again.'
      };
    }
  },

  // Initiate Google login
  async initiateGoogleLogin() {
    return this.getLoginUrl(ExternalLoginType.GOOGLE);
  },

  // Initiate Facebook login
  async initiateFacebookLogin() {
    return this.getLoginUrl(ExternalLoginType.FACEBOOK);
  },

  // Initiate Microsoft login
  async initiateMicrosoftLogin() {
    return this.getLoginUrl(ExternalLoginType.MICROSOFT);
  },

  // Parse callback URL parameters
  parseCallbackParams(url) {
    const urlParams = new URLSearchParams(url.split('?')[1]);
    return {
      code: urlParams.get('code'),
      state: urlParams.get('state'),
      error: urlParams.get('error'),
      error_description: urlParams.get('error_description')
    };
  },
};

export { setAuthContextUpdate };
export default authService;
