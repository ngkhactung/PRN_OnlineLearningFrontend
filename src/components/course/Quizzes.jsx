import React, { useState } from "react";
import { Layout, Radio, Button, Card, Progress } from "antd";
import {
  QuestionCircleOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
} from "@ant-design/icons";

const { Content } = Layout;

function Quiz({ questions, onFinish }) {
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState(Array(questions.length).fill(null));
  const [showResult, setShowResult] = useState(false);

  const currentQuestion = questions[current];
  const isAnswered = answers[current] !== null;
  const isCorrect = isAnswered && answers[current] === currentQuestion.correct;

  const handleAnswerChange = (e) => {
    const newAnswers = [...answers];
    newAnswers[current] = e.target.value;
    setAnswers(newAnswers);
    setShowResult(false);
  };

  const handleCheck = () => setShowResult(true);

  const handleNext = () => {
    setShowResult(false);
    if (current < questions.length - 1) setCurrent(current + 1);
    else if (onFinish) onFinish(answers);
  };

  const handlePrev = () => {
    setShowResult(false);
    if (current > 0) setCurrent(current - 1);
  };

  // Tính phần trăm hoàn thành
  const percent = Math.round(
    (answers.filter((a) => a !== null).length / questions.length) * 100
  );

  return (
    <Content className="flex-1 overflow-y-auto px-2 md:px-8 py-8">
      <div className="max-w-3xl mx-auto">
        {/* Progress Bar */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600">
              Câu hỏi {current + 1} / {questions.length}
            </span>
            <span className="text-sm text-gray-600">{percent}% hoàn thành</span>
          </div>
          <Progress percent={percent} showInfo={false} strokeColor="#1890ff" />
        </div>

        {/* Question Card */}
        <Card className="shadow-lg border-0 mb-6">
          <div className="mb-8">
            {/* Question Header */}
            <div className="flex items-start mb-6">
              <QuestionCircleOutlined className="text-blue-500 text-xl mr-3 mt-1 flex-shrink-0" />
              <h1 className="text-2xl font-bold text-gray-800 leading-relaxed">
                {currentQuestion.question}
              </h1>
            </div>

            {/* Answer Options */}
            <div className="ml-8">
              <Radio.Group
                value={answers[current]}
                onChange={handleAnswerChange}
                className="w-full"
                disabled={showResult}
              >
                <div className="space-y-4">
                  {currentQuestion.options.map((option, idx) => (
                    <div key={idx} className="group">
                      <Radio value={idx} className="radio-option w-full">
                        <div
                          className={`
                            w-full p-4 rounded-lg border-2 transition-all duration-200 cursor-pointer
                            ${
                              answers[current] === idx && !showResult
                                ? "border-blue-500 bg-blue-50"
                                : showResult && idx === currentQuestion.correct
                                ? "border-green-500 bg-green-50"
                                : showResult &&
                                  answers[current] === idx &&
                                  idx !== currentQuestion.correct
                                ? "border-red-500 bg-red-50"
                                : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                            }
                          `}
                        >
                          <div className="flex items-center justify-between">
                            <span className="text-lg font-medium text-gray-700">
                              {option}
                            </span>
                            {showResult && idx === currentQuestion.correct && (
                              <CheckCircleOutlined className="text-green-500 text-xl" />
                            )}
                            {showResult &&
                              answers[current] === idx &&
                              idx !== currentQuestion.correct && (
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
                  : `Đáp án đúng là: ${currentQuestion.options[currentQuestion.correct]}`}
              </p>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex justify-between items-center ml-8">
            <Button size="large" onClick={handlePrev} disabled={current === 0}>
              Câu trước
            </Button>

            <div className="space-x-3">
              {!showResult && answers[current] !== null && (
                <Button
                  type="primary"
                  size="large"
                  onClick={handleCheck}
                  className="px-8"
                >
                  Kiểm tra đáp án
                </Button>
              )}

              {showResult && (
                <Button
                  type="primary"
                  size="large"
                  className="px-8"
                  onClick={handleNext}
                >
                  {current === questions.length - 1 ? "Hoàn thành" : "Câu tiếp theo"}
                </Button>
              )}

              {answers[current] === null && (
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
            {questions.map((q, idx) => (
              <div
                key={idx}
                className={`
                  w-12 h-12 rounded-full flex items-center justify-center text-sm font-semibold cursor-pointer transition-all duration-200
                  ${
                    idx === current
                      ? "bg-blue-500 text-white shadow-lg"
                      : answers[idx] !== null
                      ? "bg-green-100 text-green-600 border border-green-400"
                      : "bg-gray-100 text-gray-500 hover:bg-gray-200"
                  }
                `}
                onClick={() => setCurrent(idx)}
              >
                {idx + 1}
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
}

export default Quiz;
