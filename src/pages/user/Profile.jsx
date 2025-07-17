import React, { useState, useEffect } from 'react';
import { Button, Form, Input, Radio, DatePicker, Avatar, notification } from 'antd';
import { toast, ToastContainer } from 'react-toastify';
import { UserOutlined, LockOutlined, EditOutlined, SaveOutlined, CheckCircleOutlined, CloseCircleOutlined } from '@ant-design/icons';
import { useAuth } from '../../contexts/AuthContext';
import authService from '../../services/authService';
import ChangePassword from './ChangePassword';
import dayjs from 'dayjs';

function Profile() {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [profileData, setProfileData] = useState(null);
  const [activeTab, setActiveTab] = useState('profile');

  useEffect(() => {
      fetchProfile();
  });

  const fetchProfile = async () => {
    try {
      const result = await authService.getProfile();
      if (result.success) {
        setProfileData(result.data);
        // Set form values
        form.setFieldsValue({
          fullName: result.data.fullName,
          doB: result.data.doB ? dayjs(result.data.doB) : null,
          gender: result.data.gender !== null ? result.data.gender : undefined,
          phone: result.data.phone,
          address: result.data.address,
        });
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      toast.error('Failed to load profile data');
    }
  };

  const handleSubmit = async (values) => {
    setLoading(true);
    try {
      const profileUpdateData = {
        fullName: values.fullName,
        doB: values.doB ? values.doB.format('YYYY-MM-DD') : null,
        gender: values.gender !== undefined ? values.gender : null,
        phone: values.phone || null,
        address: values.address || null,
        avatarUrl: profileData?.avatarUrl || null,
      };

      const result = await authService.updateProfile(profileUpdateData);

      if (result.success) {
        toast.success(result.message);
        // Refresh profile data
        await fetchProfile();
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      toast.error('Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-gray-50 pt-7">
      <div className="max-w-7xl mx-auto py-8 sm:px-6 lg:px-8">
        <div className="px-4 sm:px-0">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Account Settings</h1>
            <p className="text-gray-600 mt-2">Manage your profile information and account settings</p>
          </div>

          <div className="flex flex-col lg:flex-row gap-8">
            {/* Sidebar */}
            <div className="w-full lg:w-80 flex-shrink-0">
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                {/* Profile Header */}
                <div className="p-6 border-b border-gray-200">
                  <div className="flex flex-col items-center text-center">
                    <div className="relative mb-4">
                      <Avatar
                        size={80}
                        src={profileData?.avatarUrl}
                        icon={<UserOutlined />}
                        className="border-4 border-orange-500 shadow-lg"
                      />
                      <div className="absolute bottom-0 right-0 w-6 h-6 bg-orange-500 rounded-full flex items-center justify-center shadow-md">
                        <EditOutlined className="text-white text-xs" />
                      </div>
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900">
                      {profileData?.fullName || 'User'}
                    </h3>
                    <p className="text-gray-600 mt-1 text-sm">
                      {profileData?.email}
                    </p>
                  </div>
                </div>

                {/* Navigation Menu */}
                <nav className="p-4">
                  <ul className="space-y-2">
                    <li>
                      <button
                        onClick={() => setActiveTab('profile')}
                        className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-all duration-200 ${
                          activeTab === 'profile'
                            ? 'bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-md transform scale-105'
                            : 'text-gray-700 hover:bg-orange-50 hover:text-orange-600'
                        }`}
                      >
                        <UserOutlined className="text-lg" />
                        <span className="font-medium">Profile Information</span>
                      </button>
                    </li>
                    <li>
                      <button
                        onClick={() => setActiveTab('change-password')}
                        className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-all duration-200 ${
                          activeTab === 'change-password'
                            ? 'bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-md transform scale-105'
                            : 'text-gray-700 hover:bg-orange-50 hover:text-orange-600'
                        }`}
                      >
                        <LockOutlined className="text-lg" />
                        <span className="font-medium">Change Password</span>
                      </button>
                    </li>
                  </ul>
                </nav>
              </div>
            </div>

            {/* Main Content */}
            <div className="flex-1">
              {activeTab === 'profile' ? (
                <div className="bg-white rounded-xl shadow-sm border border-gray-200">
                  <div className="p-8">
                    <div className="flex items-center justify-between mb-6">
                      <div>
                        <h2 className="text-2xl font-bold text-gray-900">Public Profile</h2>
                        <p className="text-gray-600 mt-1">Add information about yourself</p>
                      </div>
                      <div className="hidden md:flex items-center space-x-2 text-orange-600">
                        <EditOutlined className="text-lg" />
                        <span className="text-sm font-medium">Edit Mode</span>
                      </div>
                    </div>
                    
                    <Form
                      form={form}
                      layout="vertical"
                      onFinish={handleSubmit}
                      className="space-y-4"
                    >
                      {/* Full Name */}
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <label className="block text-sm font-semibold text-gray-800 mb-3">
                          Basic Information
                        </label>
                        <Form.Item
                          name="fullName"
                          label="Full Name"
                          rules={[
                            { required: true, message: 'Full Name cannot be empty' },
                            { max: 100, message: 'Full Name cannot be over 100 characters' },
                          ]}
                        >
                          <Input
                            placeholder="Enter your full name"
                            className="h-12 rounded-lg border-gray-300 focus:border-orange-500 focus:ring-orange-500"
                          />
                        </Form.Item>
                      </div>

                      {/* Date of Birth and Gender */}
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <label className="block text-sm font-semibold text-gray-800 mb-3">
                          Personal Details
                        </label>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <Form.Item
                            name="doB"
                            label="Date of Birth"
                          >
                            <DatePicker
                              placeholder="Select your birth date"
                              className="h-12 w-full rounded-lg border-gray-300 focus:border-orange-500 focus:ring-orange-500"
                              format="YYYY-MM-DD"
                            />
                          </Form.Item>

                          <Form.Item
                            name="gender"
                            label="Gender"
                          >
                            <Radio.Group className="flex space-x-8">
                              <Radio value={true} className="text-gray-700">
                                <span className="ml-2">Male</span>
                              </Radio>
                              <Radio value={false} className="text-gray-700">
                                <span className="ml-2">Female</span>
                              </Radio>
                            </Radio.Group>
                          </Form.Item>
                        </div>
                      </div>

                      {/* Contact Information */}
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <label className="block text-sm font-semibold text-gray-800 mb-3">
                          Contact Information
                        </label>
                        
                        <Form.Item
                          name="phone"
                          label="Phone Number"
                          rules={[
                            {
                              pattern: /^\d{10,11}$/,
                              message: 'Phone number must be 10-11 digits',
                            },
                          ]}
                        >
                          <Input
                            placeholder="Enter your phone number"
                            className="h-12 rounded-lg border-gray-300 focus:border-orange-500 focus:ring-orange-500"
                          />
                        </Form.Item>

                        <Form.Item
                          name="address"
                          label="Address"
                        >
                          <Input.TextArea
                            placeholder="Enter your address"
                            rows={3}
                            className="resize-none rounded-lg border-gray-300 focus:border-orange-500 focus:ring-orange-500"
                          />
                        </Form.Item>
                      </div>

                      {/* Submit Button */}
                      <div className="flex justify-end pt-4 border-t border-gray-200">
                        <Form.Item className="mb-0">
                          <Button
                            type="primary"
                            htmlType="submit"
                            loading={loading}
                            icon={<SaveOutlined />}
                            className="h-12 px-8 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 border-none rounded-lg shadow-md hover:shadow-lg transition-all duration-200 transform hover:scale-105"
                          >
                            {loading ? 'Updating...' : 'Update Profile'}
                          </Button>
                        </Form.Item>
                      </div>
                    </Form>
                  </div>
                </div>
              ) : (
                <ChangePassword />
              )}
            </div>
          </div>
        </div>
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

export default Profile;