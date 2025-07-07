import React, { useState, useEffect } from "react";
import { Pagination, Select, Input, Empty } from "antd";
import CourseItem from "../components/course/CourseItem";
import SidebarCourseFilter from "../components/course/SidebarCourseFilter";

const { Search } = Input;
const baseURL = import.meta.env.VITE_API_BASE_URL;
function Courses() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(false);

  // Filter state default values
  const [filters, setFilters] = useState({
    page: 1,
    pageSize: 6,
    searchTerm: "",
    categoryIds: [],
    minPrice: "",
    maxPrice: "",
    sortBy: "CreatedAt",
    sortOrder: "desc",
  });

  // Pagination state
  const [pagination, setPagination] = useState({
    currentPage: 1,
    pageSize: 6,
    totalCount: 0,
    totalPages: 0,
    hasNextPage: false,
    hasPreviousPage: false,
  });

  // Fetch courses function
  const fetchCourses = async (filterParams = filters) => {
    setLoading(true);

    try {
      const queryParams = new URLSearchParams();

      // PAGE AND PAGE SIZE
      queryParams.append("Page", filterParams.page.toString());
      queryParams.append("PageSize", filterParams.pageSize.toString());

      // SEARCH TERM
      if (filterParams.searchTerm) {
        queryParams.append("SearchTerm", filterParams.searchTerm);
      }

      // CATEGORY FILTERS
      if (filterParams.categoryIds && filterParams.categoryIds.length > 0) {
        filterParams.categoryIds.forEach((id) => {
          queryParams.append("CategoryIds", id.toString());
        });
      }

      // PRICE RANGE 
      if (filterParams.minPrice) {
        queryParams.append("MinPrice", filterParams.minPrice.toString());
      }
      if (filterParams.maxPrice) {
        queryParams.append("MaxPrice", filterParams.maxPrice.toString());
      }

      // SORT 
      if (filterParams.sortBy === "Price-Desc") {
        queryParams.append("SortBy", "Price");
        queryParams.append("SortOrder", "desc");
      } else if (filterParams.sortBy === "Price-Asc") {
        queryParams.append("SortBy", "Price");
        queryParams.append("SortOrder", "asc");
      } else {
        //  sorting by createdAt and Popular
        queryParams.append("SortBy", filterParams.sortBy);
        queryParams.append("SortOrder", "desc");
      }

      const response = await fetch(
        `${baseURL}/courses/filter?${queryParams.toString()}`
      );
      console.log("Fetching courses with params:", queryParams.toString()); //debug
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();

      if (result.success) {
        setCourses(result.data.dataPaginated);
        setPagination({
          currentPage: result.data.currentPage,
          pageSize: result.data.pageSize,
          totalCount: result.data.totalCount,
          totalPages: result.data.totalPages,
          hasNextPage: result.data.hasNextPage,
          hasPreviousPage: result.data.hasPreviousPage,
        });
      } else {
        console.error("API returned failure:", result.message);
      }
    } catch (err) {
      console.error("Error fetching courses:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  // Handle filter changes
  const handleFilterChange = (name, value) => {
    const newFilters = { ...filters, [name]: value, page: 1 };
    setFilters(newFilters);
    fetchCourses(newFilters);
  };

  // Handle search
  const handleSearch = (value) => {
    const newFilters = { ...filters, searchTerm: value, page: 1 };
    setFilters(newFilters);
    fetchCourses(newFilters);
  };

  // Handle pagination
  const handlePageChange = (page, pageSize) => {
    const newFilters = { ...filters, page, pageSize };
    setFilters(newFilters);
    fetchCourses(newFilters);
  };

  // Reset filters
  const resetFilters = () => {
    const defaultFilters = {
      page: 1,
      pageSize: 6,
      searchTerm: "",
      levelId: null,
      languageId: null,
      categoryIds: [],
      minPrice: "",
      maxPrice: "",
      sortBy: "createdAt",
      sortOrder: "desc",
    };
    setFilters(defaultFilters);
    fetchCourses(defaultFilters);
  };

  return (
    <div className="min-h-screen bg-gray-50 mt-5">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar filter */}
          <div className="lg:w-1/4 w-full">
            <SidebarCourseFilter
              filters={filters}
              setFilters={setFilters}
              onApply={fetchCourses}
              resetFilters={resetFilters}
            />
          </div>
          {/* Main content */}
          <div className="flex-1">
            {/* Filters and Sort */}
            <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between mb-8">
              <div>
                <Search
                  placeholder="Tìm kiếm khóa học..."
                  allowClear
                  value={filters.searchTerm}
                  onChange={(e) => handleSearch(e.target.value)}
                  style={{ width: 300 }}
                />
              </div>
              <div className="flex items-center gap-4">
                <span className="text-sm text-gray-600 whitespace-nowrap">
                  Hiển thị {courses.length} trong {pagination.totalCount} khóa
                  học
                </span>
                <Select
                  value={filters.sortBy}
                  style={{ width: 150 }}
                  onChange={(value) => handleFilterChange("sortBy", value)}
                  options={[
                    { value: "Price-Desc", label: "Giá giảm dần" },
                    { value: "Price-Asc", label: "Giá tăng dần" },
                    { value: "Popular", label: "Phổ biến nhất" },
                    { value: "CreatedAt", label: "Mới nhất" },
                  ]}
                />
              </div>
            </div>
            {/* Course Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {loading ? (
                <div className="col-span-full text-center mt-10 text-gray-500 py-12">
                  Đang tải...
                </div>
              ) : courses.length === 0 ? (
                <div className="col-span-full text-center mt-10 text-gray-500 py-12">
                  <Empty description="Không tìm thấy khóa học nào" />
                </div>
              ) : (
                <>
                  {courses.map((course) => (
                    <CourseItem key={course.id} course={course} />
                  ))}
                </>
              )}
            </div>
            {/* Pagination */}
            <div className="flex justify-center mt-8">
              <Pagination
                current={pagination.currentPage}
                pageSize={pagination.pageSize}
                total={pagination.totalCount}
                onChange={handlePageChange}
                showSizeChanger={false}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Courses;
