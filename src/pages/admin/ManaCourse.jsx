"use client"

import { useState, useEffect } from "react"
import { Table, Button, message, Popconfirm, Space, Image } from "antd"
import { PlusOutlined, EditOutlined, DeleteOutlined, BookOutlined } from "@ant-design/icons"
import { api } from "../../services/apiClient"
import { useNavigate } from "react-router-dom"

const API_BASE_URL = "https://localhost:5000" // Backend URL

function ManaCourse() {
  const [courses, setCourses] = useState([])
  const [loading, setLoading] = useState(false)
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  })
  const navigate = useNavigate()

  useEffect(() => {
    fetchCourses()
  }, [pagination.current, pagination.pageSize])

  const fetchCourses = async () => {
    setLoading(true)
    try {
      const [courseRes, langRes, levelRes, catRes] = await Promise.all([
        api.get(`/admin/Courses`, {
          params: {
            page: pagination.current,
            pageSize: pagination.pageSize,
          },
        }),
        api.get(`/admin/Languages`),
        api.get(`/admin/Levels`),
        api.get(`/admin/Categories`),
      ])

      if (!Array.isArray(courseRes.data)) {
        throw new Error("API response for courses is not an array")
      }

      const languagesMap = new Map(langRes.data.map((lang) => [lang.languageId, lang.languageName]))
      const levelsMap = new Map(levelRes.data.map((level) => [level.levelId, level.levelName]))
      const categoriesMap = new Map(catRes.data.map((cat) => [cat.categoryId, cat.categoryName]))

      const coursesWithDetails = courseRes.data.map((course, index) => {
        const trimmedCourseID = course.courseID ? course.courseID.trim() : `course-${index}`
        const courseCategories = (course.categoryIDs || []).map((catId) => ({
          CategoryId: catId,
          CategoryName: categoriesMap.get(catId) || "N/A",
        }))
        return {
          ...course,
          key: trimmedCourseID,
          languageName: languagesMap.get(course.languageID) || "N/A",
          levelName: levelsMap.get(course.levelID) || "N/A",
          courseCategories: courseCategories,
          status: typeof course.status === "string" ? Number.parseInt(course.status, 10) : course.status,
        }
      })

      setCourses(coursesWithDetails)
      setPagination((prev) => ({
        ...prev,
        total: Number.parseInt(courseRes.headers["x-total-count"]) || 0,
      }))
    } catch (error) {
      console.error("Fetch Courses Error:", error.response?.data || error.message)
      message.error(
        error.response?.status === 404
          ? "API không tìm thấy. Vui lòng kiểm tra cấu hình backend."
          : error.response?.status === 500
            ? "Lỗi server. Vui lòng liên hệ admin."
            : "Không thể tải danh sách khóa học. Vui lòng kiểm tra kết nối mạng hoặc CORS.",
      )
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (courseId) => {
    try {
      const trimmedCourseId = courseId ? courseId.trim() : ""
      const res = await api.delete(`/admin/Courses/${trimmedCourseId}`)
      message.success("Đã xóa khóa học thành công")
      fetchCourses()
    } catch (error) {
      console.error("Delete Error:", error.response?.data || error.message)
      message.error(
        error.response?.status === 404
          ? "Khóa học không tồn tại"
          : error.response?.status === 500
            ? "Lỗi server khi xóa khóa học"
            : error.response?.data || "Không thể xóa khóa học",
      )
    }
  }

  const columns = [
    {
      title: "STT",
      render: (_, __, index) => (pagination.current - 1) * pagination.pageSize + index + 1,
      key: "index",
      width: 60,
      align: "center",
    },
    {
      title: "Ảnh khóa học",
      dataIndex: "imageUrls",
      key: "imageUrls",
      width: 120,
      render: (imageUrls, record) => {
        if (imageUrls && imageUrls.length > 0) {
          return (
            <Image
              src={imageUrls[0] ? `${API_BASE_URL}${imageUrls[0]}` : "/placeholder.svg"}
              alt={record.courseName || "Course Image"}
              style={{ width: 80, height: 60, objectFit: "cover", borderRadius: "4px" }}
              preview={false}
            />
          )
        }
        return <span style={{ color: "#999" }}>Không có ảnh</span>
      },
    },
    {
      title: "Tên khóa học",
      dataIndex: "courseName",
      key: "courseName",
      width: 200,
      ellipsis: true,
    },
    {
      title: "Mô tả",
      dataIndex: "description",
      key: "description",
      width: 250,
      ellipsis: true,
    },
    {
      title: "Giá (VNĐ)",
      dataIndex: "currentPrice",
      key: "currentPrice",
      render: (price) => (price ? price.toLocaleString("vi-VN") : "0"),
      width: 120,
      align: "right",
    },
    {
      title: "Ngôn ngữ",
      dataIndex: "languageName",
      key: "languageName",
      width: 100,
    },
    {
      title: "Cấp độ",
      dataIndex: "levelName",
      key: "levelName",
      width: 100,
    },
    {
      title: "Danh mục",
      dataIndex: "courseCategories",
      key: "courseCategories",
      render: (categories) =>
        Array.isArray(categories) ? categories.map((cat) => cat.CategoryName).join(", ") : "N/A",
      width: 150,
      ellipsis: true,
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      width: 100,
      align: "center",
      render: (status) => {
        const numericStatus = typeof status === "string" ? Number.parseInt(status, 10) : status
        const statusText = numericStatus === 1 ? "Hoạt động" : numericStatus === 0 ? "Bản nháp" : "Đã xóa"
        return (
          <span
            style={{
              padding: "4px 8px",
              borderRadius: "4px",
              fontSize: "12px",
              color: numericStatus === 1 ? "#52c41a" : numericStatus === 0 ? "#faad14" : "#ff4d4f",
              backgroundColor: numericStatus === 1 ? "#f6ffed" : numericStatus === 0 ? "#fffbe6" : "#fff1f0",
              border: `1px solid ${numericStatus === 1 ? "#b7eb8f" : numericStatus === 0 ? "#ffe58f" : "#ffa39e"}`,
            }}
          >
            {statusText}
          </span>
        )
      },
    },
    {
      title: "Thao tác",
      key: "actions",
      render: (_, record) => (
        <Space size="small">
          <Button
            type="primary"
            size="small"
            icon={<EditOutlined />}
            onClick={() => navigate(`/admin/courses/edit/${record.courseID.trim()}`)}
            disabled={record.status === -1} // Disable Edit for deleted courses
          >
            Sửa
          </Button>
          {record.status !== -1 && (
            <Popconfirm
              title="Bạn có chắc chắn muốn xóa khóa học này?"
              description="Hành động này không thể hoàn tác."
              onConfirm={() => handleDelete(record.courseID)}
              okText="Có"
              cancelText="Không"
            >
              <Button danger size="small" icon={<DeleteOutlined />}>
                Xóa
              </Button>
            </Popconfirm>
          )}
        </Space>
      ),
      width: 140,
      fixed: "right",
    },
    {
      title: "Thao tác Module",
      key: "moduleActions",
      render: (_, record) => (
        <Button
          icon={<BookOutlined />}
          onClick={() => navigate(`/admin/courses/${record.courseID.trim()}/modules`)}
          disabled={record.status === -1} // Disable module management for deleted courses
        >
          Quản lý Module
        </Button>
      ),
      width: 160,
      fixed: "right",
    },
  ]

  const handleTableChange = (newPagination) => {
    setPagination({
      ...pagination,
      current: newPagination.current,
      pageSize: newPagination.pageSize,
    })
  }

  return (
    <div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "24px",
        }}
      >
        <div>
          <h2 style={{ margin: 0, fontSize: "24px", fontWeight: "bold" }}>📚 Quản lý khóa học</h2>
          <p style={{ margin: "4px 0 0 0", color: "#666" }}>Quản lý tất cả các khóa học trong hệ thống</p>
        </div>
        <Button type="primary" size="large" icon={<PlusOutlined />} onClick={() => navigate("/admin/courses/add")}>
          Thêm khóa học mới
        </Button>
      </div>
      <div
        style={{
          background: "#fff",
          padding: "24px",
          borderRadius: "8px",
          boxShadow:
            "0 1px 2px 0 rgba(0, 0, 0, 0.03), 0 1px 6px -1px rgba(0, 0, 0, 0.02), 0 2px 4px 0 rgba(0, 0, 0, 0.02)",
        }}
      >
        <Table
          columns={columns}
          dataSource={courses}
          rowKey={(record) => record.key}
          loading={loading}
          pagination={{
            ...pagination,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) => `${range[0]}-${range[1]} của ${total} khóa học`,
          }}
          onChange={handleTableChange}
          scroll={{ x: 1400 }} // Increased scrollX to accommodate new column
          size="middle"
        />
      </div>
    </div>
  )
}

export default ManaCourse
