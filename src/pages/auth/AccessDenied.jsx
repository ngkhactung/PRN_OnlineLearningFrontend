import React from 'react';
import { Result, Button } from 'antd';
import { useNavigate } from 'react-router-dom';

const AccessDenied = () => {
  const navigate = useNavigate();

  const handleBackHome = () => {
    navigate('/');
  };

  const handleLogin = () => {
    navigate('/auth');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <Result
        status="403"
        title="403"
        subTitle="Sorry, you are not authorized to access this page."
        extra={
          <div className="space-x-4">
            <Button
            type="primary"
            htmlType="submit"
            className="w-full mt-3 !bg-orange-600 !hover:bg-orange-700 !border-orange-600"
            size="large" 
            onClick={handleBackHome}
            >
              Back Home
            </Button>
          </div>
        }
      />
    </div>
  );
};

export default AccessDenied;