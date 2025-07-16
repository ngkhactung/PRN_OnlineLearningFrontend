import React, { useState, useEffect, useRef } from "react";
import { Button, Form, Input, Typography } from "antd";
import { MailOutlined, SafetyOutlined } from "@ant-design/icons";
import { toast } from "react-toastify";
import authService from "../../services/authService";

const { Title, Text } = Typography;

function OTPVerification({ 
  email, 
  type, // 'register' or 'forgot-password'
  userData, // For register verification
  onSuccess, 
  onBack 
}) {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [countdown, setCountdown] = useState(60);
  const [canResend, setCanResend] = useState(false);
  const [otpValues, setOtpValues] = useState(['', '', '', '', '', '']);
  const inputRefs = useRef([]);

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      setCanResend(true);
    }
  }, [countdown]);

  // Update form field when OTP values change
  useEffect(() => {
    const otpString = otpValues.join('');
    form.setFieldsValue({ otp: otpString });
  }, [otpValues, form]);

  const handleOtpChange = (index, value) => {
    if (!/^\d*$/.test(value)) return; // Only allow numbers
    
    const newOtpValues = [...otpValues];
    newOtpValues[index] = value;
    setOtpValues(newOtpValues);
    
    // Move to next input if value is entered
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otpValues[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleVerify = async (values) => {
    setLoading(true);
    
    try {
      let result;
      
      // Get OTP value - using 'otp' field name now
      const otpCode = values.otp;
      
      if (type === 'register') {
        console.log('Verifying registration OTP:', { email, otpCode, userData });
        result = await authService.verifyRegister({
          email: email,
          otpCode: otpCode,
          fullName: userData.fullname,
          password: userData.password,
        });
      } else if (type === 'forgot-password') {
        console.log('Verifying forgot password OTP:', { email, otpCode });
        result = await authService.verifyForgotPassword({
          email: email,
          otpCode: otpCode,
        });
      }

      if (result.success) {
        toast.success(result.message);
        onSuccess(result.data);
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      toast.error('Verification failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleResendOTP = async () => {
    setResendLoading(true);
    
    try {
      const result = await authService.sendOtp(email);
      
      if (result.success) {
        toast.success(result.message);
        setCountdown(60);
        setCanResend(false);
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      toast.error('Failed to resend OTP. Please try again.');
    } finally {
      setResendLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="text-center mb-6">
        <div className="mx-auto w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mb-4">
          <MailOutlined className="text-2xl text-orange-600" />
        </div>
        <Title level={3} className="text-gray-900 mb-2">
          Check your email
        </Title>
        <Text className="text-gray-600">
          We've sent a verification code to{" "}
          <span className="font-semibold text-gray-900">{email}</span>
        </Text>
      </div>

      <Form
        form={form}
        name="otp-verification"
        onFinish={handleVerify}
        layout="vertical"
        className="space-y-4"
      >
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
          <div>
            <Typography.Title level={5}>Verification Code</Typography.Title>
            <div className="flex justify-center gap-3 mt-2">
              {otpValues.map((value, index) => (
                <Input
                  key={index}
                  ref={(el) => (inputRefs.current[index] = el)}
                  value={value}
                  onChange={(e) => handleOtpChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  maxLength={1}
                  className="text-center text-lg font-mono"
                  style={{
                    width: '45px',
                    height: '45px',
                    fontSize: '18px',
                    borderRadius: '8px',
                    borderColor: '#ea580c',
                    borderWidth: '2px',
                  }}
                />
              ))}
            </div>
            {/* Hidden input for form validation */}
            <Input
              style={{ display: 'none' }}
              value={otpValues.join('')}
              onChange={() => {}} // Controlled by OTP inputs above
            />
          </div>
        </Form.Item>

        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            loading={loading}
            className="w-full mt-3 !bg-orange-600 !hover:bg-orange-700 !border-orange-600"
            size="large"
          >
            {loading ? 'Verifying...' : 'Verify Code'}
          </Button>
        </Form.Item>
      </Form>

      <div className="text-center mt-6 space-y-4">
        <div className="text-gray-600">
          Didn't receive the code?{" "}
          {canResend ? (
            <Button
              type="link"
              loading={resendLoading}
              onClick={handleResendOTP}
              className="p-0 mt-3 h-auto !text-orange-600 !hover:text-orange-700"
            >
              Resend code
            </Button>
          ) : (
            <span className="text-gray-400">
              Resend in {countdown}s
            </span>
          )}
        </div>

        <Button
          type="link"
          onClick={onBack}
          className="!text-orange-600 !hover:text-orange-700"
        >
          ← Back to {type === 'register' ? 'registration' : 'login'}
        </Button>
      </div>
    </div>
  );
}

export default OTPVerification;
