import React from "react";
import { Link } from "react-router-dom";
import { Users, CirclePlay, Clock } from "lucide-react";
import img from "../../assets/img/special_cource_1.png";
function Courses({ course }) {
  return (
    <Link
      key={course.id}
      className="bg-white rounded-xl shadow-sm hover:shadow-md hover:scale-105 transition-all duration-300 ease-in-out"
      to="/courses/"
    >
      <img
        src={img}
        alt={`${course.name} Course`}
        className="w-full h-48 object-cover rounded-t-2xl"
      />
      <div className="p-6 space-y-4">
        <div className="justify-between flex items-center mb-4">
          <h4 className="text-2xl font-bold text-blue-950">
            {course.price.toLocaleString("vi-VN", {
              style: "currency",
              currency: "VND",
            })}
          </h4>
          <Link
            to="/courseDetail"
            className="inline-block px-4 py-1 bg-orange-100 text-orange-500 rounded-full text-sm font-medium"
          >
            {course.category}
          </Link>
        </div>
        <Link
          to="/courseDetail"
          className="block hover:text-orange-500 transition-colors"
        >
          <h3 className="text-xl font-semibold text-blue-950">{course.name}</h3>
        </Link>
        <div className="justify-between flex items-center mt-4">
          {/* Users metric */}
          <div className="flex items-center gap-2 text-gray-600">
            <Users className="w-4 h-4" />
            <span className="text-sm font-medium">20.791</span>
          </div>

          {/* Play/Views metric */}
          <div className="flex items-center gap-2 text-gray-600">
            <CirclePlay className="w-4 h-4" />
            <span className="text-sm font-medium">28</span>
          </div>

          {/* Time metric */}
          <div className="flex items-center gap-2 text-gray-600">
            <Clock className="w-4 h-4" />
            <span className="text-sm font-medium">4h59p</span>
          </div>
        </div>
      </div>
    </Link>
  );
}

export default Courses;
