import React, { useState, useEffect } from "react";
import { Pagination, Select, Input, Empty } from "antd";
import CourseItem from "../components/course/CourseItem";
import SidebarCourseFilter from "../components/course/SidebarCourseFilter";

const { Search } = Input;
const baseURL = import.meta.env.VITE_API_BASE_URL;
function Courses() {
  const [courseList, setCourseList] = useState(null);
  useEffect(() => {
    fetch(`${baseURL}/courses`)
      .then((res) => res.json())
      .then((json) => {
        if (json.success) {
          setCourseList(json.data);
        } else {
          console.error("API returned failure:", json.message);
        }
      })
      .catch((err) => console.error("Fetch error:", err));
  }, []);
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
    {
      id: "4",
      name: "Python for Data Science",
      price: 179,
      category: "Data Science",
      image: "/placeholder.svg?height=200&width=300",
      students: "18.234",
      lessons: 56,
      duration: "12h45m",
    },
    {
      id: "5",
      name: "Mobile App Development with Flutter",
      price: 199,
      category: "Mobile Development",
      image: "/placeholder.svg?height=200&width=300",
      students: "9.876",
      lessons: 48,
      duration: "10h20m",
    },
    {
      id: "6",
      name: "UI/UX Design Fundamentals",
      price: 89,
      category: "Design",
      image: "/placeholder.svg?height=200&width=300",
      students: "25.123",
      lessons: 32,
      duration: "5h30m",
    },
  ];

  // State cho filter
  const [filters, setFilters] = useState({
    categories: [],
    price: [0, 1000],
    duration: [0, 20],
    lessons: [0, 100],
  });
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("increase");

  // Lọc dữ liệu mẫu (demo)
  const filteredCourses = sampleCourses.filter((course) => {
    const inCategory =
      filters.categories.length === 0 ||
      filters.categories.includes(course.category);
    const inPrice =
      course.price >= filters.price[0] && course.price <= filters.price[1];
    // Chuyển đổi duration về số giờ (demo, thực tế cần chuẩn hóa dữ liệu)
    const hours = parseFloat(course.duration);
    const inDuration =
      isNaN(hours) ||
      (hours >= filters.duration[0] && hours <= filters.duration[1]);
    const inLessons =
      course.lessons >= filters.lessons[0] &&
      course.lessons <= filters.lessons[1];
    const inSearch =
      search === "" || course.name.toLowerCase().includes(search.toLowerCase());
    return inCategory && inPrice && inDuration && inLessons && inSearch;
  });

  // Sắp xếp (demo)
  const sortedCourses = [...filteredCourses].sort((a, b) => {
    if (sort === "increase") return a.price - b.price;
    if (sort === "decrease") return b.price - a.price;
    if (sort === "popular")
      return b.students.replace(/\./g, "") - a.students.replace(/\./g, "");
    if (sort === "newest") return b.id - a.id;
    return 0;
  });

  return (
    <div className="min-h-screen bg-gray-50 mt-5">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar filter */}
          <div className="lg:w-1/4 w-full">
            <SidebarCourseFilter
              filters={filters}
              setFilters={setFilters}
              onApply={() => {}}
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
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  style={{ width: 300 }}
                />
              </div>
              <div className="flex items-center gap-4">
                <span className="text-sm text-gray-600 whitespace-nowrap">
                  Hiển thị {sortedCourses.length} trong {courseList === null ? 0 : courseList.length} khóa học
                </span>
                <Select
                  value={sort}
                  style={{ width: 150 }}
                  onChange={setSort}
                  options={[
                    { value: "decrease", label: "Giá giảm dần" },
                    { value: "increase", label: "Giá tăng dần" },
                    { value: "popular", label: "Phổ biến nhất" },
                    { value: "newest", label: "Mới nhất" },
                    { value: "free", label: "Miễn phí" },
                  ]}
                />
              </div>
            </div>
            {/* Course Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {courseList === null || courseList.length === 0 ? (
                <div className="col-span-full text-center mt-10 text-gray-500 py-12">
                  <Empty description="Không tìm thấy khóa học nào" />
                </div>
              ) : (
                <>
                  {courseList.map((course) => (
                    <CourseItem key={course.id} course={course} />
                  ))}

                  {/* Pagination */}
                  <div className="col-span-full flex justify-center mt-8">
                    <Pagination defaultCurrent={1} total={20} />
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

export default Courses;
