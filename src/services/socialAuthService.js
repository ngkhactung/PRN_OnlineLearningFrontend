import api from './apiClient';
import API_CONFIG from '../config/api';
import { ExternalLoginType } from '../constants/enums';

export const socialAuthService = {
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
    return socialAuthService.getLoginUrl(ExternalLoginType.GOOGLE);
  },

  // Initiate Facebook login
  async initiateFacebookLogin() {
    return socialAuthService.getLoginUrl(ExternalLoginType.FACEBOOK);
  },

  // Initiate Microsoft login
  async initiateMicrosoftLogin() {
    return socialAuthService.getLoginUrl(ExternalLoginType.MICROSOFT);
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
  }
};

export default socialAuthService;
