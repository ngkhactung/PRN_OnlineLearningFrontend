import api from './apiClient';
import API_CONFIG from '../config/api';

// Cart Service
export const cartService = {
  // Get all cart items for the current user
  async getCartItems() {
    try {
      const response = await api.get(API_CONFIG.ENDPOINTS.CART.GET_CART_ITEMS);
      
      if (response.data.success) {
        // Update user data in localStorage
        const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
        if (currentUser.userId) {
          currentUser.courseCartItems = response.data.data || [];
          localStorage.setItem('user', JSON.stringify(currentUser));
        }
        
        return {
          success: true,
          data: response.data.data,
          message: response.data.message,
        };
      } else {
        return {
          success: false,
          message: response.data.message || 'Failed to get cart items',
        };
      }
    } catch (error) {
      console.error('Get cart items error:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to get cart items. Please try again.',
      };
    }
  },

  // Add a course to cart
  async addCartItem(cartRequest) {
    try {
      const response = await api.post(
        API_CONFIG.ENDPOINTS.CART.ADD_CART_ITEM,
        cartRequest
      );
      
      if (response.data.success) {
        // Update user data in localStorage
        const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
        if (currentUser.userId) {
          currentUser.courseCartItems = currentUser.courseCartItems || [];
          currentUser.courseCartItems.push(response.data.data);
          localStorage.setItem('user', JSON.stringify(currentUser));
        }
        
        return {
          success: true,
          data: response.data.data,
          message: response.data.message || 'Course added to cart successfully.',
        };
      } else {
        return {
          success: false,
          message: response.data.message || 'Failed to add course to cart',
        };
      }
    } catch (error) {
      console.error('Add cart item error:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to add course to cart. Please try again.',
      };
    }
  },

  // Delete a cart item
  async deleteCartItem(cartItemId) {
    try {
      const response = await api.delete(
        `${API_CONFIG.ENDPOINTS.CART.DELETE_CART_ITEM}/${cartItemId}`
      );
      
      if (response.data.success) {
        // Update user data in localStorage
        const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
        if (currentUser.userId && currentUser.courseCartItems) {
          currentUser.courseCartItems = currentUser.courseCartItems.filter(
            item => item.cartItemId !== cartItemId
          );
          localStorage.setItem('user', JSON.stringify(currentUser));
        }
        
        return {
          success: true,
          message: response.data.message || 'Cart item has been deleted successfully.',
        };
      } else {
        return {
          success: false,
          message: response.data.message || 'Failed to delete cart item',
        };
      }
    } catch (error) {
      console.error('Delete cart item error:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to delete cart item. Please try again.',
      };
    }
  },

  // Utility function to check if course is in cart
  isInCart(courseId) {
    const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
    if (currentUser.courseCartItems) {
      return currentUser.courseCartItems.some(item => item.courseId === courseId);
    }
    return false;
  },

  // Get cart items count
  getCartCount() {
    const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
    return currentUser.courseCartItems ? currentUser.courseCartItems.length : 0;
  },
};

export default cartService;
