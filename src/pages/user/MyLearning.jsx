import React, { useState, useEffect } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { Progress, Empty, Button, Spin } from "antd";
import img from "../../assets/img/special_cource_1.png";
import { fetchCoursesEnroll } from "../../api/courseApi";

function MyLearning() {
  const { myLearningTab } = useParams();
  const navigate = useNavigate();

  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState(myLearningTab || "in-progress");

  // Fetch courses theo tab
  const fetchCoursesEnrollData = async (tab) => {
    setLoading(true);
    setError("");
    try {
      const result = await fetchCoursesEnroll(tab);
      if (!result.success) {
        setError(result.error);
        setCourses([]);
        return;
      }
      setCourses(result.data);
    } catch (error) {
      setError(error.message);
      setCourses([]);
    } finally {
      setLoading(false);
    }
  };

  // Khi tab trên URL thay đổi, cập nhật state và fetch lại
  useEffect(() => {
    const tab = myLearningTab === "completed" ? "completed" : "in-progress";
    setActiveTab(tab);
    fetchCoursesEnrollData(tab);
  }, [myLearningTab]);

  // Xử lý khi click tab
  const handleTabChange = (tab) => {
    if (tab !== activeTab) {
      navigate(`/user/my-learning/${tab}`);
    }
  };

  if (loading)
    return (
      <div className="flex justify-center items-center h-screen">
        <Spin size="large" />
      </div>
    );
  if (error)
    return (
      <div className="flex justify-center items-center h-screen">
        <Empty
          message="Lỗi"
          description={error}
          type="error"
          showIcon
          className="max-w-md"
        />
      </div>
    );

  return (
    <div className="container p-4 mt-10">
      <h1 className="font-bold text-4xl">My learning</h1>
      <div className="flex gap-3 mt-4">
        <button
          className={`border border-gray-700 rounded-3xl p-2 text-xs text-gray-700 
          active:bg-orange-400 active:text-white 
            ${activeTab === "in-progress"
              ? "bg-gray-500 text-white border-gray-500 hover:border-orange-500 hover:bg-orange-500 hover:text-white"
              : "hover:border-orange-500 hover:bg-gray-100 hover:text-orange-500 "
            }`}
          onClick={() => handleTabChange("in-progress")}
        >
          In Progress
        </button>
        <button
          className={`border border-gray-700 rounded-3xl p-2 text-xs text-gray-700 
          active:bg-orange-400 active:text-white 
            ${activeTab === "completed"
              ? "bg-gray-500 text-white border-gray-500 hover:border-orange-500 hover:bg-orange-500 hover:text-white"
              : "hover:border-orange-500 hover:bg-gray-100 hover:text-orange-500 "
            }`}
          onClick={() => handleTabChange("completed")}
        >
          Completed
        </button>
      </div>
      {courses.length === 0 ? (
        <div>
          <Empty
            className="flex flex-col items-center justify-center m-10 mb-20"
            description="Chưa có khóa học"
          >
          </Empty>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-6">
          {courses.map((course) => (
            <Link
              key={course.id}
              className="bg-white rounded-xl shadow-sm hover:shadow-md hover:scale-105 transition-all duration-300 ease-in-out"
              to={`/courses/${course.courseId}`}
            >
              <img
                src={course.courseImgUrl || img}
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
                  <Progress
                    percent={course.percentCompleted}
                    strokeColor={"#f97316"}
                  />
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

export default MyLearning;
