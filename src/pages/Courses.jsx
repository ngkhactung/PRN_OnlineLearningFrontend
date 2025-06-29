import React, { useState, useEffect } from "react";
import { Pagination, Select, Input, Empty } from "antd";
import CourseItem from "../components/course/CourseItem";
import SidebarCourseFilter from "../components/course/SidebarCourseFilter";

const { Search } = Input;
const baseURL = import.meta.env.VITE_API_BASE_URL;
function Courses() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(false);

  // Filter state
  const [filters, setFilters] = useState({
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

      queryParams.append("Page", filterParams.page.toString());
      queryParams.append("PageSize", filterParams.pageSize.toString());

      if (filterParams.searchTerm) {
        queryParams.append("searchTerm", filterParams.searchTerm);
      }
      if (filterParams.levelId) {
        queryParams.append("levelId", filterParams.levelId.toString());
      }
      if (filterParams.languageId) {
        queryParams.append("languageId", filterParams.languageId.toString());
      }
      if (filterParams.categoryIds && filterParams.categoryIds.length > 0) {
        filterParams.categoryIds.forEach((id) => {
          queryParams.append("categoryIds", id.toString());
        });
      }
      if (filterParams.minPrice) {
        queryParams.append("minPrice", filterParams.minPrice.toString());
      }
      if (filterParams.maxPrice) {
        queryParams.append("maxPrice", filterParams.maxPrice.toString());
      }
      queryParams.append("sortBy", filterParams.sortBy);
      queryParams.append("sortOrder", filterParams.sortOrder);

      const response = await fetch(
        `${baseURL}/courses/filter?${queryParams.toString()}`
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (data.success) {
        setCourses(data.data.dataPaginated);
        setPagination({
          currentPage: data.data.currentPage,
          pageSize: data.data.pageSize,
          totalCount: data.data.totalCount,
          totalPages: data.data.totalPages,
          hasNextPage: data.data.hasNextPage,
          hasPreviousPage: data.data.hasPreviousPage,
        });
      } else {
        console.error("API returned failure:", data.message);
      }
    } catch (err) {
      console.error("Error fetching courses:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();
    // eslint-disable-next-line
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
                  onSearch={handleSearch}
                />
              </div>
              <div className="flex items-center gap-4">
                <span className="text-sm text-gray-600 whitespace-nowrap">
                  Hiển thị {courses.length} trong {pagination.totalCount} khóa học
                </span>
                <Select
                  value={filters.sortBy}
                  style={{ width: 150 }}
                  onChange={(value) => handleFilterChange("sortBy", value)}
                  options={[
                    { value: "desc", label: "Giá giảm dần" },
                    { value: "asc", label: "Giá tăng dần" },
                    { value: "popular", label: "Phổ biến nhất" },
                    { value: "createdAt", label: "Mới nhất" },
                    { value: "free", label: "Miễn phí" },
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