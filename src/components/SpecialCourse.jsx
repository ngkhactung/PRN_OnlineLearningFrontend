import React from "react";
import { Link } from "react-router-dom";

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
            <p className="text-lg font-medium uppercase text-gray-600 mb-2">
              popular courses
            </p>
            <h2 className="text-3xl md:text-4xl font-bold text-blue-950">
              Special Courses
            </h2>
          </div>
        </div>

        {/* Course Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
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
                <a
                  href="course-details.html"
                  className="inline-block px-4 py-1 bg-orange-100 text-orange-500 rounded-full text-sm font-medium"
                >
                  {course.category}
                </a>
                <h4 className="text-2xl font-bold text-blue-950">
                  ${course.price}.00
                </h4>
                <a
                  href="course-details.html"
                  className="block hover:text-orange-500 transition-colors"
                >
                  <h3 className="text-xl font-semibold text-blue-950">
                    {course.name}
                  </h3>
                </a>
                <p className="text-gray-600">{course.description}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

export default SpecialCourse;
