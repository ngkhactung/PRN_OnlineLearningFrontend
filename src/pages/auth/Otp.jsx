import React, { useState, useEffect } from "react";
import {
  LockOutlined,
  MailOutlined,
  SafetyOutlined,
  UserOutlined,
  ClockCircleOutlined,
} from "@ant-design/icons";
import { Checkbox, Form, Input, Flex, Typography, Button, message } from "antd";

function Otp() {
  const [form] = Form.useForm();
  const [timeLeft, setTimeLeft] = useState(60);
  const [isResendDisabled, setIsResendDisabled] = useState(true);

  // Countdown timer
  useEffect(() => {
    if (timeLeft > 0 && isResendDisabled) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0) {
      setIsResendDisabled(false);
    }
  }, [timeLeft, isResendDisabled]);

  const onFinish = (values) => {
    console.log("OTP submitted:", values);
    // Handle OTP verification here
    message.success("OTP verified successfully!");
  };

  const handleResendOTP = () => {
    // Handle resend OTP logic here
    setTimeLeft(60);
    setIsResendDisabled(true);
    message.success("New OTP has been sent to your email!");
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
          Verify your email
        </Typography.Title>
        <Typography className="mt-2 text-center">
          We have sent a verification code to your email
        </Typography>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <Form
            form={form}
            name="otp"
            onFinish={onFinish}
            layout="vertical"
            className="space-y-6"
          >
            <div className="text-center mb-6">
              <MailOutlined className="text-4xl text-orange-500" />
              <Typography.Text className="block mt-2 text-sm text-gray-600">
                Enter the 6-digit code sent to your email
              </Typography.Text>
            </div>

            <Form.Item
              name="otp"
              rules={[
                { required: true, message: "Please input the OTP!" },
                { len: 6, message: "OTP must be 6 digits!" },
                {
                  pattern: /^\d+$/,
                  message: "OTP must contain only numbers!",
                },
              ]}
            >
              <Input.OTP
                size="large"
                length={6}
                className="justify-center"
                inputStyle={{
                  width: "40px",
                  height: "40px",
                  margin: "0 4px",
                  fontSize: "20px",
                  borderRadius: "8px",
                }}
              />
            </Form.Item>

            <div className="text-center">
              <Typography.Text className="text-sm text-gray-600">
                {isResendDisabled ? (
                  <span className="flex items-center justify-center gap-2">
                    <ClockCircleOutlined /> Resend code in {timeLeft}s
                  </span>
                ) : (
                  <Button
                    type="link"
                    onClick={handleResendOTP}
                  >
                    Resend verification code
                  </Button>
                )}
              </Typography.Text>
            </div>

            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                className="w-full bg-orange-600 hover:bg-orange-700 h-10 text-base font-medium"
              >
                Verify Email
              </Button>
            </Form.Item>
          </Form>
        </div>
      </div>
    </div>
  );
}

export default Otp;
