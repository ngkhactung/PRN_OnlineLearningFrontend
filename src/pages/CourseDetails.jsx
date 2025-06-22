import React, {useState, useEffect} from "react";
import { Button, Collapse } from "antd";
import { CaretRightOutlined, PlayCircleOutlined } from "@ant-design/icons";
import SidebarCourseDetail from "../components/course/SidebarCourseDetail";
import { useParams } from "react-router-dom";
function CourseDetails() {
  const [activeKeys, setActiveKeys] = useState(["1"]);

  // call API to fetch data
  const [course, setCourse] = useState(null);
  const {id} = useParams();
  useEffect(() => {
    fetch(`https://localhost:5000/api/courses/${id}`)
      .then((res) => res.json())
      .then((json) => {
        if (json.success) {
          setCourse(json.data);
        } else {
          console.error("API returned failure:", json.message);
        }
      })
      .catch((err) => console.error("Fetch error:", err));
  }, []);

  const courseData = {
    title: "Nội dung khóa học",
    stats: {
      chapters: 11,
      lessons: 138,
      duration: "10 giờ 29 phút",
    },
    chapters: [
      {
        key: "1",
        title: "1. Giới thiệu",
        lessonCount: 3,
        lessons: [
          { title: "1. Giới thiệu khóa học", duration: "01:03" },
          { title: "2. Cài đặt Dev - C++", duration: "02:31" },
          { title: "3. Hướng dẫn sử dụng Dev - C++", duration: "03:33" },
        ],
      },
      {
        key: "2",
        title: "2. Biến và kiểu dữ liệu",
        lessonCount: 32,
        lessons: [],
      },
      {
        key: "3",
        title: "3. Cấu trúc điều khiển và vòng lặp",
        lessonCount: 27,
        lessons: [],
      },
      {
        key: "4",
        title: "4. Mảng",
        lessonCount: 18,
        lessons: [],
      },
      {
        key: "5",
        title: "5. String",
        lessonCount: 6,
        lessons: [],
      },
    ],
  };

  const handleExpandAll = () => {
    const allKeys = courseData.chapters.map((chapter) => chapter.key);
    setActiveKeys(activeKeys.length === allKeys.length ? [] : allKeys);
  };

  const handleCollapseChange = (keys) => {
    setActiveKeys(keys);
  };

  const renderLessonItem = (lesson, index) => (
    <div
      key={index}
      className="flex items-center justify-between py-2 px-4 hover:bg-gray-50 rounded-md"
    >
      <div className="flex items-center gap-3">
        <CaretRightOutlined className="!text-orange-500" />
        <span className="text-gray-700">{lesson.title}</span>
      </div>
      <span className="text-gray-500 text-sm">{lesson.duration}</span>
    </div>
  );

  const items = courseData.chapters.map((chapter) => ({
    key: chapter.key,
    label: (
      <div className="flex items-center justify-between w-full pr-4">
        <span className="font-medium text-gray-800">{chapter.title}</span>
        <span className="text-gray-500 text-sm">
          {chapter.lessonCount} bài học
        </span>
      </div>
    ),
    children:
      chapter.lessons.length > 0 ? (
        <div className="space-y-1">
          {chapter.lessons.map((lesson, index) =>
            renderLessonItem(lesson, index)
          )}
        </div>
      ) : (
        <div className="text-gray-500 text-center py-4">
          Nội dung sẽ được cập nhật
        </div>
      ),
  }));
  if (!course) return <p>Loading...</p>;
  return (
    <>
      <section className="py-16 mt-10">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap -mx-4">
            {/* Left Column */}
            <div className="w-full lg:w-2/3 px-4">
              <div className="bg-white rounded-lg shadow-md p-8">
                <h4 className="text-2xl font-bold mb-4 text-gray-800">{course?.courseName}</h4>
                <div className="text-gray-600 space-y-4">
                  {course.description}
                </div>
                <div className="flex justify-between">
                  <h4 className="text-2xl font-bold mt-8 mb-4 text-gray-800">
                    Noi dung khoa hoc
                  </h4>

                  <Button
                    onClick={handleExpandAll}
                    type="primary"
                    className="mt-8 mb-4 ml-10"
                  >
                    Expand All
                  </Button>
                </div>
                <Collapse
                  activeKey={activeKeys}
                  onChange={handleCollapseChange}
                  expandIcon={({ isActive }) => (
                    <CaretRightOutlined
                      rotate={isActive ? 90 : 0}
                      className="!text-orange-500"
                    />
                  )}
                  items={items}
                  className="course-collaps"
                  ghost
                />
              </div>
            </div>
            <SidebarCourseDetail course={course}/>
          </div>
        </div>
      </section>
    </>
  );
}

export default CourseDetails;
