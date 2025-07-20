import api from './apiClient';
import API_CONFIG from '../config/api';

// Profile Service
export const profileService = {
  // Get user profile
  async getProfile() {
    try {
      const response = await api.get(API_CONFIG.ENDPOINTS.USER.PROFILE);
      
      if (response.data.success) {
        return {
          success: true,
          data: response.data.data,
          message: response.data.message,
        };
      } else {
        return {
          success: false,
          message: response.data.message || 'Failed to get profile',
        };
      }
    } catch (error) {
      console.error('Get profile error:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to get profile. Please try again.',
      };
    }
  },

  // Update user profile
  async updateProfile(profileData) {
    try {
      const response = await api.put(API_CONFIG.ENDPOINTS.USER.UPDATE_PROFILE, {
        fullName: profileData.fullName,
        doB: profileData.doB,
        gender: profileData.gender,
        phone: profileData.phone,
        address: profileData.address,
        avatarUrl: profileData.avatarUrl,
      });
      
      if (response.data.success) {
        return {
          success: true,
          message: response.data.message || 'Profile updated successfully.',
        };
      } else {
        return {
          success: false,
          message: response.data.message || 'Failed to update profile',
        };
      }
    } catch (error) {
      console.error('Update profile error:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to update profile. Please try again.',
      };
    }
  },

  // Get user courses
  async getMyCourses() {
    try {
      const response = await api.get(API_CONFIG.ENDPOINTS.USER.MY_COURSES);
      
      if (response.data.success) {
        return {
          success: true,
          data: response.data.data,
          message: response.data.message,
        };
      } else {
        return {
          success: false,
          message: response.data.message || 'Failed to get courses',
        };
      }
    } catch (error) {
      console.error('Get my courses error:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to get courses. Please try again.',
      };
    }
  },
};

export default profileService;
