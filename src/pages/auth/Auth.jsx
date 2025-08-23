import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  CheckCircleOutlined,
  LockOutlined,
  MailOutlined,
  SafetyOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { Button, Form, Input, Flex, Typography, Alert } from "antd";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import authService from "../../services/authService";
import { useAuth } from "../../contexts/AuthContext";
import OTPVerification from "../../components/auth/OTPVerification";
import ForgotPassword from "../../components/auth/ForgotPassword";
import SocialLoginButtons from "../../components/auth/SocialLoginButtons";

function Auth() {
  // Password validation rules - simplified
  const passwordRules = [
    { required: true, message: "Please input your password!" },
    { min: 6, message: "Password must be at least 6 characters!" },
  ];
  
  // Different password rules for login (less strict)
  const loginPasswordRules = [
    { required: true, message: "Please input your password!" },
  ];
  const [activeTab, setActiveTab] = useState("login");
  const [showOTP, setShowOTP] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [pendingUserData, setPendingUserData] = useState(null);
  const [userEmail, setUserEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();
  const { updateAuthState } = useAuth();

  const onFinish = async (values) => {
    setLoading(true);
    setErrorMessage(""); // Clear previous error
    
    try {
      if (activeTab === "login") {
        // Handle login
        const result = await authService.login({
          email: values.email,
          password: values.password,
        });

        if (result.success) {
          // Update auth state in context
          updateAuthState(true);
          toast.success("Login successful!");
          // Check user role
          const user = localStorage.getItem("user");
          let isAdmin = false;
          if (user) {
            try {
              const parsed = JSON.parse(user);
              if (parsed.role && parsed.role === "Admin") isAdmin = true;
              if (parsed.roles && Array.isArray(parsed.roles) && parsed.roles.includes("Admin")) isAdmin = true;
            } catch {}
          }
          if (isAdmin) {
            navigate("/admin");
          } else {
            navigate("/");
          }
        } else {
          const errorMsg = result.message || "Login failed. Please try again.";
          setErrorMessage(errorMsg);
          toast.error(errorMsg);
        }
      } else {
        // Handle register - first step: send OTP
        const result = await authService.register({
          fullname: values.fullname,
          email: values.email,
          password: values.password,
        });

        if (result.success) {
          console.log('Registration OTP sent:', result.message);
          toast.success(result.message);
          setPendingUserData(values);
          setUserEmail(values.email);
          setShowOTP(true);
        } else {
          const errorMsg = result.message || "Registration failed. Please try again.";
          setErrorMessage(errorMsg);
          toast.error(errorMsg);
        }
      }
    } catch (error) {
      const errorMsg = "Network error. Please check your connection and try again.";
      setErrorMessage(errorMsg);
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const handleOTPSuccess = (data) => {
    // Update auth state in context
    updateAuthState(true);
    toast.success("Registration successful!");
    navigate("/"); // Redirect to home page
  };

  const handleOTPBack = () => {
    setShowOTP(false);
    setPendingUserData(null);
    setUserEmail("");
  };

  const handleForgotPasswordClick = () => {
    setShowForgotPassword(true);
  };

  const handleForgotPasswordBack = () => {
    setShowForgotPassword(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <Link className="sm:mx-auto sm:w-full sm:max-w-md"  to="/">
        <img
          className="mx-auto h-12 w-auto"
          src="img/logo.png"
          alt="Your Company"
        />
      </Link>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          {showOTP ? (
            <OTPVerification
              email={userEmail}
              type="register"
              userData={pendingUserData}
              onSuccess={handleOTPSuccess}
              onBack={handleOTPBack}
            />
          ) : showForgotPassword ? (
            <ForgotPassword onBack={handleForgotPasswordBack} />
          ) : (
            <>
              {/* Tabs */}
              <div className="flex border-b border-gray-200 mb-8">
                <button
                  className={`flex-1 py-4 px-1 text-center border-b-2 font-medium text-sm ${
                    activeTab === "login"
                      ? "border-orange-500 text-orange-600"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  }`}
                  onClick={() => {
                    setActiveTab("login");
                    setErrorMessage(""); // Clear error when switching tabs
                  }}
                >
                  Sign in
                </button>
                <button
                  className={`flex-1 py-4 px-1 text-center border-b-2 font-medium text-sm ${
                    activeTab === "register"
                      ? "border-orange-500 text-orange-600"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  }`}
                  onClick={() => {
                    setActiveTab("register");
                    setErrorMessage(""); // Clear error when switching tabs
                  }}
                >
                  Register
                </button>
              </div>

              {/* Error Alert */}
              {/* {errorMessage && (
                <Alert
                  message={errorMessage}
                  type="error"
                  closable
                  onClose={() => setErrorMessage("")}
                  className="mb-4 important"
                />
              )} */}

              {/* Form */}
              <Form
                key={activeTab} // Force re-render when tab changes
                name={`auth-${activeTab}`}
                initialValues={{ remember: true }}
                onFinish={onFinish}
                layout="vertical"
                className="space-y-4"
                validateTrigger="onBlur" // Validate on blur instead of onChange
              >
            {activeTab === "register" && (
              <Form.Item
                name="fullname"
                rules={[
                  { required: true, message: "Please input your full name!" },
                  {
                    min: 3,
                    message: "Full name must be at least 3 characters!",
                  },
                ]}
              >
                <div>
                  <Typography.Title level={5}>Full Name</Typography.Title>
                  <Input
                    prefix={<UserOutlined />}
                    placeholder="Enter your full name"
                    size="large"
                  />
                </div>
              </Form.Item>
            )}

            <Form.Item
              name="email"
              rules={[
                { required: true, message: "Please input your email!" },
                { type: "email", message: "Please enter a valid email!" },
              ]}
            >
              <div>
                <Typography.Title level={5}>Email</Typography.Title>
                <Input
                  prefix={<MailOutlined />}
                  placeholder="Enter your email"
                  size="large"
                />
              </div>
            </Form.Item>

            <Form.Item 
              name="password" 
              rules={activeTab === "login" ? loginPasswordRules : passwordRules}
            >
              <div>
                <Typography.Title level={5}>
                  {activeTab === "login" ? "Password" : "New Password"}
                </Typography.Title>
                <Input.Password
                  prefix={<LockOutlined />}
                  placeholder={activeTab === "login" ? "Enter your password" : "Enter new password"}
                  size="large"
                />
              </div>
            </Form.Item>

            {activeTab === "register" && (
              <Form.Item
                name="confirmPassword"
                dependencies={["password"]}
                rules={[
                  { required: true, message: "Please confirm your password!" },
                  ({ getFieldValue }) => ({
                    validator(_, value) {
                      if (!value || getFieldValue("password") === value) {
                        return Promise.resolve();
                      }
                      return Promise.reject(
                        new Error("Passwords do not match!")
                      );
                    },
                  }),
                ]}
              >
                <div>
                  <Typography.Title level={5}>
                    Confirm password
                  </Typography.Title>
                  <Input.Password
                    prefix={<SafetyOutlined />}
                    placeholder="Confirm password"
                    size="large"
                  />
                </div>
              </Form.Item>
            )}

            {activeTab === "login" && (
              <Form.Item>
                <div className="text-center">
                  <button
                    type="button"
                    cursor="pointer"
                    onClick={handleForgotPasswordClick}
                    className="text-orange-600 hover:text-orange-500"
                  >
                    Forgot password?
                  </button>
                </div>
              </Form.Item>
            )}

            <Form.Item>
              <button
                type="submit"
                disabled={loading}
                className="flex w-full justify-center rounded-md border border-transparent bg-orange-600 mt-2 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 disabled:opacity-50"
              >
                {loading ? "Loading..." : (activeTab === "login" ? "Sign in" : "Register")}
              </button>
            </Form.Item>
          </Form>

          {activeTab === "login" && (
            <div className="mt-6">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="bg-white px-2 text-gray-500">
                    Or continue with
                  </span>
                </div>
              </div>

              <div className="mt-6">
                <SocialLoginButtons />
              </div>
            </div>
          )}
            </>
          )}
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

export default Auth;
