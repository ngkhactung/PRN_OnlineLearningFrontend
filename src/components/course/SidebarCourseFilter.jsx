import React from "react";
import { Checkbox, InputNumber, Button } from "antd";

const categories = [
  { label: "Web Development", value: 1 },
  { label: "Frontend", value: 2 },
  { label: "Backend", value: 3 },
  { label: "Data Science", value: 4 },
  { label: "Mobile Development", value: 5 },
  { label: "Design", value: 6 },
];

function SidebarCourseFilter({ filters, setFilters, onApply, resetFilters }) {
  // Xử lý thay đổi danh mục
  const handleCategoryChange = (checkedValues) => {
    const newFilters = { ...filters, categoryIds: checkedValues, page: 1 };
    setFilters(newFilters);
    onApply(newFilters);
  };

  // Xử lý thay đổi giá
  const handleMinPriceChange = (value) => {
    const newFilters = { ...filters, minPrice: value || "", page: 1 };
    setFilters(newFilters);
    onApply(newFilters);
  };

  const handleMaxPriceChange = (value) => {
    const newFilters = { ...filters, maxPrice: value || "", page: 1 };
    setFilters(newFilters);
    onApply(newFilters);
  };

  return (
    <aside className="w-full lg:w-64 bg-white rounded-lg shadow p-5 mb-8 lg:mb-0">
      <h2 className="text-xl font-bold mb-4">Bộ lọc khóa học</h2>
      {/* Danh mục */}
      <div className="mb-6">
        <h3 className="font-semibold mb-2">Danh mục</h3>
        <Checkbox.Group
          options={categories}
          value={filters.categoryIds}
          onChange={handleCategoryChange}
        />
      </div>
      {/* Giá */}
      <div className="mb-6">
        <h3 className="font-semibold mb-2">Khoảng giá (USD)</h3>
        <div className="flex items-center gap-2">
          <InputNumber
            min={0}
            max={1000}
            value={filters.minPrice}
            onChange={handleMinPriceChange}
            className="w-20"
            placeholder="Từ"
          />
          <span>-</span>
          <InputNumber
            min={0}
            max={1000}
            value={filters.maxPrice}
            onChange={handleMaxPriceChange}
            className="w-20"
            placeholder="Đến"
          />
        </div>
      </div>
      <Button
        type="default"
        className="w-full mt-4"
        onClick={resetFilters}
      >
        Đặt lại bộ lọc
      </Button>
    </aside>
  );
}

export default SidebarCourseFilter;