import React, { useState, useEffect } from "react";
import { Button, Collapse } from "antd";
import { CaretRightOutlined } from "@ant-design/icons";
import SidebarCourseDetail from "../components/course/SidebarCourseDetail";
import { useParams } from "react-router-dom";
function CourseDetails() {
  const [activeKeys, setActiveKeys] = useState(["1"]);

  // call API to fetch data
  const [course, setCourse] = useState(null);
  const { id } = useParams();
  const baseURL = import.meta.env.VITE_API_BASE_URL;

  useEffect(() => {
    fetch(`${baseURL}/courses/${id}`)
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
        <span className="text-gray-700">{lesson.lessonName}</span>
      </div>
      <span className="text-gray-500 text-sm">{lesson.duration}p</span>
    </div>
  );
  if (!course) return <p>Loading...</p>;
  const items = course.modules.map((module) => ({
      key: module.key,
      label: (
        <div className="flex items-center justify-between w-full pr-4">
          <span className="font-medium text-gray-800">{module.moduleName}</span>
          <span className="text-gray-500 text-sm">
            {module.lessons?.length || 0} bài học
          </span>
        </div>
      ),
      children:
        module.lessons.length > 0 ? (
          <div className="space-y-1">
            {module.lessons.map((lesson, index) =>
              renderLessonItem(lesson, index)
            )}
          </div>
        ) : (
          <div className="text-gray-500 text-center py-4">
            Nội dung sẽ được cập nhật
          </div>
        ),
    })) || [];

  return (
    <>
      <section className="py-16 ">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap -mx-4">
            {/* Left Column */}
            <div className="w-full lg:w-2/3 px-4">
              <div className="bg-white rounded-lg shadow-md p-8">
                <h4 className="text-2xl font-bold mb-4 text-gray-800">
                  {course?.courseName}
                </h4>
                <div className="text-gray-600 space-y-4">
                  {course.description}
                </div>
                <div className="flex justify-between">
                  <h4 className="text-2xl font-bold mt-8 mb-4 text-gray-800">
                    Noi dung khoa hoc
                  </h4>
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
            <SidebarCourseDetail course={course} />
          </div>
        </div>
      </section>
    </>
  );
}

export default CourseDetails;
