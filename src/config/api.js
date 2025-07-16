// API Configuration
export const API_CONFIG = {
  // Change this to your actual backend URL
  BASE_URL: 'https://localhost:5000/api', // Match your backend URL
  
  // API Endpoints
  ENDPOINTS: {
    AUTH: {
      LOGIN: '/Auth/Login',
      REGISTER: '/Auth/Register',
      VERIFY_REGISTER: '/Auth/VerifyRegister',
      FORGOT_PASSWORD: '/Auth/ForgotPassword',
      VERIFY_FORGOT_PASSWORD: '/Auth/VerifyForgotPassword',
      CHANGE_PASSWORD: '/Auth/ChangePassword',
      SEND_OTP: '/Auth/SendOtp',
    },
    COURSES: {
      GET_ALL: '/Courses',
      GET_BY_ID: '/Courses',
      CREATE: '/Courses',
      UPDATE: '/Courses',
      DELETE: '/Courses',
    },
    CATEGORIES: {
      GET_ALL: '/Categories',
      GET_BY_ID: '/Categories',
    },
    USER: {
      PROFILE: '/User/Profile',
      UPDATE_PROFILE: '/User/UpdateProfile',
      MY_COURSES: '/User/MyCourses',
    },
  },
  
  // HTTP Status Codes
  STATUS_CODES: {
    OK: 200,
    CREATED: 201,
    BAD_REQUEST: 400,
    UNAUTHORIZED: 401,
    FORBIDDEN: 403,
    NOT_FOUND: 404,
    INTERNAL_SERVER_ERROR: 500,
  },
  
  // Request timeout (in milliseconds)
  TIMEOUT: 10000,
  
  // Default headers
  DEFAULT_HEADERS: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
};

export default API_CONFIG;
