import { Layout, Menu, Button, Empty, Alert,Spin } from "antd";
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Learning from "../../components/course/Learning";
const { Sider } = Layout;

function CourseLearning() {
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentLesson, setCurrentLesson] = useState(null);
  const [error, setError] = useState(null);
  const { courseId } = useParams();
  const baseURL = import.meta.env.VITE_API_BASE_URL;

  useEffect(() => {
    if (courseId) {
      fetch(`${baseURL}/courses/${courseId}`)
        .then((res) => res.json())
        .then((json) => {
          if (json.success) {
            setCourse(json.data);
            // Kiểm tra xem course có modules và lessons không
            if (json.data.modules && json.data.modules.length > 0) {
              const firstModule = json.data.modules[0];
              if (firstModule.lessons && firstModule.lessons.length > 0) {
                setCurrentLesson(firstModule.lessons[0]);
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
  }, [courseId]);

  // Xử lý khi user click vào lesson trong menu
  const handleLessonSelect = ({ key }) => {
    if (!course || !course.modules) return;

    // Tìm lesson dựa trên key
    for (const module of course.modules) {
      const lesson = module.lessons.find(
        (lesson) => lesson.lessonId.toString() === key
      );
      if (lesson) {
        setCurrentLesson(lesson);
        break;
      }
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Spin size="large"/>
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
      <div className="flex justify-center items-center h-screen">
        <Empty description="Khóa học này chưa có nội dung" />
      </div>
    );
  }

  if (!hasLessons) {
    console.log("Khóa học này chưa có bài học nào");
    return (
      <div className="flex justify-center items-center h-screen">
        <Empty description="Khóa học này chưa có bài học nào" />
      </div>
    );
  }

  // Tạo menu items từ dữ liệu modules và lessons
  const items = course.modules.map((module) => ({
    key: `sub${module.moduleId}`,
    label: module.moduleName,
    children:
      module.lessons && module.lessons.length > 0
        ? module.lessons.map((lesson) => ({
            key: lesson.lessonId.toString(),
            label: lesson.lessonName,
          }))
        : [],
  }));

  return (
    <Layout hasSider className="h-[calc(100vh-80px-64px)] overflow-hidden">
      <Learning lesson={currentLesson} />
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
          defaultSelectedKeys={
            currentLesson ? [currentLesson.lessonId.toString()] : []
          }
          onSelect={handleLessonSelect}
          items={items}
        />
      </Sider>
      {/* Footer cố định */}
      <div className="fixed bottom-0 left-0 w-full bg-gray-100 shadow flex justify-center gap-4 py-4 z-30 mt-10">
        <Button>Bài trước đó</Button>
        <Button type="primary">Bài tiếp theo</Button>
      </div>
    </Layout>
  );
}

export default CourseLearning;
