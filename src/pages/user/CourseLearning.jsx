import { Layout, Menu, Button, Empty, Alert, Spin } from "antd";
import { useState, useEffect, useRef } from "react";
import { CheckOutlined } from "@ant-design/icons";
import { useParams } from "react-router-dom";
import Learning from "../../components/course/Learning";
import HeaderLearning from "../../components/course/HeaderLearning";
import Quiz from '../../components/course/Quizzes';
const { Sider } = Layout;

function CourseLearning() {
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentLesson, setCurrentLesson] = useState(null);
  const [error, setError] = useState(null);
  const [completedLessons, setCompletedLessons] = useState([]);
  const { courseId } = useParams();
  const baseURL = import.meta.env.VITE_API_BASE_URL;
  const playerRef = useRef(null);
  const [selectedLesson, setSelectedLesson] = useState(null);
  const [selectedQuiz, setSelectedQuiz] = useState(null);
  const questions = [
    {
      question: "ABC is acbd?",
      options: ["Option A", "Option B", "Option C"],
      correct: 1, // index của đáp án đúng
    },
    // ... các câu hỏi khác
  ];
  // Hàm tìm lesson tiếp theo sau lesson cuối cùng đã hoàn thành
  const findNextLesson = (modules, lessonIdCompleted) => {
    if (!lessonIdCompleted || lessonIdCompleted.length === 0) {
      // Nếu chưa hoàn thành bài nào, trả về bài đầu tiên
      if (modules && modules.length > 0) {
        const firstModule = modules[0];
        if (firstModule.lessons && firstModule.lessons.length > 0) {
          return firstModule.lessons[0];
        }
      }
      return null;
    }

    // Tìm lesson cuối cùng đã hoàn thành
    const lastCompletedId = Math.max(...lessonIdCompleted);

    // Tạo danh sách tất cả lessons để tìm lesson tiếp theo
    const allLessons = [];
    modules.forEach((module) => {
      if (module.lessons) {
        allLessons.push(...module.lessons);
      }
    });

    // Sắp xếp theo lessonId để đảm bảo thứ tự
    allLessons.sort((a, b) => a.lessonId - b.lessonId);

    // Tìm index của lesson cuối cùng đã hoàn thành
    const lastCompletedIndex = allLessons.findIndex(
      (lesson) => lesson.lessonId === lastCompletedId
    );

    // Trả về lesson tiếp theo
    if (lastCompletedIndex >= 0 && lastCompletedIndex < allLessons.length - 1) {
      return allLessons[lastCompletedIndex + 1];
    }

    // Nếu đã hoàn thành tất cả lessons, trả về lesson cuối cùng
    return allLessons[allLessons.length - 1];
  };

  // Load course data
  useEffect(() => {
    if (courseId) {
      console.log("Loading course data for ID:", courseId);

      fetch(`${baseURL}/courses/learning/${courseId}`)
        .then((res) => res.json())
        .then((json) => {
          console.log("Course data loaded:", json);

          if (json.success) {
            setCourse(json.data);
            setCompletedLessons(json.data.lessonIdCompleted || []);

            // Kiểm tra xem course có modules và lessons không
            if (json.data.modules && json.data.modules.length > 0) {
              const hasLessons = json.data.modules.some(
                (module) => module.lessons && module.lessons.length > 0
              );

              if (hasLessons) {
                // Tìm current lesson dựa trên lessonIdCompleted
                const nextLesson = findNextLesson(
                  json.data.modules,
                  json.data.lessonIdCompleted
                );
                if (nextLesson) {
                  setCurrentLesson(nextLesson);
                  console.log("Current lesson set to:", nextLesson);
                } else {
                  setError("Không thể xác định bài học tiếp theo.");
                }
              } else {
                setError("Khóa học này chưa có bài học nào.");
              }
            } else {
              setError("Khóa học này chưa có module nào.");
            }
          } else {
            setError(json.message || "Không thể tải thông tin khóa học.");
          }
        })
        .catch((err) => {
          console.error("Fetch error:", err);
          setError("Lỗi kết nối. Vui lòng thử lại sau.");
        })
        .finally(() => setLoading(false));
    }
  }, [courseId,baseURL]);

  const handleMenuSelect = ({ key }) => {
    if (!course || !course.modules) return;

    // Tìm trong tất cả modules
    for (const module of course.modules) {
      // Tìm lesson
      const lesson = (module.lessons || []).find(
        (l) => `lesson-${l.lessonId}` === key
      );
      if (lesson) {
        setSelectedLesson(lesson);
        setSelectedQuiz(null);
        return;
      }
      // Tìm quiz
      const quiz = (module.quizzes || []).find(
        (q) => `quiz-${q.quizId}` === key
      );
      if (quiz) {
        setSelectedQuiz(quiz);
        setSelectedLesson(null);
        return;
      }
    }
  };

  // Cleanup khi component unmount
  useEffect(() => {
    return () => {
      if (playerRef.current) {
        try {
          playerRef.current.destroy();
        } catch (error) {
          console.warn("Error destroying player on cleanup:", error);
        }
      }
    };
  }, []);

  useEffect(() => {
    if (!currentLesson || !currentLesson.urlVideo) return;

    // Hàm tạo player
    function createPlayer() {
      if (playerRef.current) {
        playerRef.current.destroy();
      }
      playerRef.current = new window.YT.Player("lessonVideo", {
        events: {
          onStateChange: onPlayerStateChange,
        },
      });
    }

    // Hàm xử lý khi video end
    function onPlayerStateChange(event) {
      if (event.data === window.YT.PlayerState.ENDED) {
        console.log("Video ended, marking lesson as completed");
        // Gọi API backend khi video kết thúc
        fetch(`${baseURL}/courses/mark-as-completed`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(currentLesson.lessonId),
        })
          .then((res) => res.json())
          .then((data) => {
            if (data.success) {
              // Cập nhật UI dấu tích
              setCompletedLessons((prev) => [...prev, currentLesson.lessonId]);
            }
          });
      }
    }

    // Load YT API nếu chưa có
    if (!window.YT || !window.YT.Player) {
      const tag = document.createElement("script");
      tag.src = "https://www.youtube.com/iframe_api";
      document.body.appendChild(tag);
      window.onYouTubeIframeAPIReady = createPlayer;
    } else {
      createPlayer();
    }

    // Cleanup khi unmount hoặc đổi lesson
    return () => {
      if (playerRef.current) {
        playerRef.current.destroy();
      }
    };
  }, [currentLesson,baseURL]);

  useEffect(() => {
    if (course && course.modules && course.modules.length > 0) {
      const firstModule = course.modules[0];
      if (firstModule.lessons && firstModule.lessons.length > 0) {
        setSelectedLesson(firstModule.lessons[0]);
        setSelectedQuiz(null);
      } else if (firstModule.quizzes && firstModule.quizzes.length > 0) {
        setSelectedQuiz(firstModule.quizzes[0]);
        setSelectedLesson(null);
      }
    }
  }, [course]);

  // Flatten tất cả items (lesson và quiz) của module hiện tại
  const allMenuItems = [];
  if (course && course.modules) {
    course.modules.forEach((module) => {
      // lesson
      (module.lessons || []).forEach((lesson) => {
        allMenuItems.push({ type: 'lesson', id: lesson.lessonId, data: lesson });
      });
      // quiz
      (module.quizzes || []).forEach((quiz) => {
        allMenuItems.push({ type: 'quiz', id: quiz.quizId, data: quiz });
      });
    });
  }

  let currentIndex = -1;
  if (selectedLesson) {
    currentIndex = allMenuItems.findIndex(
      (item) => item.type === 'lesson' && item.id === selectedLesson.lessonId
    );
  } else if (selectedQuiz) {
    currentIndex = allMenuItems.findIndex(
      (item) => item.type === 'quiz' && item.id === selectedQuiz.quizId
    );
  }
  const handlePrevLesson = () => {
    if (currentIndex > 0) {
      const prevItem = allMenuItems[currentIndex - 1];
      if (prevItem.type === 'lesson') {
        setSelectedLesson(prevItem.data);
        setSelectedQuiz(null);
      } else if (prevItem.type === 'quiz') {
        setSelectedQuiz(prevItem.data);
        setSelectedLesson(null);
      }
    }
  };

  const handleNextLesson = () => {
    if (currentIndex < allMenuItems.length - 1) {
      const nextItem = allMenuItems[currentIndex + 1];
      if (nextItem.type === 'lesson') {
        setSelectedLesson(nextItem.data);
        setSelectedQuiz(null);
      } else if (nextItem.type === 'quiz') {
        setSelectedQuiz(nextItem.data);
        setSelectedLesson(null);
      }
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Spin size="large" />
      </div>
    );
  }

  if (error) {
    console.log(error);
    return (
      <div className="flex justify-center items-center h-screen">
        <Empty
          message="Lỗi"
          description={error}
          type="error"
          showIcon
          className="max-w-md"
        />
      </div>
    );
  }

  if (!course) {
    console.log("Không tìm thấy khóa học");

    return (
      <div className="flex justify-center items-center h-screen">
        <Alert
          message="Không tìm thấy khóa học"
          description="Khóa học bạn đang tìm kiếm không tồn tại."
          type="warning"
          showIcon
          className="max-w-md"
        />
      </div>
    );
  }

  // Kiểm tra xem course có modules và lessons không
  const hasModules = course.modules && course.modules.length > 0;
  const hasLessons =
    hasModules &&
    course.modules.some(
      (module) => module.lessons && module.lessons.length > 0
    );

  if (!hasModules) {
    console.log("Khóa học này chưa có nội dung");
    return (
      <Layout className="min-h-screen flex flex-col overflow-hidden">
        <HeaderLearning course={course} />
        <div className="flex-1 flex justify-center items-center">
          <Empty description="Khóa học này chưa có nội dung" />
        </div>
      </Layout>
    );
  }

  if (!hasLessons) {
    console.log("Khóa học này chưa có bài học nào");
    return (
      <Layout className="min-h-screen flex flex-col overflow-hidden">
        <HeaderLearning course={course} />
        <div className="flex-1 flex justify-center items-center">
          <Empty description="Khóa học này chưa có nội dung" />
        </div>
      </Layout>
    );
  }

  // Tạo menu items từ dữ liệu modules và lessons
  const items = course.modules.map((module) => ({
    key: `${module.moduleId}`,
    label: module.moduleName,
    children: [
      // Lesson items
      ...(module.lessons || []).map((lesson) => ({
        key: `lesson-${lesson.lessonId}`,
        label: (
          <div className="flex items-center justify-between">
            <span>{lesson.lessonName}</span>
            {completedLessons.includes(lesson.lessonId) && (
              <CheckOutlined style={{ color: "#22c55e", fontSize: "20px" }} />
            )}
          </div>
        ),
        type: 'lesson',
        lesson, // truyền lesson object để dùng khi click
      })),
      // Quiz items
      ...(module.quizzes || []).map((quiz, idx) => ({
        key: `quiz-${quiz.quizId}`,
        label: (
          <div className="flex items-center justify-between">
            <span>{quiz.quizName || `Quiz ${idx + 1}`}</span>
          </div>
        ),
        type: 'quiz',
        quiz, // truyền quiz object để dùng khi click
      })),
    ],
  }));

  let selectedMenuKey = [];
  if (selectedLesson) {
    selectedMenuKey = [`lesson-${selectedLesson.lessonId}`];
  } else if (selectedQuiz) {
    selectedMenuKey = [`quiz-${selectedQuiz.quizId}`];
  }

  return (
    <Layout className="min-h-screen flex flex-col overflow-hidden">
      {/* Header cố định */}
      <HeaderLearning course={course} completedLessons={completedLessons} />
      <Layout hasSider className="h-[calc(100vh-80px-64px)] overflow-hidden">
        <div className="flex-1 overflow-y-auto">
          <div className="flex-1 overflow-y-auto">
            {selectedLesson && <Learning lesson={selectedLesson} />}
            {selectedQuiz && (
              <Quiz
                questions={questions}
                // onFinish={(answers) => { /* xử lý khi hoàn thành quiz */ }}
              />
            )}
          </div>
        </div>
        {/* <Quizzes /> */}
        <Sider
          width={300}
          style={{
            overflowY: "auto",
            height: "100%",
            backgroundColor: "#fff",
            borderLeft: "1px solid #f0f0f0",
          }}
        >
          <Menu
            theme="light"
            mode="inline"
            selectedKeys={selectedMenuKey}
            defaultOpenKeys={course.modules.map(
              (module) => `${module.moduleId}`
            )}
            onSelect={handleMenuSelect}
            items={items}
          />
        </Sider>
        {/* Footer cố định */}
        <div className="fixed bottom-0 left-0 w-full bg-gray-100 shadow flex justify-center gap-4 py-4 z-30 mt-10">
          <Button onClick={handlePrevLesson} disabled={currentIndex <= 0}>
            Bài trước đó
          </Button>
          <Button
            type="primary"
            onClick={handleNextLesson}
            disabled={currentIndex >= allMenuItems.length - 1}
          >
            Bài tiếp theo
          </Button>
        </div>
      </Layout>
    </Layout>
  );
}

export default CourseLearning;
