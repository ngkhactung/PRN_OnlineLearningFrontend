import React, { useState } from 'react';
import { Button, Form, Input, notification } from 'antd';
import { toast, ToastContainer } from 'react-toastify';
import { LockOutlined, EyeInvisibleOutlined, EyeTwoTone, CheckCircleOutlined, CloseCircleOutlined } from '@ant-design/icons';
import authService from '../../services/authService';

function ChangePassword() {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (values) => {
    setLoading(true);
    try {
      // Get user data from localStorage
      const userData = authService.getCurrentUser();
      
      const result = await authService.changePassword({
        email: userData?.email,
        newPassword: values.newPassword,
        confirmNewPassword: values.confirmPassword, // Map form field to API field
      });

      if (result.success) {
        toast.success(result.message);
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      toast.error(result.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200">
      <div className="p-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Change Password</h2>
            <p className="text-gray-600 mt-1">Update your password to keep your account secure</p>
          </div>
          <div className="hidden md:flex items-center space-x-2 text-orange-600">
            <LockOutlined className="text-lg" />
            <span className="text-sm font-medium">Security</span>
          </div>
        </div>

        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          className="space-y-4"
        >
          {/* New Password */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <label className="block text-sm font-semibold text-gray-800 mb-3">
              New Password
            </label>
            <Form.Item
              name="newPassword"
              label="New Password"
              rules={[
                { required: true, message: 'Please enter your new password' },
                { min: 6, message: 'Password must be at least 6 characters' },
              ]}
            >
              <Input.Password
                placeholder="Enter your new password"
                className="h-12 rounded-lg border-gray-300 focus:border-orange-500 focus:ring-orange-500"
                iconRender={(visible) => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
              />
            </Form.Item>

            <Form.Item
              name="confirmPassword"
              label="Confirm New Password"
              dependencies={['newPassword']}
              rules={[
                { required: true, message: 'Please confirm your new password' },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || getFieldValue('newPassword') === value) {
                      return Promise.resolve();
                    }
                    return Promise.reject(new Error('Passwords do not match'));
                  },
                }),
              ]}
            >
              <Input.Password
                placeholder="Confirm your new password"
                className="h-12 rounded-lg border-gray-300 focus:border-orange-500 focus:ring-orange-500"
                iconRender={(visible) => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
              />
            </Form.Item>
          </div>

          {/* Password Requirements */}
          <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
            <h4 className="text-sm font-semibold text-blue-800 mb-2">Password Requirements:</h4>
            <ul className="text-sm text-blue-700 space-y-1">
              <li className="flex items-center space-x-2">
                <CheckCircleOutlined className="text-green-500" />
                <span>At least 6 characters long</span>
              </li>
              <li className="flex items-center space-x-2">
                <CheckCircleOutlined className="text-green-500" />
                <span>Contains a mix of letters and numbers</span>
              </li>
              <li className="flex items-center space-x-2">
                <CheckCircleOutlined className="text-green-500" />
                <span>Different from your current password</span>
              </li>
            </ul>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end pt-4 border-t border-gray-200">
            <Form.Item className="mb-0">
              <Button
                type="primary"
                htmlType="submit"
                loading={loading}
                icon={<LockOutlined />}
                className="h-12 px-8 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 border-none rounded-lg shadow-md hover:shadow-lg transition-all duration-200 transform hover:scale-105"
              >
                {loading ? 'Changing...' : 'Change Password'}
              </Button>
            </Form.Item>
          </div>
        </Form>
      </div>

      {/* Toast Container */}
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </div>
  );
}

export default ChangePassword;
