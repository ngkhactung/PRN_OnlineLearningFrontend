import React from "react";
import { Link } from "react-router-dom";
import { Users, CirclePlay, Clock } from "lucide-react";

function SpecialCourse() {
  const courseItems = [
    {
      id: 1,
      name: "Web Development",
      price: 130,
      description:
        "Which whose darkness saying were life unto fish wherein all fish of together called",
      category: "Web Development",
      image: "img/special_cource_1.png",
    },
    {
      id: 2,
      name: "Web UX/UI Design",
      price: 160,
      description:
        "Which whose darkness saying were life unto fish wherein all fish of together called",
      category: "design",
      image: "img/special_cource_2.png",
    },
    {
      id: 3,
      name: "Wordpress Development",
      price: 140,
      description:
        "Which whose darkness saying were life unto fish wherein all fish of together called",
      category: "Wordpress",
      image: "img/special_cource_3.png",
    },
  ];

  return (
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="flex justify-center mb-12">
          <div className="text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-blue-950">
              Popular Courses
            </h2>
          </div>
        </div>

        {/* Course Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-16">
          {courseItems.map((course) => (
            <Link
              key={course.id}
              className="bg-white rounded-xl shadow-sm hover:shadow-md hover:scale-105 transition-all duration-300 ease-in-out"
              to="/courseDetail"
            >
              <img
                src={course.image}
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
                  <h3 className="text-xl font-semibold text-blue-950">
                    {course.name}
                  </h3>
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
          ))}
        </div>
      </div>
    </section>
  );
}

export default SpecialCourse;
