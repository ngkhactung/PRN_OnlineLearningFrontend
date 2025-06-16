import React, { useState } from "react";
import { Form, Input, Typography, Button, message } from "antd";
import { LockOutlined, SafetyOutlined } from "@ant-design/icons";

function ResetPassword() {
  const [form] = Form.useForm();
  const [passwordStrength, setPasswordStrength] = useState(0);

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

  // Calculate password strength
  const calculatePasswordStrength = (pass) => {
    let strength = 0;
    if (pass.length >= 8) strength += 20;
    if (/[A-Z]/.test(pass)) strength += 20;
    if (/[a-z]/.test(pass)) strength += 20;
    if (/[0-9]/.test(pass)) strength += 20;
    if (/[!@#$%^&*]/.test(pass)) strength += 20;
    return strength;
  };

  // Get password strength color
  const getPasswordStrengthColor = (strength) => {
    if (strength <= 20) return "#ff4d4f";
    if (strength <= 40) return "#faad14";
    if (strength <= 60) return "#1890ff";
    if (strength <= 80) return "#52c41a";
    return "#52c41a";
  };

  const onPasswordChange = (e) => {
    const newPassword = e.target.value;
    setPasswordStrength(calculatePasswordStrength(newPassword));
  };

  const onFinish = (values) => {
    console.log("Reset password data:", values);
    // Handle password reset logic here
    message.success("Password has been reset successfully!");
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <img
          className="mx-auto h-12 w-auto"
          src="img/logo.png"
          alt="Your Company"
        />
        <Typography.Title level={2} className="mt-6 text-center font-bold">
          Reset your password
        </Typography.Title>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <Form
            form={form}
            name="reset-password"
            onFinish={onFinish}
            layout="vertical"
            className="space-y-6"
          >
            <Form.Item name="password" rules={passwordRules}>
              <div>
                <Typography.Title level={5}>New Password</Typography.Title>
                <Input.Password
                  prefix={<LockOutlined />}
                  placeholder="Enter new password"
                  size="large"
                  validateFirst
                  rules={passwordRules}
                  onChange={onPasswordChange}
                />
                <div className="mt-2">
                  <div className="h-1 w-full bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className="h-full transition-all duration-300"
                      style={{
                        width: `${passwordStrength}%`,
                        backgroundColor:
                          getPasswordStrengthColor(passwordStrength),
                      }}
                    />
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    {passwordStrength <= 20 && "Very Weak"}
                    {passwordStrength > 20 && passwordStrength <= 40 && "Weak"}
                    {passwordStrength > 40 &&
                      passwordStrength <= 60 &&
                      "Medium"}
                    {passwordStrength > 60 &&
                      passwordStrength <= 80 &&
                      "Strong"}
                    {passwordStrength > 80 && "Very Strong"}
                  </div>
                </div>
              </div>
            </Form.Item>

            <Form.Item
              name="confirmPassword"
              dependencies={["password"]}
              validateTrigger="onBlur"
              rules={[
                { required: true, message: "Please confirm your password!" },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || getFieldValue("password") === value) {
                      return Promise.resolve();
                    }
                    return Promise.reject(new Error("Passwords do not match!"));
                  },
                }),
              ]}
            >
              <div>
                <Typography.Title level={5}>Confirm Password</Typography.Title>
                <Input.Password
                  prefix={<SafetyOutlined />}
                  placeholder="Confirm new password"
                  size="large"
                />
              </div>
            </Form.Item>

            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                className="w-full mt-3 h-10 text-base font-medium"
              >
                Reset Password
              </Button>
            </Form.Item>
          </Form>
        </div>
      </div>
    </div>
  );
}

export default ResetPassword;
