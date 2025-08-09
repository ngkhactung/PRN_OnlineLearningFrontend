# Authentication Integration Guide

## Overview
This guide explains how to integrate the React frontend with the .NET backend for authentication.

## Backend API Information
- **Repository**: `nguyen-khac-tung/online-learning`
- **Technology**: .NET Core with C#
- **Authentication**: JWT Token-based

## API Endpoints

### Authentication
- `POST /api/Auth/Login` - User login
- `POST /api/Auth/Register` - User registration (sends OTP)
- `POST /api/Auth/VerifyRegister` - Verify registration with OTP
- `POST /api/Auth/ForgotPassword` - Request password reset OTP
- `POST /api/Auth/VerifyForgotPassword` - Verify password reset OTP
- `POST /api/Auth/ChangePassword` - Change password
- `POST /api/Auth/SendOtp` - Resend OTP

## Configuration

### 1. API Base URL
Update the `API_CONFIG.BASE_URL` in `src/config/api.js`:
```javascript
export const API_CONFIG = {
  BASE_URL: 'http://localhost:5000/api', // Change this to your backend URL
  // ... other config
};
```

### 2. CORS Configuration
Make sure your backend allows CORS from your frontend domain.

## Request/Response Format

### Login Request
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

### Register Request
```json
{
  "fullName": "John Doe",
  "email": "user@example.com",
  "password": "password123"
}
```

### Verify Register Request
```json
{
  "email": "user@example.com",
  "otpCode": "123456",
  "fullName": "John Doe",
  "password": "password123"
}
```

### Response Format
```json
{
  "success": true,
  "message": "Success message",
  "data": {
    "token": "jwt-token-here",
    "user": {
      // user data
    }
  }
}
```

## Components

### 1. AuthService (`src/services/authService.js`)
- Handles all authentication API calls
- Manages JWT token storage
- Provides authentication methods

### 2. AuthContext (`src/contexts/AuthContext.jsx`)
- Global state management for authentication
- Provides hooks for components

### 3. ProtectedRoute (`src/components/common/ProtectedRoute.jsx`)
- Protects routes that require authentication
- Redirects to login if not authenticated

### 4. Auth Component (`src/pages/auth/Auth.jsx`)
- Main authentication page
- Handles login and registration
- Integrates with OTP verification

### 5. OTPVerification (`src/components/auth/OTPVerification.jsx`)
- Handles OTP verification for registration
- Supports resend functionality

### 6. ForgotPassword (`src/components/auth/ForgotPassword.jsx`)
- Handles password reset flow
- Multi-step process with OTP verification

## Usage

### Using Authentication Context
```jsx
import { useAuth } from '../contexts/AuthContext';

function MyComponent() {
  const { user, isAuthenticated, login, logout } = useAuth();

  if (!isAuthenticated) {
    return <div>Please login</div>;
  }

  return <div>Welcome, {user.name}!</div>;
}
```

### Protected Routes
```jsx
import ProtectedRoute from './components/common/ProtectedRoute';

<Route 
  path="/dashboard" 
  element={
    <ProtectedRoute>
      <Dashboard />
    </ProtectedRoute>
  } 
/>
```

## Features

### ✅ Implemented
- [x] User login with email/password
- [x] User registration with OTP verification
- [x] Password reset with OTP
- [x] JWT token management
- [x] Auto-logout on token expiry
- [x] Protected routes
- [x] Remember me functionality
- [x] Form validation
- [x] Error handling
- [x] Loading states

### 🔄 Authentication Flow

#### Registration Flow
1. User fills registration form
2. Frontend sends registration request to backend
3. Backend sends OTP to user's email
4. User enters OTP code
5. Frontend verifies OTP with backend
6. Backend creates account and returns JWT token
7. Frontend stores token and redirects to dashboard

#### Login Flow
1. User fills login form
2. Frontend sends login request to backend
3. Backend validates credentials and returns JWT token
4. Frontend stores token and redirects to dashboard

#### Password Reset Flow
1. User clicks "Forgot Password"
2. User enters email address
3. Backend sends OTP to user's email
4. User enters OTP code
5. Frontend verifies OTP with backend
6. User enters new password
7. Backend updates password

## Security Features

- JWT token stored in localStorage
- Automatic token refresh handling
- Auto-logout on 401 responses
- Form validation with Ant Design
- Password strength requirements
- OTP verification for sensitive operations

## Installation

1. Make sure you have the backend running
2. Update `API_CONFIG.BASE_URL` in `src/config/api.js`
3. Install dependencies: `npm install`
4. Run the application: `npm run dev`

## Backend Requirements

Make sure your backend:
1. Has CORS enabled for your frontend domain
2. Returns proper error messages
3. Follows the expected request/response format
4. Handles JWT token validation properly

## Troubleshooting

### Common Issues

1. **CORS Error**: Make sure backend allows requests from frontend domain
2. **401 Unauthorized**: Check if JWT token is properly sent in Authorization header
3. **Network Error**: Verify backend URL is correct and backend is running
4. **OTP Issues**: Check email configuration in backend

### Debug Tips

1. Check browser console for errors
2. Use browser dev tools Network tab to inspect API calls
3. Verify localStorage contains token after login
4. Check if backend returns expected response format
