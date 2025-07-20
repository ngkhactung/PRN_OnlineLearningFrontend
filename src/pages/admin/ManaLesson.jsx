import { useState, useEffect } from "react"
import { Table, Button, message, Popconfirm, Space, Modal, Form, Input, InputNumber, Select } from "antd"
import { PlusOutlined, EditOutlined, DeleteOutlined, ArrowLeftOutlined } from "@ant-design/icons"
import axios from "axios"
import { useParams, useNavigate } from "react-router-dom"

const API_BASE_URL = "http://localhost:5000" // Backend URL

function ManaLesson() {
  const { courseId, moduleId } = useParams()
  const navigate = useNavigate()
  const [lessons, setLessons] = useState([])
  const [loading, setLoading] = useState(false)
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  })
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [editingLesson, setEditingLesson] = useState(null) // null for add, object for edit
  const [form] = Form.useForm()
  const [moduleName, setModuleName] = useState("") // To display the module name
  const [courseName, setCourseName] = useState("") // To display the course name

  useEffect(() => {
    fetchLessons()
    fetchModuleAndCourseName()
  }, [pagination.current, pagination.pageSize, moduleId])

  // Fetch module and course name for display
  const fetchModuleAndCourseName = async () => {
    try {
      const moduleRes = await axios.get(`${API_BASE_URL}/api/admin/Modules/${moduleId}`)
      setModuleName(moduleRes.data.moduleName)
      const courseRes = await axios.get(`${API_BASE_URL}/api/admin/Courses/${courseId}`)
      setCourseName(courseRes.data.courseName)
    } catch (error) {
      console.error("Fetch Module/Course Name Error:", error.response?.data || error.message)
      message.error("Không thể tải tên module hoặc khóa học.")
    }
  }

  // READ: Lấy danh sách bài học
  const fetchLessons = async () => {
    setLoading(true)
    try {
      const res = await axios.get(`${API_BASE_URL}/api/admin/Lessons`, {
        params: {
          moduleId: moduleId,
          page: pagination.current,
          pageSize: pagination.pageSize,
        },
      })
      if (!Array.isArray(res.data)) {
        throw new Error("API response for lessons is not an array")
      }
      setLessons(res.data.map((lesson) => ({ ...lesson, key: lesson.lessonID })))
      setPagination((prev) => ({
        ...prev,
        total: Number.parseInt(res.headers["x-total-count"]) || 0,
      }))
    } catch (error) {
      console.error("Fetch Lessons Error:", error.response?.data || error.message)
      message.error(
        error.response?.status === 404
          ? "API không tìm thấy. Vui lòng kiểm tra cấu hình backend."
          : error.response?.status === 500
            ? "Lỗi server. Vui lòng liên hệ admin."
            : "Không thể tải danh sách bài học. Vui lòng kiểm tra kết nối mạng hoặc CORS.",
      )
    } finally {
      setLoading(false)
    }
  }

  // CREATE: Mở modal để thêm bài học mới
  const handleAdd = () => {
    setEditingLesson(null) // Đặt null để biết là đang thêm mới
    form.resetFields() // Xóa dữ liệu cũ trong form
    setIsModalVisible(true)
  }

  // UPDATE: Mở modal để chỉnh sửa bài học
  const handleEdit = (record) => {
    setEditingLesson(record) // Đặt đối tượng bài học để biết là đang chỉnh sửa
    form.setFieldsValue({
      lessonName: record.lessonName,
      lessonNumber: record.lessonNumber,
      lessonContent: record.lessonContent,
      lessonVideo: record.lessonVideo,
      duration: record.duration,
      status: record.status,
    })
    setIsModalVisible(true)
  }

  // DELETE: Xóa bài học
  const handleDelete = async (lessonId) => {
    try {
      await axios.delete(`${API_BASE_URL}/api/admin/Lessons/${lessonId}`)
      message.success("Đã xóa bài học thành công")
      fetchLessons() // Tải lại danh sách sau khi xóa
    } catch (error) {
      console.error("Delete Lesson Error:", error.response?.data || error.message)
      message.error(
        error.response?.status === 404
          ? "Bài học không tồn tại"
          : error.response?.status === 500
            ? "Lỗi server khi xóa bài học"
            : "Không thể xóa bài học",
      )
    }
  }

  // CREATE/UPDATE: Xử lý khi gửi form (thêm mới hoặc cập nhật)
  const onFinish = async (values) => {
    try {
      if (editingLesson) {
        // UPDATE: Gửi yêu cầu PUT nếu đang chỉnh sửa
        await axios.put(`${API_BASE_URL}/api/admin/Lessons/${editingLesson.lessonID}`, {
          lessonNumber: values.lessonNumber,
          lessonName: values.lessonName,
          lessonContent: values.lessonContent,
          lessonVideo: values.lessonVideo,
          duration: values.duration,
          status: values.status, // ✅ Đã đúng rồi
        })
        message.success("Cập nhật bài học thành công")
      } else {
        // CREATE: Gửi yêu cầu POST nếu đang thêm mới
        await axios.post(`${API_BASE_URL}/api/admin/Lessons`, {
          moduleID: moduleId, // Gửi kèm moduleId
          lessonNumber: values.lessonNumber || 0, // Gửi 0 nếu không cung cấp, backend sẽ tự động tạo
          lessonName: values.lessonName,
          lessonContent: values.lessonContent,
          lessonVideo: values.lessonVideo,
          duration: values.duration,
          status: values.status !== undefined ? values.status : 1, // ✅ Sửa lỗi: Kiểm tra undefined thay vì falsy
        })
        message.success("Thêm bài học mới thành công")
      }
      setIsModalVisible(false) // Đóng modal
      fetchLessons() // Tải lại danh sách sau khi thêm/cập nhật
    } catch (error) {
      console.error("Lesson Operation Error:", error.response?.data || error.message)
      message.error("Thao tác bài học thất bại: " + (error.response?.data || error.message))
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
      title: "Tên Bài học",
      dataIndex: "lessonName",
      key: "lessonName",
      width: 200,
      ellipsis: true,
    },
    {
      title: "Số thứ tự Bài học",
      dataIndex: "lessonNumber",
      key: "lessonNumber",
      width: 120,
      align: "center",
    },
    {
      title: "Nội dung",
      dataIndex: "lessonContent",
      key: "lessonContent",
      width: 250,
      ellipsis: true,
      render: (text) => text || "Không có nội dung",
    },
    {
      title: "Video",
      dataIndex: "lessonVideo",
      key: "lessonVideo",
      width: 150,
      ellipsis: true,
      render: (text) => text || "Không có video",
    },
    {
      title: "Thời lượng (phút)",
      dataIndex: "duration",
      key: "duration",
      width: 120,
      align: "center",
      render: (duration) => duration || "N/A",
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      width: 100,
      align: "center",
      render: (status) => {
        const statusText = status === 1 ? "Hoạt động" : "Bản nháp"
        return (
          <span
            style={{
              padding: "4px 8px",
              borderRadius: "4px",
              fontSize: "12px",
              color: status === 1 ? "#52c41a" : "#faad14",
              backgroundColor: status === 1 ? "#f6ffed" : "#fffbe6",
              border: `1px solid ${status === 1 ? "#b7eb8f" : "#ffe58f"}`,
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
          <Button type="primary" size="small" icon={<EditOutlined />} onClick={() => handleEdit(record)}>
            Sửa
          </Button>
          <Popconfirm
            title="Bạn có chắc chắn muốn xóa bài học này?"
            description="Hành động này không thể hoàn tác."
            onConfirm={() => handleDelete(record.lessonID)}
            okText="Có"
            cancelText="Không"
          >
            <Button danger size="small" icon={<DeleteOutlined />}>
              Xóa
            </Button>
          </Popconfirm>
        </Space>
      ),
      width: 140,
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
      <div style={{ marginBottom: "24px" }}>
        <Space>
          <Button icon={<ArrowLeftOutlined />} onClick={() => navigate(`/admin/courses/${courseId}/modules`)}>
            Quay lại danh sách Module
          </Button>
        </Space>
        <h2 style={{ margin: "8px 0 0 0", fontSize: "24px", fontWeight: "bold" }}>
          📚 Quản lý Bài học của Module: {moduleName} (Khóa học: {courseName})
        </h2>
        <p style={{ margin: "4px 0 0 0", color: "#666" }}>Quản lý các bài học cho module "{moduleName}"</p>
      </div>
      <div
        style={{
          display: "flex",
          justifyContent: "flex-end",
          marginBottom: "16px",
        }}
      >
        <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
          Thêm Bài học mới
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
          dataSource={lessons}
          rowKey={(record) => record.key}
          loading={loading}
          pagination={{
            ...pagination,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) => `${range[0]}-${range[1]} của ${total} bài học`,
          }}
          onChange={handleTableChange}
          scroll={{ x: 1000 }}
          size="middle"
        />
      </div>
      <Modal
        title={editingLesson ? "Chỉnh sửa Bài học" : "Thêm Bài học mới"}
        open={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={null}
        width={600}
      >
        <Form form={form} layout="vertical" onFinish={onFinish}>
          <Form.Item
            label="Tên Bài học"
            name="lessonName"
            rules={[
              { required: true, message: "Vui lòng nhập tên bài học" },
              { max: 255, message: "Tên bài học tối đa 255 ký tự" }
            ]}
          >
            <Input placeholder="Nhập tên bài học" />
          </Form.Item>
          <Form.Item
            label="Số thứ tự Bài học"
            name="lessonNumber"
            tooltip="Để trống nếu muốn tự động tạo số thứ tự tiếp theo"
            rules={[
              { type: "number", min: 0, message: "Số thứ tự bài học phải lớn hơn hoặc bằng 0" }
            ]}
          >
            <InputNumber min={0} placeholder="Ví dụ: 1, 2, 3..." style={{ width: "100%" }} />
          </Form.Item>
          <Form.Item
            label="Nội dung Bài học"
            name="lessonContent"
            rules={[
              { max: 2000, message: "Nội dung bài học tối đa 2000 ký tự" }
            ]}
          >
            <Input.TextArea rows={4} placeholder="Nhập nội dung chi tiết của bài học" />
          </Form.Item>
          <Form.Item
            label="Link Video Bài học"
            name="lessonVideo"
            rules={[
              { max: 500, message: "Link video tối đa 500 ký tự" }
            ]}
          >
            <Input placeholder="Nhập URL video bài học (ví dụ: YouTube, Vimeo)" />
          </Form.Item>
          <Form.Item
            label="Thời lượng (phút)"
            name="duration"
            rules={[
              { type: "number", min: 0, message: "Thời lượng phải lớn hơn hoặc bằng 0" }
            ]}
          >
            <InputNumber min={0} placeholder="Ví dụ: 60" style={{ width: "100%" }} />
          </Form.Item>
          <Form.Item
            label="Trạng thái"
            name="status"
            rules={[
              { required: true, message: "Vui lòng chọn trạng thái" }
            ]}
            initialValue={1}
          >
            <Select placeholder="Chọn trạng thái">
              <Select.Option value={0}>Bản nháp</Select.Option>
              <Select.Option value={1}>Hoạt động</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">
              {editingLesson ? "Cập nhật" : "Thêm mới"}
            </Button>
            <Button onClick={() => setIsModalVisible(false)} style={{ marginLeft: 8 }}>
              Hủy
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  )
}

export default ManaLesson
