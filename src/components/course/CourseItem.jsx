import React from "react";
import { Link } from "react-router-dom";
import { Users, CirclePlay, Clock } from "lucide-react";
import img from "../../assets/img/special_cource_1.png";
function Courses({ course }) {
  return (
    <Link
      className="bg-white rounded-xl shadow-sm hover:shadow-md hover:scale-105 transition-all duration-300 ease-in-out"
      to={`/courses/${course.courseId}`}
    >
      <img
        src={course.image || img}
        alt={`${course.courseName} Course`}
        className="w-full h-48 object-cover rounded-t-2xl"
      />
      <div className="p-6 space-y-4">
        <Link
          to={`/courses/${course.courseId}`}
          className="block h-18 hover:text-orange-500 transition-colors"
        >
          <h3 className="text-lg font-semibold text-blue-950 line-clamp-2">
            {course.courseName}
          </h3>
        </Link>
        <div className="justify-between flex items-center mb-4">
          <h4 className="text-2xl font-bold text-orange-500">
            {course.price === 0
              ? "Free"
              : course.price.toLocaleString("vi-VN", {
                  style: "currency",
                  currency: "VND",
                })}
          </h4>
          <Link
            to="/courseDetail"
            className="inline-block px-2 py-1 bg-orange-100 text-orange-500 rounded-full text-xs font-medium"
          >
            {course.category[0]}
          </Link>
        </div>

        <div className="justify-between flex items-center mt-4">
          {/* Users metric */}
          <div className="flex items-center gap-2 text-gray-600">
            <Users className="w-4 h-4" />
            <span className="text-sm font-medium">{course.enrollmentQuantity}</span>
          </div>

          {/* Play/Views metric */}
          <div className="flex items-center gap-2 text-gray-600">
            <CirclePlay className="w-4 h-4" />
            <span className="text-sm font-medium">{course.lessonQuantity}</span>
          </div>

          {/* Time metric */}
          <div className="flex items-center gap-2 text-gray-600">
            <Clock className="w-4 h-4" />
            <span className="text-sm font-medium">{course.studyTime}</span>
          </div>
        </div>
      </div>
    </Link>
  );
}

export default Courses;
