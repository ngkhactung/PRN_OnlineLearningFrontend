import React from "react";
import Header from "../components/common/Header";
import Footer from "../components/common/Footer";
import { useState } from "react";
import { Collapse } from "antd";
import { CaretRightOutlined, PlayCircleOutlined } from "@ant-design/icons";
import SidebarCourseDetail from "../components/course/SidebarCourseDetail";
function CourseDetails() {
  const [activeKeys, setActiveKeys] = useState(["1"]);

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
  return (
    <>
      <Header />
      <section className="py-16 bg-gray-50 mt-10">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap -mx-4">
            {/* Left Column */}
            <div className="w-full lg:w-2/3 px-4">
              <div className="bg-white rounded-lg shadow-md p-8">
                <h4 className="text-2xl font-bold mb-4 text-gray-800">Title</h4>
                <div className="text-gray-600 space-y-4">
                  Description
                  <br />
                  <br />
                  Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed
                  do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                  Ut enim ad minim veniam, quis nostrud exercitation ullamco
                  laboris nisi ut aliquip ex ea commodoconsequat. Duis aute
                  irure dolor in reprehenderit in voluptate velit esse cillum.
                  Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed
                  do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                  Ut enim ad minim veniam, quis nostrud exercitation ullamco
                  laboris nisi ut aliquip ex ea commodo consequat. Duis aute
                  irure dolor in reprehenderit in voluptate velit esse cillum.
                </div>
                <div className="flex ">
                  <h4 className="text-2xl font-bold mt-8 mb-4 text-gray-800">
                    Noi dung khoa hoc
                  </h4>

                  <button
                    onClick={handleExpandAll}
                    className="bg-orange-500 text-white rounded-lg"
                  >
                    Expand All
                  </button>
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
            <SidebarCourseDetail />
          </div>
        </div>
      </section>
      <Footer />
    </>
  );
}

export default CourseDetails;
