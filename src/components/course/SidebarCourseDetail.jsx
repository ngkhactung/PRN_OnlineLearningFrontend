import { Button } from "antd";
import React from "react";
import courseImg from "../../assets/img/learning_img.png";

function SidebarCourseDetail({ course }) {
  return (
    <div className="w-full lg:w-1/3 px-4 mt-8 lg:mt-0">
      <div className="lg:sticky lg:top-24">
        <img
          className="w-full rounded-lg shadow-md"
          src={courseImg}
          alt="Course"
        />
        <div className="flex justify-center my-6">
          <div className="text-red-600 text-3xl font-bold">
            {course.price.toLocaleString("vi-VN", {
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
          <Button
            type="primary"
            to="/courseLearning"
            className="w-full mt-6 px-6 py-3 bg-sky-600 text-white rounded-lg hover:bg-sky-500 hover:scale-105 transition-all ease-in-out"
          >
            Enroll the course
          </Button>
        </div>
      </div>
    </div>
  );
}

export default SidebarCourseDetail;
