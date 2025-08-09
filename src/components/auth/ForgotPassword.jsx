import React, { useState } from "react";
import { Button, Form, Input, Typography } from "antd";
import { MailOutlined, LockOutlined, SafetyOutlined } from "@ant-design/icons";
import { toast } from "react-toastify";
import authService from "../../services/authService";
import OTPVerification from "./OTPVerification";

const { Title, Text } = Typography;

function ForgotPassword({ onBack }) {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1); // 1: email, 2: otp, 3: new password
  const [email, setEmail] = useState("");
  const [isOTPVerified, setIsOTPVerified] = useState(false);

  const handleSendOTP = async (values) => {
    setLoading(true);
    
    try {
      const result = await authService.forgotPassword(values.email);
      if (result.success) {
        toast.success(result.message);
        setEmail(values.email);
        setStep(2);
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      toast.error("Failed to send OTP. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleOTPSuccess = () => {
    setIsOTPVerified(true);
    setStep(3);
  };

  const handleOTPBack = () => {
    setStep(1);
    setEmail("");
  };

  const handleChangePassword = async (values) => {
    setLoading(true);
    
    try {
      const result = await authService.changePassword({
        email: email,
        newPassword: values.newPassword,
        confirmNewPassword: values.confirmNewPassword,
      });
      
      if (result.success) {
        toast.success(result.message);
        onBack();
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      toast.error("Failed to change password. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (step === 2) {
    return (
      <OTPVerification
        email={email}
        type="forgot-password"
        onSuccess={handleOTPSuccess}
        onBack={handleOTPBack}
      />
    );
  }

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="text-center mb-6">
        <Title level={3} className="text-gray-900 mb-2">
          {step === 1 ? "Reset your password" : "Create new password"}
        </Title>
        <Text className="text-gray-600">
          {step === 1 
            ? "Enter your email address and we'll send you a link to reset your password."
            : "Please enter your new password."
          }
        </Text>
      </div>

      {step === 1 && (
        <Form
          form={form}
          name="forgot-password"
          onFinish={handleSendOTP}
          layout="vertical"
          className="space-y-4"
        >
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

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              loading={loading}
              className="w-full mt-3 !bg-orange-600 !hover:bg-orange-700 !border-orange-600 focus:ring-orange-500"
              size="large"
            >
              {loading ? 'Sending...' : 'Send Reset Code'}
            </Button>
          </Form.Item>
        </Form>
      )}

      {step === 3 && (
        <Form
          form={form}
          name="change-password"
          onFinish={handleChangePassword}
          layout="vertical"
          className="space-y-4"
        >
          <Form.Item
            name="newPassword"
            rules={[
              { required: true, message: "Please input your new password!" },
              { min: 6, message: "Password must be at least 6 characters!" },
            ]}
          >
            <div>
              <Typography.Title level={5}>New Password</Typography.Title>
              <Input.Password
                prefix={<LockOutlined />}
                placeholder="Enter new password"
                size="large"
              />
            </div>
          </Form.Item>

          <Form.Item
            name="confirmNewPassword"
            dependencies={["newPassword"]}
            rules={[
              { required: true, message: "Please confirm your new password!" },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue("newPassword") === value) {
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
              <Typography.Title level={5}>Confirm New Password</Typography.Title>
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
              loading={loading}
              className="w-full mt-3 !bg-orange-600 !hover:bg-orange-700 !border-orange-600 focus:ring-orange-500"
              size="large"
            >
              {loading ? 'Updating...' : 'Update Password'}
            </Button>
          </Form.Item>
        </Form>
      )}

      <div className="text-center mt-6">
        <Button
          type="link"
          onClick={onBack}
          className="!text-orange-600 !hover:text-orange-500 p-0 h-auto"
        >
          ← Back to login
        </Button>
      </div>
    </div>
  );
}

export default ForgotPassword;
