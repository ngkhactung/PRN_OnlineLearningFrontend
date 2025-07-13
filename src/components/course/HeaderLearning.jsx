import React from "react";
import { Button, Progress, Layout } from "antd";
import { ArrowLeftOutlined } from "@ant-design/icons";
function HeaderLearning({ course,completedLessons }) {
  return (
    <>
      {/* Header cố định */}
      <div className="flex items-center justify-between px-6 sticky top-0 z-20 h-20 bg-cyan-900">
        <div className="flex items-center gap-4">
          <Button
            type="text"
            icon={<ArrowLeftOutlined />}
            href={`/courses/${course.courseId}`}
            style={{ color: "#fff" }}
            className="text-lg"
          ></Button>
          <span className="text-xl font-bold ml-4 text-white">
            {course?.courseName || "Khóa học"}
          </span>
        </div>
        <div className="flex items-center gap-4">
          <Progress
            type="circle"
            size={50}
            strokeColor="#1677ff"
            percent={course.progress || 0}
            format={(percent) => <span style={{ color: "white" }}>{percent}%</span>}
          />

          <span className="font-semibold text-white">
            {completedLessons.length || 0}/{course.lessonQuantity} bài
          </span>
        </div>
      </div>
    </>
  );
}

export default HeaderLearning;
