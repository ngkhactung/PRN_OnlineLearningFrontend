import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  CheckCircleOutlined,
  LockOutlined,
  MailOutlined,
  SafetyOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { Button, Checkbox, Form, Input, Flex, Typography } from "antd";

function Auth() {
  // Password validation rules
  const passwordRules = [
    { required: true, message: "Please input your password!" },
    { min: 8, message: "Password must be at least 8 characters!" },
    {
      pattern: /^(?=.*[a-z])/,
      message: "Password must contain at least one lowercase letter!",
    },
    {
      pattern: /^(?=.*[A-Z])/,
      message: "Password must contain at least one uppercase letter!",
    },
    {
      pattern: /^(?=.*\d)/,
      message: "Password must contain at least one number!",
    },
    {
      pattern: /^(?=.*[!@#$%^&*])/,
      message:
        "Password must contain at least one special character (!@#$%^&*)!",
    },
  ];
  const [activeTab, setActiveTab] = useState("login");

  const onFinish = (values) => {
    console.log("Form values:", values);
    if (activeTab === "login") {
      // Handle login
      console.log("Login data:", values);
    } else {
      // Handle register
      console.log("Register data:", values);
    }
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
          {/* Tabs */}
          <div className="flex border-b border-gray-200 mb-8">
            <button
              className={`flex-1 py-4 px-1 text-center border-b-2 font-medium text-sm ${
                activeTab === "login"
                  ? "border-orange-500 text-orange-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
              onClick={() => setActiveTab("login")}
            >
              Sign in
            </button>
            <button
              className={`flex-1 py-4 px-1 text-center border-b-2 font-medium text-sm ${
                activeTab === "register"
                  ? "border-orange-500 text-orange-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
              onClick={() => setActiveTab("register")}
            >
              Register
            </button>
          </div>

          {/* Form */}
          <Form
            name="auth"
            initialValues={{ remember: true }}
            onFinish={onFinish}
            layout="vertical"
            className="space-y-4"
          >
            {activeTab === "register" && (
              <Form.Item
                name="username"
                rules={[
                  { required: true, message: "Please input your username!" },
                  {
                    min: 3,
                    message: "Username must be at least 3 characters!",
                  },
                ]}
              >
                <div>
                  <Typography.Title level={5}>Username</Typography.Title>
                  <Input
                    prefix={<UserOutlined />}
                    placeholder="Enter your username"
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

            <Form.Item name="password" rules={passwordRules}>
              <div>
                <Typography.Title level={5}>New Password</Typography.Title>
                <Input.Password
                  prefix={<LockOutlined />}
                  placeholder="Enter new password"
                  size="large"
                  validateFirst
                  rules={passwordRules}
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
                <Flex justify="space-between" align="center">
                  <Form.Item name="remember" valuePropName="checked" noStyle>
                    <Checkbox>Remember me</Checkbox>
                  </Form.Item>
                  <a href="#" className="text-orange-600 hover:text-orange-500">
                    Forgot password?
                  </a>
                </Flex>
              </Form.Item>
            )}

            <Form.Item>
              <button
                type="submit"
                className="flex w-full justify-center rounded-md border border-transparent bg-orange-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2"
              >
                {activeTab === "login" ? "Sign in" : "Register"}
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
                <a
                  href="#"
                  className="inline-flex w-full justify-center rounded-md border border-gray-300 bg-white py-2 px-4 text-sm font-medium text-gray-500 shadow-sm hover:bg-gray-50"
                >
                  <span className="sr-only">Sign in with Google</span>
                  <svg
                    className="h-5 w-5 text-orange-500"
                    aria-hidden="true"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z" />
                  </svg>
                </a>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Auth;
