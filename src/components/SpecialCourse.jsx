import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { fetchSpecialCourses } from "../api/courseApi"; // Đường dẫn đúng
import { Users, CirclePlay, Clock } from "lucide-react";
import img from "../assets/img/special_cource_1.png";

function SpecialCourse() {
  const [courses, setCourses] = useState([]);

  useEffect(() => {
    fetchSpecialCourses().then(setCourses);
  }, []);

  return (
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="flex justify-center mb-12">
          <div className="text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-blue-950">
              Popular Courses
            </h2>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-16">
          {courses.map((course) => (
            <Link
              key={course.courseId}
              className="bg-white rounded-xl shadow-sm hover:shadow-md hover:scale-105 transition-all duration-300 ease-in-out"
              to={`/courses/${course.courseId}`}
            >
              <img
                src={course.image || img}
                alt={`${course.courseName} Course`}
                className="w-full h-48 object-cover rounded-t-2xl"
              />
              <div className="p-6 space-y-4">
                <div className="justify-between flex items-center mb-4">
                  <h4 className="text-2xl font-bold text-blue-950">
                    {course.price === 0
                      ? "Free"
                      : course.price.toLocaleString("vi-VN", {
                          style: "currency",
                          currency: "VND",
                        })}
                  </h4>
                  <span className="inline-block px-4 py-1 bg-orange-100 text-orange-500 rounded-full text-sm font-medium">
                    {course.category[0]}
                  </span>
                </div>
                <h3 className="text-xl font-semibold text-blue-950">
                  {course.courseName}
                </h3>
                <div className="justify-between flex items-center mt-4">
                  <div className="flex items-center gap-2 text-gray-600">
                    <Users className="w-4 h-4" />
                    <span className="text-sm font-medium">
                      {course.enrollmentQuantity}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <CirclePlay className="w-4 h-4" />
                    <span className="text-sm font-medium">
                      {course.lessonQuantity}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <Clock className="w-4 h-4" />
                    <span className="text-sm font-medium">
                      {course.studyTime}
                    </span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

export default SpecialCourse;
