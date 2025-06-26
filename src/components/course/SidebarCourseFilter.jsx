import React from "react";
import { Checkbox, Slider, InputNumber, Button } from "antd";

const categories = [
  "Web Development",
  "Frontend",
  "Backend",
  "Data Science",
  "Mobile Development",
  "Design",
];

function SidebarCourseFilter({ filters, setFilters }) {
  return (
    <aside className="w-full lg:w-64 bg-white rounded-lg shadow p-5 mb-8 lg:mb-0">
      <h2 className="text-xl font-bold mb-4">Bộ lọc khóa học</h2>
      {/* Danh mục */}
      <div className="mb-6">
        <h3 className="font-semibold mb-2">Danh mục</h3>
        <Checkbox.Group
          options={categories}
          value={filters.categories}
          onChange={(checked) => setFilters((f) => ({ ...f, categories: checked }))}
        />
      </div>
      {/* Giá */}
      <div className="mb-6">
        <h3 className="font-semibold mb-2">Khoảng giá (USD)</h3>
        <div className="flex items-center gap-2">
          <InputNumber
            min={0}
            max={1000}
            value={filters.price[0]}
            onChange={(val) => setFilters((f) => ({ ...f, price: [val || 0, f.price[1]] }))}
            className="w-20"
          />
          <span>-</span>
          <InputNumber
            min={0}
            max={1000}
            value={filters.price[1]}
            onChange={(val) => setFilters((f) => ({ ...f, price: [f.price[0], val || 1000] }))}
            className="w-20"
          />
        </div>
        <Slider
          range
          min={0}
          max={1000}
          value={filters.price}
          onChange={(val) => setFilters((f) => ({ ...f, price: val }))}
          className="mt-2"
        />
      </div>
      {/* Thời lượng */}
      <div className="mb-6">
        <h3 className="font-semibold mb-2">Thời lượng (giờ)</h3>
        <Slider
          range
          min={0}
          max={20}
          value={filters.duration}
          onChange={(val) => setFilters((f) => ({ ...f, duration: val }))}
        />
        <div className="flex justify-between text-xs text-gray-500">
          <span>0</span>
          <span>20+</span>
        </div>
      </div>
      {/* Số bài học */}
      <div className="mb-6">
        <h3 className="font-semibold mb-2">Số bài học</h3>
        <Slider
          range
          min={0}
          max={100}
          value={filters.lessons}
          onChange={(val) => setFilters((f) => ({ ...f, lessons: val }))}
        />
        <div className="flex justify-between text-xs text-gray-500">
          <span>0</span>
          <span>100+</span>
        </div>
      </div>
    </aside>
  );
}

export default SidebarCourseFilter; 