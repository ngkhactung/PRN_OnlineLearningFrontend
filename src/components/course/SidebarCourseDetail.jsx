import React, { useEffect, useState } from "react";
import { Button, Modal, message } from "antd";
import img from "../../assets/img/special_cource_1.png";
import { useNavigate } from "react-router-dom";
import { checkEnrollment, enrollCourse } from "../../api/courseApi";
import useAuth from "../../utils/useAuth";
import { cartService } from "../../services/cartService";
import AddToCartModal from "../common/AddToCartModal";

function SidebarCourseDetail({ course }) {
  const isLoggedIn = useAuth();
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [isInCart, setIsInCart] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showAddToCartModal, setShowAddToCartModal] = useState(false);
  const [addedCourseData, setAddedCourseData] = useState(null);
  const [modalType, setModalType] = useState("success"); // "success" hoặc "error"
  const [modalContent, setModalContent] = useState("");
  const navigate = useNavigate();

  const handleOk = () => {
    setIsModalOpen(false);
  };
  const handleCancel = () => {
    setIsModalOpen(false);
  };
  useEffect(() => {
    if (isLoggedIn && course?.courseId) {
      // Check enrollment
      checkEnrollment(course.courseId).then((res) => {
        console.log("Enrollment API result:", res);
        setIsEnrolled(res);
      });

      // Check if course is in cart
      setIsInCart(cartService.isInCart(course.courseId));
    }
  }, [isLoggedIn, course?.courseId]);

  //* Xử lí ADD TO CART ở đây
  const handleAddToCart = async () => {
    if (!isLoggedIn) return navigate("/auth");
    
    const result = await cartService.addCartItem({ 
      courseId: course.courseId 
    });
    
    if (result.success) {
      setIsInCart(true);
      setAddedCourseData(result.data); // Store the course data from API response
      setShowAddToCartModal(true); // Show popup instead of message
      
      // Trigger header cart count update
      window.dispatchEvent(new CustomEvent('cartUpdated'));
    } else {
      message.error(result.message);
    }
  };

  //* Xử lí GO TO CART ở đây
  const handleGoToCart = () => {
    navigate("/cart");
  };

  //* Xử lí BUY NOW ở đây
  const handleBuyNow = () => {
    if (!isLoggedIn) return navigate("/auth");
    // Chuyển sang trang thanh toán
  };

  const handleEnrollNow = async () => {
    if (!isLoggedIn) return navigate("/auth");
    const result = await enrollCourse(course.courseId);
    if (result.success) {
      setModalType("success");
      setModalContent("You can start study now!");
      setIsModalOpen(true);
      setIsEnrolled(true);
    } else {
      setModalType("error");
      setModalContent("Something error, please try again!");
      setIsModalOpen(true);
    }
  };

  const handleGoToLearning = () => {
    navigate(`/user/course-learning/${course.courseId}`);
  };
  console.log(isEnrolled);
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
          <Modal
            title={modalType === "success" ? "Enroll successful" : "Enroll fail, retry later"}
            open={isModalOpen}
            onOk={handleOk}
            onCancel={handleCancel}
            centered
          >
            <p>{modalContent}</p>
          </Modal>
          
          {!isLoggedIn || (isLoggedIn && !isEnrolled) ? (
            <>
              {isLoggedIn && course.price === 0 && !isEnrolled ? (
                <Button
                  type="primary"
                  className="w-full mt-6"
                  onClick={handleEnrollNow}
                >
                  Enroll now
                </Button>
              ) : (
                <>
                  {!isInCart ? (
                    <Button
                      className="w-full mt-6"
                      onClick={handleAddToCart}
                    >
                      Add To Cart
                    </Button>
                  ) : (
                    <Button
                      className="w-full mt-6"
                      onClick={handleGoToCart}
                    >
                      Go To Cart
                    </Button>
                  )}
                  <Button type="primary" className="w-full mt-2" onClick={handleBuyNow}>
                    Buy Now
                  </Button>
                </>
              )}
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
      
      {/* Add to Cart Modal */}
      <AddToCartModal
        visible={showAddToCartModal}
        onClose={() => setShowAddToCartModal(false)}
        courseData={addedCourseData}
      />
    </div>
  );
}

export default SidebarCourseDetail;
