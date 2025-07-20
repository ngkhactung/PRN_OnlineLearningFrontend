import React from "react";
import { Modal, Card, Button, Space, Tag, Typography, Divider } from "antd";
import {
  FormOutlined,
  ClockCircleOutlined,
  QuestionCircleOutlined,
  TrophyOutlined,
} from "@ant-design/icons";

const { Title, Text } = Typography;

const QuizConfirmation = ({ 
  visible, 
  quiz, 
  onConfirm, 
  onCancel, 
  loading = false 
}) => {
  if (!quiz) return null;

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  return (
    <Modal
      title={
        <div className="flex items-center gap-2">
          <FormOutlined className="text-purple-500" />
          <span>Quiz Confirmation</span>
        </div>
      }
      open={visible}
      onCancel={onCancel}
      footer={null}
      width={600}
      centered
    >
      <div className="space-y-6">
        {/* Quiz Title */}
        <div className="text-center">
          <Title level={3} className="text-purple-600 mb-2">
            {quiz.quizName || "Quiz"}
          </Title>
          <Text type="secondary">
            Please review the quiz details before starting
          </Text>
        </div>

        <Divider />

        {/* Quiz Details */}
        <div className="grid grid-cols-2 gap-4">
          <Card size="small" className="text-center">
            <div className="flex flex-col items-center gap-2">
              <QuestionCircleOutlined className="text-blue-500 text-xl" />
              <Text strong>Total Questions</Text>
              <Text className="text-lg">{quiz.questions?.length || 0}</Text>
            </div>
          </Card>

          <Card size="small" className="text-center">
            <div className="flex flex-col items-center gap-2">
              <ClockCircleOutlined className="text-orange-500 text-xl" />
              <Text strong>Time Limit</Text>
              <Text className="text-lg">{formatTime(quiz.quizTime || 600)}</Text>
            </div>
          </Card>
        </div>

        {/* Passing Score */}
        <Card size="small" className="text-center">
          <div className="flex flex-col items-center gap-2">
            <TrophyOutlined className="text-green-500 text-xl" />
            <Text strong>Passing Score</Text>
            <Text className="text-lg">{quiz.passScore || 0} points</Text>
          </div>
        </Card>

        {/* Instructions */}
        <Card size="small" className="bg-blue-50 border-blue-200">
          <div className="space-y-2">
            <Text strong className="text-blue-800">Important Instructions:</Text>
            <ul className="text-sm text-blue-700 space-y-1 ml-4">
              <li>• You cannot pause or stop the quiz once started</li>
              <li>• Make sure you have stable internet connection</li>
              <li>• Answer all questions before time runs out</li>
              <li>• You can retry if you don't pass the first time</li>
            </ul>
          </div>
        </Card>

        {/* Action Buttons */}
        <div className="flex justify-center gap-4 pt-4">
          <Button 
            size="large" 
            onClick={onCancel}
            disabled={loading}
          >
            Cancel
          </Button>
          <Button 
            type="primary" 
            size="large" 
            onClick={onConfirm}
            loading={loading}
            icon={<FormOutlined />}
            className="bg-purple-600 hover:bg-purple-700 border-purple-600"
          >
            Start Quiz
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default QuizConfirmation; 