import React, { useState, useEffect, useRef } from "react";
import { Layout, Radio, Button, Card, Progress, Alert, Tag, Statistic, Divider } from "antd";
import {
  CheckCircleTwoTone,
  CloseCircleTwoTone,
  FormOutlined,
  ClockCircleOutlined,
  CheckOutlined,
} from "@ant-design/icons";

const { Content } = Layout;

function Quiz({
  quizId,
  fetchQuiz,
  submitQuiz,
  getQuizResult,
  completeQuiz,
  onQuizCompleted,
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
  const timerRef = useRef();

  // Kiểm tra trạng thái quiz trước khi render
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
      try {
        // Ưu tiên quizId, fallback moduleId
        const id = quizId || (moduleId ? (await fetchQuiz(baseURL, moduleId)).data.quizId : null);
        if (!id) {
          setLoading(false);
          return;
        }
        // 1. Kiểm tra kết quả quiz trước
        const res = await getQuizResult(baseURL, id);
        if (!ignore && res.success && res.data) {
          setResult(res.data);
          setShowResult(true);
          setCanRetry(!res.data.isPassed); // Nếu pass thì không cho làm lại, fail thì cho làm lại
          setInitialResultChecked(true);
        } else {
          setShowResult(false);
          setResult(null);
          setCanRetry(false);
          setInitialResultChecked(true);
        }
        // 2. Luôn load quiz để lấy câu hỏi, thời gian
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

  // Đếm ngược thời gian
  useEffect(() => {
    if (!quiz || showResult) return;
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
  }, [quiz, showResult, timeLeft]);

  // Chuyển đổi giây sang mm:ss
  const formatTime = (sec) => {
    const m = Math.floor(sec / 60)
      .toString()
      .padStart(2, "0");
    const s = (sec % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  };

  // Chọn đáp án
  const handleAnswerChange = (qIdx, optionId) => {
    const newAnswers = [...answers];
    newAnswers[qIdx] = optionId;
    setAnswers(newAnswers);
  };

  // Nộp bài
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

  // Làm lại quiz
  const handleRetry = () => {
    setAnswers(Array(quiz.questions.length).fill(null));
    setShowResult(false);
    setResult(null);
    setTimeLeft(timer);
  };

  if (loading || !initialResultChecked) return <div className="text-center py-10">Đang tải quiz...</div>;
  if (!quiz) return <Alert type="error" message="Không tìm thấy quiz" showIcon />;

  // Nếu có kết quả và pass, chỉ hiển thị kết quả, không cho làm lại
  if (showResult && result && result.isPassed && !canRetry) {
    return (
      <Content className="flex-1 overflow-y-auto px-2 md:px-8 py-8">
        <div className="max-w-2xl mx-auto">
          <Card bordered className="mb-6 text-center">
            <div className="flex flex-col items-center gap-2">
              <CheckCircleTwoTone twoToneColor="#52c41a" style={{ fontSize: 48 }} />
              <h2 className="text-2xl font-bold text-green-700 mt-2 mb-1">Đã hoàn thành Quiz!</h2>
              <Tag color="green" className="text-base">Đã Pass</Tag>
              <Divider />
              <Statistic title="Điểm số" value={result.score} suffix={`/ ${quiz.passScore}`} />
              <Statistic title="Số câu đúng" value={`${result.correctAnswers}/${result.totalQuestions}`} />
              <Divider />
              <div className="text-gray-600">Bạn đã vượt qua quiz này. Chúc mừng!</div>
            </div>
          </Card>
        </div>
      </Content>
    );
  }

  return (
    <Content className="flex-1 overflow-y-auto px-2 md:px-8 py-8">
      <div className="max-w-2xl mx-auto">
        {/* Header Quiz */}
        <Card bordered className="mb-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
            <div className="flex items-center gap-2">
              <FormOutlined className="text-purple-500 text-xl" />
              <span className="text-xl font-bold">{quiz.quizName || "Quiz"}</span>
              {result?.isPassed ? (
                <Tag color="green">Đã Pass</Tag>
              ) : result ? (
                <Tag color="red">Chưa Pass</Tag>
              ) : null}
            </div>
            <div className="flex items-center gap-4">
              <span className="text-gray-600">Tổng số câu: <b>{quiz.questions.length}</b></span>
              <span className="text-gray-600">Điểm đạt: <b>{quiz.passScore}</b></span>
              {!result?.isPassed && (
                <span className="flex items-center text-red-500"><ClockCircleOutlined className="mr-1" />{formatTime(timeLeft)}</span>
              )}
            </div>
          </div>
        </Card>

        {/* Nếu đã nộp bài, hiển thị kết quả */}
        {showResult && result && (
          <Card bordered className="mb-6 text-center">
            <div className="flex flex-col items-center gap-2">
              {result.isPassed ? (
                <CheckCircleTwoTone twoToneColor="#52c41a" style={{ fontSize: 40 }} />
              ) : (
                <CloseCircleTwoTone twoToneColor="#ff4d4f" style={{ fontSize: 40 }} />
              )}
              <h3 className={`text-lg font-bold ${result.isPassed ? "text-green-700" : "text-red-700"}`}>{result.isPassed ? "Bạn đã vượt qua quiz!" : "Bạn chưa đạt, hãy thử lại."}</h3>
              <div className="flex flex-wrap justify-center gap-4 mt-2">
                <Statistic title="Điểm số" value={result.score} suffix={`/ ${quiz.passScore}`} />
                <Statistic title="Số câu đúng" value={`${result.correctAnswers}/${result.totalQuestions}`} />
              </div>
              <Divider />
              {canRetry && (
                <Button onClick={handleRetry} type="primary">Làm lại</Button>
              )}
            </div>
          </Card>
        )}

        {/* Nếu chưa nộp bài, hiển thị form quiz */}
        {!showResult && (
          <>
            {/* Progress Bar */}
            <div className="mb-6">
              <Progress percent={Math.round((answers.filter((a) => a !== null).length / quiz.questions.length) * 100)} showInfo={false} strokeColor="#722ed1" />
              <div className="flex justify-between text-sm text-gray-500 mt-1">
                <span>Câu đã trả lời: {answers.filter((a) => a !== null).length}/{quiz.questions.length}</span>
                <span>Thời gian còn lại: <b>{formatTime(timeLeft)}</b></span>
              </div>
            </div>
            {/* Questions */}
            {quiz.questions.map((q, idx) => (
              <Card key={q.questionId} className="shadow-lg border-0 mb-6">
                <div className="mb-4 flex items-start">
                  <span className="font-semibold text-purple-600 mr-2">Câu {idx + 1}:</span>
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
            {/* Nút nộp bài */}
            <div className="flex flex-col items-center gap-4 mt-8">
              <Button type="primary" size="large" disabled={answers.some(a => a === null) || submitting} onClick={handleSubmit}>
                Nộp bài
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
