import React, { useState, useRef, useEffect } from "react";
import { NavLink, Link, useNavigate } from "react-router-dom";
import { ShoppingCartOutlined, UserOutlined, LogoutOutlined, ProfileOutlined,ReadOutlined } from "@ant-design/icons";
import { useAuth } from "../../contexts/AuthContext";
import authService from "../../services/authService";
import logo from "../../assets/img/logo.png";

function Header() {
  const { isAuthenticated, updateAuthState } = useAuth();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [user, setUser] = useState(null);
  const userMenuRef = useRef(null);
  const navigate = useNavigate();

  // Get user data from localStorage
  useEffect(() => {
    if (isAuthenticated) {
      const userData = authService.getCurrentUser();
      setUser(userData);
    }
  }, [isAuthenticated]);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setShowUserMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleLogout = () => {
    updateAuthState(false);
    setShowUserMenu(false);
    authService.logout();
  };

  const handleMyProfile = () => {
    setShowUserMenu(false);

    // Debug token before navigation
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');
    
    console.log('=== Profile Navigation Debug ===');
    console.log('Token exists:', !!token);
    console.log('Token value:', token ? token.substring(0, 50) + '...' : 'null');
    console.log('User data:', user);
    console.log('Is authenticated:', isAuthenticated);
    console.log('================================');

    navigate('/profile');
  };

  const handleMyCart = () => {
    setShowUserMenu(false);
    navigate('/cart');
  };

  const handleMyLearning = () => {
    setShowUserMenu(false);
    navigate("/user/my-learning/in-progress"); // chuyển đến tab đang học mặc định
  };

  const toggleUserMenu = () => {
    setShowUserMenu(!showUserMenu);
  };

  return (
    <header className="bg-white shadow-sm fixed top-0 left-0 right-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Logo */}
          <div className="flex-shrink-0">
            <NavLink to="/" className="flex items-center">
              <img
                src={logo}
                alt="logo"
                className="h-8 lg:h-10 w-auto"
              />
            </NavLink>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-8">
            <NavLink
              to="/"
              className={({ isActive }) =>
                `px-3 py-2 text-sm font-medium transition-colors ${
                  isActive
                    ? "text-orange-500 border-b-2 border-orange-500"
                    : "text-gray-700 hover:text-orange-500"
                }`
              }
            >
              Home
            </NavLink>

            <NavLink
              to="/about"
              className={({ isActive }) =>
                `px-3 py-2 text-sm font-medium transition-colors ${
                  isActive
                    ? "text-orange-500 border-b-2 border-orange-500"
                    : "text-gray-700 hover:text-orange-500"
                }`
              }
            >
              About
            </NavLink>

            <NavLink
              to="/courses"
              className={({ isActive }) =>
                `px-3 py-2 text-sm font-medium transition-colors ${
                  isActive
                    ? "text-orange-500 border-b-2 border-orange-500"
                    : "text-gray-700 hover:text-orange-500"
                }`
              }
            >
              Courses
            </NavLink>

            <NavLink
              to="/contact"
              className={({ isActive }) =>
                `px-3 py-2 text-sm font-medium transition-colors ${
                  isActive
                    ? "text-orange-500 border-b-2 border-orange-500"
                    : "text-gray-700 hover:text-orange-500"
                }`
              }
            >
              Contact
            </NavLink>

            {/* Auth Section */}
            {isAuthenticated ? (
              <div className="flex items-center space-x-8">
                {/* Shopping Cart Icon */}
                <Link
                  to="/cart"
                  className="relative text-gray-700 hover:text-orange-500 transition-colors p-2"
                >
                  <ShoppingCartOutlined className="text-xl" />
                  <span className="absolute -top-1 -right-1 bg-orange-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    0
                  </span>
                </Link>

                {/* User Avatar & Menu */}
                <div className="relative" ref={userMenuRef}>
                  <button
                    type="button"
                    onClick={toggleUserMenu}
                    className="flex items-center space-x-2 text-gray-700 hover:text-orange-500 transition-colors cursor-pointer focus:outline-none"
                  >
                    <div className="w-8 h-8 rounded-full bg-orange-500 flex items-center justify-center text-white hover:bg-orange-600 transition-colors">
                      {user?.avatarUrl ? (
                        <img
                          src={user.avatarUrl}
                          alt="User Avatar"
                          className="w-8 h-8 rounded-full object-cover"
                        />
                      ) : (
                        <UserOutlined className="text-sm" />
                      )}
                    </div>
                  </button>

                  {/* User Dropdown Menu */}
                  {showUserMenu && (
                    <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                      {/* User Info */}
                      <div className="px-4 py-3 border-b border-gray-200">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 rounded-full bg-orange-500 flex items-center justify-center text-white">
                            {user?.avatarUrl ? (
                              <img
                                src={user.avatarUrl}
                                alt="User Avatar"
                                className="w-10 h-10 rounded-full object-cover"
                              />
                            ) : (
                              <UserOutlined className="text-lg" />
                            )}
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-900">
                              {user?.fullName || user?.username || 'User'}
                            </p>
                            <p className="text-xs text-gray-500">
                              {user?.email}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Menu Items */}
                      <div className="py-1">
                        <button
                          onClick={handleMyProfile}
                          className="flex items-center space-x-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 w-full text-left cursor-pointer"
                        >
                          <ProfileOutlined className="text-gray-500" />
                          <span>My Profile</span>
                        </button>
                        
                        <button
                          onClick={handleMyCart}
                          className="flex items-center space-x-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 w-full text-left cursor-pointer"
                        >
                          <ShoppingCartOutlined className="text-gray-500" />
                          <span>My Cart</span>
                        </button>
                        <button
                          onClick={handleMyLearning}
                          className="flex items-center space-x-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 w-full text-left cursor-pointer"
                        >
                          <ReadOutlined className="text-gray-500" />
                          <span>My Learning</span>
                        </button>

                        <div className="border-t border-gray-200 my-1"></div>
                        
                        <button
                          onClick={handleLogout}
                          className="flex items-center space-x-3 px-4 py-2 text-sm text-red-600 hover:bg-red-50 w-full text-left cursor-pointer"
                        >
                          <LogoutOutlined className="text-red-600" />
                          <span>Logout</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              /* Sign in Button (when not authenticated) */
              <Link
                to="/auth"
                className="bg-orange-500 hover:bg-orange-400 text-white px-6 py-2 rounded-md text-sm font-medium transition-all duration-300 ease-in-out hover:scale-105 hover:shadow-lg"
              >
                Sign in
              </Link>
            )}
          </nav>

          {/* Mobile Menu Button */}
          <div className="lg:hidden">
            <div className="flex items-center space-x-3">
              {/* Mobile Cart Icon (when authenticated) */}
              {isAuthenticated && (
                <Link
                  to="/cart"
                  className="relative text-gray-700 hover:text-orange-500 transition-colors p-2"
                >
                  <ShoppingCartOutlined className="text-xl" />
                  <span className="absolute -top-1 -right-1 bg-orange-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    0
                  </span>
                </Link>
              )}

              {/* Mobile Menu Toggle */}
              <button
                type="button"
                className="text-gray-700 hover:text-gray-900 focus:outline-none focus:text-gray-900 p-2"
                onClick={() => {
                  const menu = document.getElementById("mobile-menu");
                  menu.classList.toggle("hidden");
                }}
              >
                <svg
                  className="h-6 w-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        <div id="mobile-menu" className="lg:hidden hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 bg-white border-t border-gray-200">
            <Link
              to="/"
              className="text-gray-700 hover:text-gray-900 hover:bg-gray-50 block px-3 py-2 text-base font-medium rounded-md"
            >
              Home
            </Link>
            <Link
              to="/about"
              className="text-gray-700 hover:text-gray-900 hover:bg-gray-50 block px-3 py-2 text-base font-medium rounded-md"
            >
              About
            </Link>
            <Link
              to="/courses"
              className="text-gray-700 hover:text-gray-900 hover:bg-gray-50 block px-3 py-2 text-base font-medium rounded-md"
            >
              Courses
            </Link>
            <Link
              to="/contact"
              className="text-gray-700 hover:text-gray-900 hover:bg-gray-50 block px-3 py-2 text-base font-medium rounded-md"
            >
              Contact
            </Link>

            {/* Mobile Auth Section */}
            {isAuthenticated ? (
              <div className="border-t border-gray-200 pt-4">
                <div className="px-3 py-2">
                  <div className="flex items-center space-x-3 mb-3">
                    <div className="w-10 h-10 rounded-full bg-orange-500 flex items-center justify-center text-white">
                      {user?.avatarUrl ? (
                        <img
                          src={user.avatarUrl}
                          alt="User Avatar"
                          className="w-10 h-10 rounded-full object-cover"
                        />
                      ) : (
                        <UserOutlined className="text-lg" />
                      )}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        {user?.fullName || user?.username || 'User'}
                      </p>
                      <p className="text-xs text-gray-500">
                        {user?.email}
                      </p>
                    </div>
                  </div>
                </div>
                
                <Link
                  to="/profile"
                  className="text-gray-700 hover:text-gray-900 hover:bg-gray-50 block px-3 py-2 text-base font-medium rounded-md"
                >
                  My Profile
                </Link>
                <Link
                  to="/cart"
                  className="text-gray-700 hover:text-gray-900 hover:bg-gray-50 block px-3 py-2 text-base font-medium rounded-md"
                >
                  My Cart
                </Link>
                <button
                  onClick={handleLogout}
                  className="text-red-600 hover:text-red-700 hover:bg-red-50 block px-3 py-2 text-base font-medium rounded-md w-full text-left"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="px-3 py-2">
                <Link
                  to="/auth"
                  className="bg-orange-500 hover:bg-orange-600 text-white block px-6 py-2 rounded-md text-center text-base font-medium transition-colors"
                >
                  Sign in
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;
