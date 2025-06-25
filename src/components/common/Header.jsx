import React from "react";
import { NavLink, Link } from "react-router-dom";

function Header() {
  return (
    <header className="bg-white shadow-sm fixed top-0 left-0 right-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Logo with Enhanced Debugging */}
          <div className="flex-shrink-0">
            <a href="/" className="flex items-center">
              <img
                src="/img/logo.png" // Vite root-relative path
                alt="logo"
                className="h-8 lg:h-10 w-auto"
                onError={(e) => {
                  console.error("Logo load failed:", {
                    error: e,
                    src: e.target.src,
                    currentSrc: e.target.currentSrc,
                    baseURI: document.baseURI,
                  }); // Detailed logging
                  e.target.src = "https://via.placeholder.com/150"; // Fallback
                }}
                onLoad={() => console.log("Logo loaded successfully:", document.baseURI)} // Confirm load
              />
            </a>
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
            <Link
              to="/auth"
              className="bg-orange-500 hover:bg-orange-400 text-white px-6 py-2 rounded-md text-sm font-medium transition-all duration-300 ease-in-out hover:scale-105 hover:shadow-lg"
            >
              Sign in
            </Link>
          </nav>

          {/* Mobile Menu Button */}
          <div className="lg:hidden">
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

        {/* Mobile Navigation Menu */}
        <div id="mobile-menu" className="lg:hidden hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 bg-white border-t border-gray-200">
            <Link
              to="/"
              className="bg-blue-50 text-blue-600 block px-3 py-2 text-base font-medium rounded-md"
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
            <div className="px-3 py-2">
              <Link
                to="/auth"
                className="bg-blue-600 hover:bg-blue-700 text-white block px-6 py-2 rounded-md text-center text-base font-medium transition-colors"
              >
                Sign in
              </Link>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;