import React, { useState, useEffect, useRef } from "react";
import { Layout, Radio, Button, Card, Progress, Alert, Tag, Statistic, Divider } from "antd";
import {
  CheckCircleTwoTone,
  CloseCircleTwoTone,
  FormOutlined,
  ClockCircleOutlined,
  CheckOutlined,
} from "@ant-design/icons";
import QuizConfirmation from "./QuizConfirmation";

const { Content } = Layout;

function Quiz({
  quizId,
  fetchQuiz,
  submitQuiz,
  getQuizResult,
  completeQuiz,
  onQuizCompleted,
  onQuizCancelled,
  moduleId,
  baseURL,
}) {
  const [quiz, setQuiz] = useState(null);
  const [loading, setLoading] = useState(true);
  const [answers, setAnswers] = useState([]);
  const [showResult, setShowResult] = useState(false);
  const [result, setResult] = useState(null);
  const [timer, setTimer] = useState(0);
  const [timeLeft, setTimeLeft] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [canRetry, setCanRetry] = useState(false);
  const [initialResultChecked, setInitialResultChecked] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [quizStarted, setQuizStarted] = useState(false);
  const timerRef = useRef();

  // Check quiz status before rendering
  useEffect(() => {
    let ignore = false;
    async function checkResultAndLoadQuiz() {
      setLoading(true);
      setQuiz(null);
      setResult(null);
      setShowResult(false);
      setAnswers([]);
      setCanRetry(false);
      setInitialResultChecked(false);
      setQuizStarted(false);
      try {
        // Prioritize quizId, fallback to moduleId
        const id = quizId || (moduleId ? (await fetchQuiz(baseURL, moduleId)).data.quizId : null);
        if (!id) {
          setLoading(false);
          return;
        }
        // 1. Check quiz result first
        const res = await getQuizResult(baseURL, id);
        if (!ignore && res.success && res.data) {
          setResult(res.data);
          setShowResult(true);
          setCanRetry(!res.data.isPassed); // If passed, don't allow retry, if failed, allow retry
          setInitialResultChecked(true);
          setQuizStarted(true); // Quiz already completed, so it's considered "started"
        } else {
          setShowResult(false);
          setResult(null);
          setCanRetry(false);
          setInitialResultChecked(true);
          // Show confirmation for new quiz
          setShowConfirmation(true);
        }
        // 2. Always load quiz to get questions, time
        const quizData = moduleId
          ? await fetchQuiz(baseURL, moduleId)
          : await fetchQuiz(baseURL, quizId);
        if (!ignore && quizData.success) {
          setQuiz(quizData.data);
          setAnswers(Array(quizData.data.questions.length).fill(null));
          setTimer(quizData.data.quizTime || 600);
          setTimeLeft(quizData.data.quizTime || 600);
        }
      } finally {
        if (!ignore) setLoading(false);
      }
    }
    checkResultAndLoadQuiz();
    return () => {
      ignore = true;
      clearInterval(timerRef.current);
    };
    // eslint-disable-next-line
  }, [quizId, moduleId]);

  // Countdown timer
  useEffect(() => {
    if (!quiz || showResult || !quizStarted) return;
    if (timeLeft <= 0) {
      handleSubmit();
      return;
    }
    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timerRef.current);
    // eslint-disable-next-line
  }, [quiz, showResult, timeLeft, quizStarted]);

  // Convert seconds to mm:ss
  const formatTime = (sec) => {
    const m = Math.floor(sec / 60)
      .toString()
      .padStart(2, "0");
    const s = (sec % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  };

  // Select answer
  const handleAnswerChange = (qIdx, optionId) => {
    const newAnswers = [...answers];
    newAnswers[qIdx] = optionId;
    setAnswers(newAnswers);
  };

  // Submit quiz
  const handleSubmit = async () => {
    if (submitting || !quiz) return;
    setSubmitting(true);
    clearInterval(timerRef.current);
    try {
      const submitRes = await submitQuiz(baseURL, quiz.quizId, quiz.questions.map((q, idx) => ({
        questionId: q.questionId,
        optionId: answers[idx],
      })));
      setShowResult(true);
      setResult(submitRes.data);
      setCanRetry(!submitRes.data.isPassed);
      if (submitRes.data.isPassed) {
        await completeQuiz(baseURL, quiz.quizId);
        if (typeof onQuizCompleted === "function") onQuizCompleted(quiz.quizId);
      }
    } finally {
      setSubmitting(false);
    }
  };

  // Retry quiz
  const handleRetry = () => {
    setAnswers(Array(quiz.questions.length).fill(null));
    setShowResult(false);
    setResult(null);
    setTimeLeft(timer);
    setQuizStarted(true);
  };

  // Handle quiz confirmation
  const handleConfirmQuiz = () => {
    setShowConfirmation(false);
    setQuizStarted(true);
  };

  const handleCancelQuiz = () => {
    setShowConfirmation(false);
    if (typeof onQuizCancelled === "function") {
      onQuizCancelled();
    }
  };

  if (loading || !initialResultChecked) return <div className="text-center py-10">Loading quiz...</div>;
  if (!quiz) return <Alert type="error" message="Quiz not found" showIcon />;

  // Show confirmation modal if quiz hasn't been started
  if (showConfirmation) {
    return (
      <QuizConfirmation
        visible={showConfirmation}
        quiz={quiz}
        onConfirm={handleConfirmQuiz}
        onCancel={handleCancelQuiz}
        loading={loading}
      />
    );
  }

  // If there's a result and passed, only show result, don't allow retry
  if (showResult && result && result.isPassed && !canRetry) {
    return (
      <Content className="flex-1 overflow-y-auto px-2 md:px-8 py-8">
        <div className="max-w-2xl mx-auto">
          <Card bordered className="mb-6 text-center">
            <div className="flex flex-col items-center gap-2">
              <CheckCircleTwoTone twoToneColor="#52c41a" style={{ fontSize: 48 }} />
              <h2 className="text-2xl font-bold text-green-700 mt-2 mb-1">Quiz Completed!</h2>
              <Tag color="green" className="text-base">Passed</Tag>
              <Divider />
              <Statistic title="Score" value={result.score} />
              <Statistic title="Passing Score" value={quiz.passScore} />
              <Statistic
                title="Correct Answers"
                value={result.correctAnswers}
                suffix={`/ ${result.totalQuestions}`}
              />

              <Divider />
              <div className="text-gray-600">You have passed this quiz. Congratulations!</div>
            </div>
          </Card>
        </div>
      </Content>
    );
  }

  return (
    <Content className="flex-1 overflow-y-auto px-2 md:px-8 py-8">
      <div className="max-w-2xl mx-auto">
        {/* Quiz Header */}
        <Card bordered className="mb-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
            <div className="flex items-center gap-2">
              <FormOutlined className="text-purple-500 text-xl" />
              <span className="text-xl font-bold">{quiz.quizName || "Quiz"}</span>
              {result?.isPassed ? (
                <Tag color="green">Passed</Tag>
              ) : result ? (
                <Tag color="red">Failed</Tag>
              ) : null}
            </div>
            <div className="flex items-center gap-4">
              <span className="text-gray-600">Total Questions: <b>{quiz.questions.length}</b></span>
              <span className="text-gray-600">Passing Score: <b>{quiz.passScore}</b></span>
              {!result?.isPassed && quizStarted && (
                <span className="flex items-center text-red-500"><ClockCircleOutlined className="mr-1" />{formatTime(timeLeft)}</span>
              )}
            </div>
          </div>
        </Card>

        {/* If quiz submitted, show results */}
        {showResult && result && (
          <Card bordered className="mb-6 text-center">
            <div className="flex flex-col items-center gap-2">
              {result.isPassed ? (
                <CheckCircleTwoTone twoToneColor="#52c41a" style={{ fontSize: 40 }} />
              ) : (
                <CloseCircleTwoTone twoToneColor="#ff4d4f" style={{ fontSize: 40 }} />
              )}
              <h3 className={`text-lg font-bold ${result.isPassed ? "text-green-700" : "text-red-700"}`}>{result.isPassed ? "You have passed the quiz!" : "You didn't pass, please try again."}</h3>
              <div className="flex flex-wrap justify-center gap-4 mt-2">
                <Statistic title="Score" value={result.score} suffix={`/ ${quiz.passScore}`} />
                <Statistic title="Correct Answers" value={`${result.correctAnswers}/${result.totalQuestions}`} />
              </div>
              <Divider />
              {canRetry && (
                <Button onClick={handleRetry} type="primary">Retry</Button>
              )}
            </div>
          </Card>
        )}

        {/* If not submitted and quiz started, show quiz form */}
        {!showResult && quizStarted && (
          <>
            {/* Progress Bar */}
            <div className="mb-6">
              <Progress percent={Math.round((answers.filter((a) => a !== null).length / quiz.questions.length) * 100)} showInfo={false} strokeColor="#722ed1" />
              <div className="flex justify-between text-sm text-gray-500 mt-1">
                <span>Answered: {answers.filter((a) => a !== null).length}/{quiz.questions.length}</span>
                <span>Time remaining: <b>{formatTime(timeLeft)}</b></span>
              </div>
            </div>
            {/* Questions */}
            {quiz.questions.map((q, idx) => (
              <Card key={q.questionId} className="shadow-lg border-0 mb-6">
                <div className="mb-4 flex items-start">
                  <span className="font-semibold text-purple-600 mr-2">Question {idx + 1}:</span>
                  <span className="text-base font-medium text-gray-800 leading-relaxed">{q.question}</span>
                </div>
                <Radio.Group
                  value={answers[idx]}
                  onChange={e => handleAnswerChange(idx, e.target.value)}
                  disabled={showResult}
                  className="w-full"
                >
                  <div className="space-y-2">
                    {q.options.map((opt) => (
                      <div key={opt.optionId} className="group">
                        <Radio value={opt.optionId} className="radio-option w-full">
                          <div className={`w-full p-3 rounded-lg border-2 transition-all duration-200 cursor-pointer
                            ${answers[idx] === opt.optionId && !showResult ? "border-purple-500 bg-purple-50" :
                              showResult && result && result.correctAnswers && result.correctAnswers[idx] === opt.optionId ? "border-green-500 bg-green-50" :
                                showResult && answers[idx] === opt.optionId && result && result.correctAnswers && result.correctAnswers[idx] !== opt.optionId ? "border-red-500 bg-red-50" :
                                  "border-gray-200 hover:border-gray-300 hover:bg-gray-50"}
                          `}>
                            <div className="flex items-center justify-between">
                              <span className="text-base text-gray-700">{opt.content}</span>
                              {showResult && result && result.correctAnswers && result.correctAnswers[idx] === opt.optionId && (
                                <CheckOutlined className="text-green-500 text-xl" />
                              )}
                              {showResult && answers[idx] === opt.optionId && result && result.correctAnswers && result.correctAnswers[idx] !== opt.optionId && (
                                <CloseCircleTwoTone twoToneColor="#ff4d4f" />
                              )}
                            </div>
                          </div>
                        </Radio>
                      </div>
                    ))}
                  </div>
                </Radio.Group>
              </Card>
            ))}
            {/* Submit button */}
            <div className="flex flex-col items-center gap-4 mt-8">
              <Button type="primary" size="large" disabled={answers.some(a => a === null) || submitting} onClick={handleSubmit}>
                Submit Quiz
              </Button>
            </div>
          </>
        )}
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
