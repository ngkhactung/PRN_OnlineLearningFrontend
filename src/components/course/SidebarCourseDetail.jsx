import React, { useEffect, useState } from "react";
import { Button } from "antd";
import img from "../../assets/img/special_cource_1.png";
import { Link, useNavigate } from "react-router-dom";
import { checkEnrollment } from "../../api/courseApi";
import useAuth from "../../utils/useAuth";

function SidebarCourseDetail({ course }) {
  const isLoggedIn = useAuth();
  const [isEnrolled, setIsEnrolled] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (isLoggedIn) {
      checkEnrollment(course.courseId).then(setIsEnrolled);
    }
  }, [isLoggedIn, course.courseId]);

  //* Xử lí ADD TO CART ở đây
  const handleAddToCart = () => {
    if (!isLoggedIn) return navigate("/login");
    // Thêm vào giỏ hàng
  };

  //* Xử lí BUY NOW ở đây
  const handleBuyNow = () => {
    if (!isLoggedIn) return navigate("/login");
    // Chuyển sang trang thanh toán
  };

  const handleGoToLearning = () => {
    navigate(`/user/course-learning/${course.courseId}`);
  };

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
          {!isLoggedIn || (isLoggedIn && !isEnrolled) ? (
            <>
              <Button type="primary" className="w-full mt-6" onClick={handleAddToCart}>
                Add To Cart
              </Button>
              <Button className="w-full mt-2" onClick={handleBuyNow}>
                Buy Now
              </Button>
            </>
          ) : (
            <Button
              type="primary"
              className="w-full mt-6"
              onClick={handleGoToLearning}
            >
              Continue Study
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}

export default SidebarCourseDetail;
