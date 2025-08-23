import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useAuth } from '../../contexts/AuthContext';
import authService from '../../services/authService';
import { ExternalLoginType } from '../../constants/enums';
import LoadingSpinner from '../common/LoadingSpinner';

const FacebookCallback = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { updateAuthState } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const handleCallback = async () => {
      try {
        const params = authService.parseCallbackParams(location.search);
        
        if (params.error) {
          setError(params.error_description || 'Facebook login was cancelled');
          setLoading(false);
          return;
        }

        if (!params.code) {
          setError('Authorization code not received');
          setLoading(false);
          return;
        }

        const result = await authService.handleLoginCallback(
          ExternalLoginType.FACEBOOK,
          params.code,
          params.state
        );

        if (result.success) {
          updateAuthState(true);
          toast.success('Facebook login successful!');
          
          // Check user role and redirect
          const user = localStorage.getItem('user');
          let isAdmin = false;
          if (user) {
            try {
              const parsed = JSON.parse(user);
              if (parsed.role && parsed.role === 'Admin') isAdmin = true;
              if (parsed.roles && Array.isArray(parsed.roles) && parsed.roles.includes('Admin')) isAdmin = true;
            } catch {}
          }
          
          navigate(isAdmin ? '/admin' : '/');
        } else {
          setError(result.message || 'Facebook login failed');
        }
      } catch (error) {
        console.error('Facebook callback error:', error);
        setError('Failed to process Facebook login');
      } finally {
        setLoading(false);
      }
    };

    handleCallback();
  }, [location, navigate, updateAuthState]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10 text-center">
            <LoadingSpinner />
            <p className="mt-4 text-sm text-gray-600">Processing Facebook login...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10 text-center">
            <div className="text-red-600 mb-4">
              <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.268 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Login Failed</h3>
            <p className="text-sm text-gray-600 mb-4">{error}</p>
            <button
              onClick={() => navigate('/auth')}
              className="inline-flex justify-center rounded-md border border-transparent bg-orange-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-orange-700"
            >
              Back to Login
            </button>
          </div>
        </div>
      </div>
    );
  }

  return null;
};

export default FacebookCallback;
