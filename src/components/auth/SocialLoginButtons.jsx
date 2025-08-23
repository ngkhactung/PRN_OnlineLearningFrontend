import React, { useState } from 'react';
import { toast } from 'react-toastify';
import authService from '../../services/authService';

const SocialLoginButtons = () => {
  const [loading, setLoading] = useState({
    google: false,
    facebook: false,
    microsoft: false
  });

  const handleSocialLogin = async (provider, serviceFunction) => {
    setLoading(prev => ({ ...prev, [provider]: true }));
    
    try {
      const result = await serviceFunction();
      
      if (result.success) {
        // Redirect to OAuth provider
        window.location.href = result.loginUrl;
      } else {
        toast.error(result.message || `${provider} login failed`);
      }
    } catch (error) {
      console.error(`${provider} login error:`, error);
      toast.error(`Failed to initiate ${provider} login`);
    } finally {
      setLoading(prev => ({ ...prev, [provider]: false }));
    }
  };

  const handleGoogleLogin = () => {
    handleSocialLogin('google', () => authService.initiateGoogleLogin());
  };

  const handleFacebookLogin = () => {
    handleSocialLogin('facebook', () => authService.initiateFacebookLogin());
  };

  const handleMicrosoftLogin = () => {
    handleSocialLogin('microsoft', () => authService.initiateMicrosoftLogin());
  };

  return (
    <div className="space-y-3">
      {/* Google Login Button */}
      <button
        onClick={handleGoogleLogin}
        disabled={loading.google}
        className="inline-flex w-full justify-center items-center rounded-md border border-gray-300 bg-white py-2 px-4 text-sm font-medium text-gray-500 shadow-sm hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading.google ? (
          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-orange-500 mr-2"></div>
        ) : (
          <svg
            className="h-5 w-5 text-orange-500 mr-2"
            aria-hidden="true"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z" />
          </svg>
        )}
        {loading.google ? 'Connecting...' : 'Continue with Google'}
      </button>

      {/* Facebook Login Button */}
      <button
        onClick={handleFacebookLogin}
        disabled={loading.facebook}
        className="inline-flex w-full justify-center items-center rounded-md border border-gray-300 bg-[#1877f2] py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-[#166fe5] disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading.facebook ? (
          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
        ) : (
          <svg
            className="h-5 w-5 mr-2"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
          </svg>
        )}
        {loading.facebook ? 'Connecting...' : 'Continue with Facebook'}
      </button>

      {/* Microsoft Login Button */}
      <button
        onClick={handleMicrosoftLogin}
        disabled={loading.microsoft}
        className="inline-flex w-full justify-center items-center rounded-md border border-gray-300 bg-[#0078d4] py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-[#106ebe] disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading.microsoft ? (
          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
        ) : (
          <svg
            className="h-5 w-5 mr-2"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path d="M11.4 24H0V12.6h11.4V24zM24 24H12.6V12.6H24V24zM11.4 11.4H0V0h11.4v11.4zM24 11.4H12.6V0H24v11.4z"/>
          </svg>
        )}
        {loading.microsoft ? 'Connecting...' : 'Continue with Microsoft'}
      </button>
    </div>
  );
};

export default SocialLoginButtons;
