import { Button } from "antd";
import React from "react";
import img from "../../assets/img/special_cource_1.png";
import { Link } from "react-router-dom";

function SidebarCourseDetail({ course }) {
  return (
    <div className="w-full lg:w-1/3 px-4 mt-8 lg:mt-0">
      <div className="lg:sticky lg:top-24">
        <img
          className="w-full rounded-lg shadow-md h-64 object-cover mb-6"
          src={course.image || img}
          alt="Course"
        />
        <div className="flex justify-center my-6">
          <div className="text-red-600 text-3xl font-bold">
            {course.price === 0
              ? "Free"
              : course.price.toLocaleString("vi-VN", {
                  style: "currency",
                  currency: "VND",
                })}
          </div>
        </div>
        <div className="p-6 mb-8">
          <ul className="space-y-4">
            <li className="flex justify-between items-center">
              <p className="text-gray-600">Level:</p>
              <span className="text-black font-semibold">
                {course.levelName}
              </span>
            </li>
            <li className="flex justify-between items-center">
              <p className="text-gray-600">Language:</p>
              <span className="text-black font-semibold">
                {course.language}
              </span>
            </li>
            <li className="flex justify-between items-center">
              <p className="text-gray-600">Study time:</p>
              <span className="text-black font-semibold">
                {course.studyTime}
              </span>
            </li>
          </ul>
          <Link to={`/user/course-learning/${course.courseId}`}>
            <Button
              type="primary"
              className="w-full mt-6 px-6 py-3 bg-sky-600 text-white rounded-lg hover:bg-sky-500 hover:scale-102 transition-all ease-in-out"
            >
              Enroll the course
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default SidebarCourseDetail;
