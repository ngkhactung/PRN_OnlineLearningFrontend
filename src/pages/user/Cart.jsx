import React, { useState, useEffect } from "react";
import { Button, Card, Spin, message, Empty, Tag } from "antd";
import { DeleteOutlined } from "@ant-design/icons";
import { cartService } from "../../services/cartService";
import { useNavigate } from "react-router-dom";
import defaultCourseImg from "../../assets/img/cource/cource_1.png";

function Cart() {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchCartItems();
  }, []);

  const fetchCartItems = async () => {
    setLoading(true);
    const result = await cartService.getCartItems();

    if (result.success) {
      console.log("Cart items from API:", result.data); // Debug log
      setCartItems(result.data || []);
    } else {
      message.error(result.message);
    }
    setLoading(false);
  };

  const handleRemoveFromCart = async (cartItemId) => {
    const result = await cartService.deleteCartItem(cartItemId);

    if (result.success) {
      message.success(result.message);
      setCartItems(cartItems.filter((item) => item.cartItemId !== cartItemId));

      // Trigger header cart count update
      window.dispatchEvent(new CustomEvent("cartUpdated"));
    } else {
      message.error(result.message);
    }
  };

  const handleCartItemClick = (courseId) => {
    navigate(`/courses/${courseId}`);
  };

  const calculateTotal = () => {
    return cartItems.reduce((total, item) => {
      const price = item.price || 0;
      return total + price;
    }, 0);
  };

  const formatPrice = (price) => {
    // Ensure price is a valid number
    const safePrice = Number(price) || 0;
    if (isNaN(safePrice)) return "Free";

    return safePrice === 0
      ? "Free"
      : safePrice.toLocaleString("vi-VN", {
          style: "currency",
          currency: "VND",
        });
  };

  const handleCheckout = () => {
    if (cartItems.length === 0) {
      message.warning("Your cart is empty!");
      return;
    }
    navigate("/checkout");
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <h1 className="text-3xl font-bold text-gray-900 mb-6">My Cart</h1>

              {loading ? (
                <div className="text-center py-12">
                  <Spin size="large" tip="Loading cart items..." />
                </div>
              ) : cartItems.length === 0 ? (
                <div className="text-center py-12">
                  <Empty
                    description="Your cart is empty"
                    image={Empty.PRESENTED_IMAGE_SIMPLE}
                  >
                    <Button
                      type="primary"
                      className="!bg-orange-500 hover:bg-orange-600 !border-orange-500 font-medium"
                      onClick={() => navigate("/courses")}
                    >
                      Browse Courses
                    </Button>
                  </Empty>
                </div>
              ) : (
                <>
                  <div className="space-y-4 mb-6">
                    {cartItems.map((item) => (
                      <Card key={item.cartItemId} className="w-full">
                        <div className="flex flex-col md:flex-row items-start md:items-center justify-between">
                          <div
                            className="flex items-start space-x-4 flex-1 cursor-pointer"
                            onClick={() => handleCartItemClick(item.courseId)}
                          >
                            <img
                              src={item.courseImgUrl || defaultCourseImg}
                              alt={item.courseName}
                              className="w-20 h-20 object-cover rounded"
                            />
                            <div className="flex-1">
                              <h3 className="text-lg font-semibold text-gray-900 hover:text-orange-500 transition-colors">
                                {item.courseName}
                              </h3>
                              <div className="mt-2 space-y-1">
                                <p className="text-gray-500 text-sm">
                                  <span className="font-medium">
                                    Study time:
                                  </span>{" "}
                                  {item.studyTime}
                                </p>
                                <p className="text-gray-500 text-sm">
                                  <span className="font-medium">Language:</span>{" "}
                                  {item.language}
                                </p>
                                <p className="text-gray-500 text-sm">
                                  <span className="font-medium">Level:</span>{" "}
                                  {item.levelName}
                                </p>
                                {item.category && item.category.length > 0 && (
                                  <div className="flex flex-wrap gap-1 mt-2">
                                    {item.category.map((cat, index) => (
                                      <Tag
                                        key={index}
                                        color="orange"
                                        size="small"
                                      >
                                        {cat}
                                      </Tag>
                                    ))}
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center space-x-4 mt-4 md:mt-0">
                            <div className="text-xl font-bold text-red-600">
                              {formatPrice(item.price)}
                            </div>
                            <Button
                              type="text"
                              danger
                              icon={<DeleteOutlined />}
                              onClick={(e) => {
                                e.stopPropagation();
                                handleRemoveFromCart(item.cartItemId);
                              }}
                            >
                              Remove
                            </Button>
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>

                  <div className="border-t pt-6">
                    <div className="flex justify-between items-center mb-4">
                      <span className="text-xl font-semibold">Total:</span>
                      <span className="text-2xl font-bold text-red-600">
                        {formatPrice(calculateTotal())}
                      </span>
                    </div>
                    <div className="flex space-x-4">
                      <Button size="large" onClick={() => navigate("/courses")}>
                        Continue Shopping
                      </Button>
                      <Button
                        type="primary"
                        size="large"
                        onClick={handleCheckout}
                        className="flex-1 !bg-orange-500 hover:bg-orange-700 !border-orange-500 font-medium"
                      >
                        Proceed to Checkout ({cartItems.length} items)
                      </Button>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Cart;
