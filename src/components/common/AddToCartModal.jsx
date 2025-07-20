import React from 'react';
import { Modal, Button } from 'antd';
import { CheckCircleOutlined, CloseOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import defaultCourseImg from '../../assets/img/cource/cource_1.png';

const AddToCartModal = ({ visible, onClose, courseData }) => {
  const navigate = useNavigate();

  const handleGoToCart = () => {
    onClose();
    navigate('/cart');
  };

  const handleContinueShopping = () => {
    onClose();
  };

  const handleCourseClick = () => {
    if (courseData?.courseId) {
      onClose();
      navigate(`/courses/${courseData.courseId}`);
    }
  };

  return (
    <Modal
      open={visible}
      onCancel={onClose}
      footer={null}
      width={650}
      centered
      closable={false}
      className="add-to-cart-modal"
      bodyStyle={{ padding: 0 }}
    >
      <div className="flex items-center justify-between py-5 bg-white rounded-lg">
        {/* Left side - Success icon and course info */}
        <div className="flex items-center space-x-3 flex-1">
          {/* Success icon */}
          <div className="flex-shrink-0">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
              <CheckCircleOutlined className="text-green-600 text-2xl" />
            </div>
          </div>
          
          {/* Course info */}
          <div className="flex items-center space-x-4 flex-1">
            <img
              src={courseData?.courseImgUrl || defaultCourseImg}
              alt={courseData?.courseName || 'Course'}
              className="w-17 h-17 object-cover rounded shadow-sm"
            />
            <div className="flex-1">
              {/* <h3 className="text-lg font-bold text-gray-800 mb-1">Added to cart</h3> */}
              <h3 
                className="text-lg font-bold text-gray-800 hover:text-orange-500 cursor-pointer transition-colors mb-1"
                onClick={handleCourseClick}
                title="Click to view course details"
              >
                {courseData?.courseName || 'Course Name'}
              </h3>
              <div className="flex items-center space-x-4">
                {courseData?.levelName && (
                  <span className="text-s text-gray-500">
                    {courseData.levelName}
                  </span>
                )}
                {courseData?.studyTime && (
                  <span className="text-s text-gray-500">
                    {courseData.studyTime}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
        
        {/* Right side - Action button and close */}
        <div className="flex items-center space-x-3">
          <Button 
            type="primary" 
            size="large" 
            onClick={handleGoToCart}
            className="!bg-orange-600 !hover:bg-orange-700 !border-orange-600 font-medium"
          >
            Go to cart
          </Button>
          <Button 
            type="text" 
            size="large"
            onClick={onClose}
            icon={<CloseOutlined />}
            className="text-gray-400 hover:text-gray-600 hover:bg-gray-100"
          />
        </div>
      </div>
    </Modal>
  );
};

export default AddToCartModal;
