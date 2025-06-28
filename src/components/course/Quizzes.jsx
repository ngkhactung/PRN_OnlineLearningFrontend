import React, { useState } from "react";
import { Layout, Radio, Button, Card, Progress } from "antd";
import {
  QuestionCircleOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
} from "@ant-design/icons";

const { Content } = Layout;

const QuizQuestionSample = () => {
  const [selectedValue, setSelectedValue] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const correctAnswer = 2; // Option B is correct

  const handleAnswerChange = (e) => {
    setSelectedValue(e.target.value);
  };

  const handleSubmit = () => {
    setShowResult(true);
  };

  const isCorrect = selectedValue === correctAnswer;

  return (
    <Content className="flex-1 overflow-y-auto px-2 md:px-8 py-8">
      <div className="max-w-3xl mx-auto">
        {/* Progress Bar */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600">Câu hỏi 1 / 5</span>
            <span className="text-sm text-gray-600">20% hoàn thành</span>
          </div>
          <Progress percent={20} showInfo={false} strokeColor="#1890ff" />
        </div>

        {/* Question Card */}
        <Card className="shadow-lg border-0 mb-6">
          <div className="mb-8">
            {/* Question Header */}
            <div className="flex items-start mb-6">
              <QuestionCircleOutlined className="text-blue-500 text-xl mr-3 mt-1 flex-shrink-0" />
              <h1 className="text-2xl font-bold text-gray-800 leading-relaxed">
                ABC is acbd?
              </h1>
            </div>

            {/* Answer Options */}
            <div className="ml-8">
              <Radio.Group
                value={selectedValue}
                onChange={handleAnswerChange}
                className="w-full"
                disabled={showResult}
              >
                <div className="space-y-4">
                  {[
                    { value: 1, label: "Option A" },
                    { value: 2, label: "Option B" },
                    { value: 3, label: "Option C" },
                  ].map((option) => (
                    <div key={option.value} className="group">
                      <Radio
                        value={option.value}
                        className="radio-option w-full"
                      >
                        <div
                          className={`
                          w-full p-4 rounded-lg border-2 transition-all duration-200 cursor-pointer
                          ${
                            selectedValue === option.value && !showResult
                              ? "border-blue-500 bg-blue-50"
                              : showResult && option.value === correctAnswer
                              ? "border-green-500 bg-green-50"
                              : showResult &&
                                selectedValue === option.value &&
                                option.value !== correctAnswer
                              ? "border-red-500 bg-red-50"
                              : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                          }
                        `}
                        >
                          <div className="flex items-center justify-between">
                            <span className="text-lg font-medium text-gray-700">
                              {option.label}
                            </span>
                            {showResult && option.value === correctAnswer && (
                              <CheckCircleOutlined className="text-green-500 text-xl" />
                            )}
                            {showResult &&
                              selectedValue === option.value &&
                              option.value !== correctAnswer && (
                                <CloseCircleOutlined className="text-red-500 text-xl" />
                              )}
                          </div>
                        </div>
                      </Radio>
                    </div>
                  ))}
                </div>
              </Radio.Group>
            </div>
          </div>

          {/* Result Display */}
          {showResult && (
            <div
              className={`
              ml-8 p-4 rounded-lg border-l-4 mb-6
              ${
                isCorrect
                  ? "bg-green-50 border-green-500"
                  : "bg-red-50 border-red-500"
              }
            `}
            >
              <div className="flex items-center mb-2">
                {isCorrect ? (
                  <CheckCircleOutlined className="text-green-500 mr-2 text-lg" />
                ) : (
                  <CloseCircleOutlined className="text-red-500 mr-2 text-lg" />
                )}
                <span className="font-semibold text-lg">
                  {isCorrect ? "Chính xác!" : "Sai rồi!"}
                </span>
              </div>
              <p className="text-gray-700">
                {isCorrect
                  ? "Tuyệt vời! Bạn đã chọn đúng đáp án."
                  : "Đáp án đúng là Option B. Hãy xem lại kiến thức và thử lại."}
              </p>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex justify-between items-center ml-8">
            <Button size="large" disabled>
              Câu trước
            </Button>

            <div className="space-x-3">
              {!showResult && selectedValue && (
                <Button
                  type="primary"
                  size="large"
                  onClick={handleSubmit}
                  className="px-8"
                >
                  Kiểm tra đáp án
                </Button>
              )}

              {showResult && (
                <Button type="primary" size="large" className="px-8">
                  Câu tiếp theo
                </Button>
              )}

              {!selectedValue && (
                <Button size="large" disabled className="px-8">
                  Chọn đáp án
                </Button>
              )}
            </div>
          </div>
        </Card>

        {/* Question Navigation */}
        <Card className="shadow-sm">
          <h4 className="font-semibold mb-4 text-gray-700">
            Tiến trình câu hỏi
          </h4>
          <div className="flex gap-3">
            {[1, 2, 3, 4, 5].map((num) => (
              <div
                key={num}
                className={`
                  w-12 h-12 rounded-full flex items-center justify-center text-sm font-semibold cursor-pointer transition-all duration-200
                  ${
                    num === 1
                      ? "bg-blue-500 text-white shadow-lg"
                      : "bg-gray-100 text-gray-500 hover:bg-gray-200"
                  }
                `}
              >
                {num}
              </div>
            ))}
          </div>
        </Card>
      </div>

      <style jsx>{`
        .radio-option .ant-radio {
          display: none;
        }
        .radio-option .ant-radio-wrapper {
          width: 100%;
        }
        .radio-option .ant-radio-wrapper:hover {
          color: inherit;
        }
      `}</style>
    </Content>
  );
};

export default QuizQuestionSample;
