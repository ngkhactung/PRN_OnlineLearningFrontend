import React from "react";
import { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { Progress } from "antd";
import img from "../../assets/img/special_cource_1.png";

const sampleCourses = [
  {
    id: "1",
    name: "Complete Web Development Bootcamp",
    price: 99,
    category: "Web Development",
    image: "/placeholder.svg?height=200&width=300",
    students: "20.791",
    lessons: 28,
    duration: "4h59m",
  },
  {
    id: "2",
    name: "React Advanced Patterns and State Management with Redux Toolkit",
    price: 149,
    category: "Frontend",
    image: "/placeholder.svg?height=200&width=300",
    students: "15.432",
    lessons: 35,
    duration: "6h30m",
  },
  {
    id: "3",
    name: "Node.js Backend Development",
    price: 129,
    category: "Backend",
    image: "/placeholder.svg?height=200&width=300",
    students: "12.856",
    lessons: 42,
    duration: "8h15m",
  },
];
function MyLearning() {
  const [activeTab, setActiveTab] = useState("in-progress");
  const { myLearningTab } = useParams();
  useEffect(() => {
    setActiveTab(myLearningTab || "in-progress");
  }, [myLearningTab]);
  return (
    <div className="container p-4 mt-10">
      <h1 className="font-bold text-4xl">My learning</h1>
      <div className="flex gap-3 mt-4">
        <button
          className={`border border-gray-700 rounded-3xl p-2 text-xs text-gray-700 
            
          active:bg-orange-400 active:text-white 
            ${
              activeTab === "in-progress"
                ? "bg-gray-500 text-white border-gray-500 hover:border-orange-500 hover:bg-orange-500 hover:text-white"
                : "hover:border-orange-500 hover:bg-gray-100 hover:text-orange-500 "
            }`}
          onClick={() => setActiveTab("in-progress")}
        >
          In Progress
        </button>
        <button
          className={`border border-gray-700 rounded-3xl p-2 text-xs text-gray-700 
            
          active:bg-orange-400 active:text-white 
            ${
              activeTab === "completed"
                ? "bg-gray-500 text-white border-gray-500 hover:border-orange-500 hover:bg-orange-500 hover:text-white"
                : "hover:border-orange-500 hover:bg-gray-100 hover:text-orange-500 "
            }`}
          onClick={() => setActiveTab("completed")}
        >
          Completed
        </button>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-6">
        {sampleCourses.length === 0 ? (
          <div>Khong tim thay</div>
        ) : (
          sampleCourses.map((course) => (
            <Link
              className="bg-white rounded-xl shadow-sm hover:shadow-md hover:scale-105 transition-all duration-300 ease-in-out"
              to={`/courses/${course.id}`}
            >
              <img
                src={img}
                alt={`${course.name} Course`}
                className="w-full h-48 object-cover rounded-t-2xl"
              />
              <div className="p-6 space-y-4">
                <Link
                  to={`/courses/${course.id}`}
                  className="block h-18 hover:text-orange-500 transition-colors"
                >
                  <h3 className="text-lg font-semibold text-blue-950 line-clamp-2">
                    {course.name}
                  </h3>
                </Link>
                <div className="justify-between flex items-center mb-4">
                  <Progress percent={30} strokeColor={"#f97316"} />
                </div>
              </div>
            </Link>
          ))
        )}
      </div>
    </div>
  );
}

export default MyLearning;
