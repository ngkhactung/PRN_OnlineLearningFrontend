import { useState, useEffect } from "react"
import { Table, Button, message, Popconfirm, Space, Modal, Form, Input, InputNumber, Select } from "antd"
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  ArrowLeftOutlined,
  BookOutlined,
  QuestionCircleOutlined,
} from "@ant-design/icons"
import axios from "axios"
import { useParams, useNavigate } from "react-router-dom"

const API_BASE_URL = "http://localhost:5000" // Backend URL

function ManaModule() {
  const { courseId } = useParams()
  const navigate = useNavigate()
  const [modules, setModules] = useState([])
  const [loading, setLoading] = useState(false)
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  })
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [editingModule, setEditingModule] = useState(null) // null for add, object for edit
  const [form] = Form.useForm()
  const [courseName, setCourseName] = useState("") // To display the course name

  useEffect(() => {
    fetchModules()
    fetchCourseName()
  }, [pagination.current, pagination.pageSize, courseId]) // ✅ Bỏ searchText và filterStatus

  // READ: Lấy tên khóa học để hiển thị
  const fetchCourseName = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/api/admin/Courses/${courseId}`)
      setCourseName(res.data.courseName)
    } catch (error) {
      console.error("Fetch Course Name Error:", error.response?.data || error.message)
      message.error("Không thể tải tên khóa học.")
    }
  }

  // READ: Lấy danh sách module
  const fetchModules = async () => {
    setLoading(true)
    try {
      const res = await axios.get(`${API_BASE_URL}/api/admin/Modules`, {
        params: {
          courseId: courseId,
          page: pagination.current,
          pageSize: pagination.pageSize,
          // ✅ Bỏ search và status parameters
        },
      })
      if (!Array.isArray(res.data)) {
        throw new Error("API response for modules is not an array")
      }
      setModules(res.data.map((mod) => ({ ...mod, key: mod.moduleID })))
      setPagination((prev) => ({
        ...prev,
        total: Number.parseInt(res.headers["x-total-count"]) || 0,
      }))
    } catch (error) {
      console.error("Fetch Modules Error:", error.response?.data || error.message)
      message.error(
        error.response?.status === 404
          ? "API không tìm thấy. Vui lòng kiểm tra cấu hình backend."
          : error.response?.status === 500
            ? "Lỗi server. Vui lòng liên hệ admin."
            : "Không thể tải danh sách module. Vui lòng kiểm tra kết nối mạng hoặc CORS.",
      )
    } finally {
      setLoading(false)
    }
  }

  // CREATE: Mở modal để thêm module mới
  const handleAdd = () => {
    setEditingModule(null) // Đặt null để biết là đang thêm mới
    form.resetFields() // Xóa dữ liệu cũ trong form
    setIsModalVisible(true)
  }

  // UPDATE: Mở modal để chỉnh sửa module
  const handleEdit = (record) => {
    setEditingModule(record) // Đặt đối tượng module để biết là đang chỉnh sửa
    form.setFieldsValue({
      moduleName: record.moduleName,
      moduleNumber: record.moduleNumber,
      status: record.status,
    })
    setIsModalVisible(true)
  }

  // DELETE: Xóa module
  const handleDelete = async (moduleId) => {
    try {
      await axios.delete(`${API_BASE_URL}/api/admin/Modules/${moduleId}`)
      message.success("Đã xóa module thành công")
      fetchModules() // Tải lại danh sách sau khi xóa
    } catch (error) {
      console.error("Delete Module Error:", error.response?.data || error.message)
      message.error(
        error.response?.status === 400
          ? error.response?.data || "Không thể xóa module có bài học hoặc câu đố."
          : error.response?.status === 404
            ? "Module không tồn tại"
            : error.response?.status === 500
              ? "Lỗi server khi xóa module"
              : "Không thể xóa module",
      )
    }
  }

  // CREATE/UPDATE: Xử lý khi gửi form (thêm mới hoặc cập nhật)
  const onFinish = async (values) => {
    try {
      if (editingModule) {
        // UPDATE: Gửi yêu cầu PUT nếu đang chỉnh sửa
        await axios.put(`${API_BASE_URL}/api/admin/Modules/${editingModule.moduleID}`, {
          moduleName: values.moduleName,
          moduleNumber: values.moduleNumber,
          status: values.status,
        })
        message.success("Cập nhật module thành công")
      } else {
        // CREATE: Gửi yêu cầu POST nếu đang thêm mới
        await axios.post(`${API_BASE_URL}/api/admin/Modules`, {
          courseID: courseId, // Gửi kèm courseId
          moduleName: values.moduleName,
          moduleNumber: values.moduleNumber || 0, // Gửi 0 nếu không cung cấp, backend sẽ tự động tạo
          status: values.status !== undefined ? values.status : 1, // ✅ Sửa lỗi: Kiểm tra undefined thay vì falsy
        })
        message.success("Thêm module mới thành công")
      }
      setIsModalVisible(false) // Đóng modal
      fetchModules() // Tải lại danh sách sau khi thêm/cập nhật
    } catch (error) {
      console.error("Module Operation Error:", error.response?.data || error.message)
      message.error("Thao tác module thất bại: " + (error.response?.data || error.message))
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
      title: "Tên Module",
      dataIndex: "moduleName",
      key: "moduleName",
      width: 200,
      ellipsis: true,
    },
    {
      title: "Số thứ tự Module",
      dataIndex: "moduleNumber",
      key: "moduleNumber",
      width: 120,
      align: "center",
    },
    {
      title: "Số bài học",
      dataIndex: "lessonCount",
      key: "lessonCount",
      width: 100,
      align: "center",
    },
    {
      title: "Số câu đố",
      dataIndex: "quizCount",
      key: "quizCount",
      width: 100,
      align: "center",
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
            title="Bạn có chắc chắn muốn xóa module này?"
            description="Hành động này không thể hoàn tác. Module có bài học hoặc câu đố không thể xóa."
            onConfirm={() => handleDelete(record.moduleID)}
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
    {
      title: "Thao tác Bài học",
      key: "lessonActions",
      render: (_, record) => (
        <Button
          icon={<BookOutlined />}
          onClick={() => navigate(`/admin/courses/${courseId}/modules/${record.moduleID}/lessons`)}
        >
          Quản lý Bài học
        </Button>
      ),
      width: 160,
      fixed: "right",
    },
    {
      title: "Thao tác Câu đố",
      key: "quizActions",
      render: (_, record) => (
        <Button
          icon={<QuestionCircleOutlined />}
          onClick={() => navigate(`/admin/courses/${courseId}/modules/${record.moduleID}/quizzes`)}
        >
          Quản lý Câu đố
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
      <div style={{ marginBottom: "24px" }}>
        <Space>
          <Button icon={<ArrowLeftOutlined />} onClick={() => navigate("/admin/courses")}>
            Quay lại danh sách khóa học
          </Button>
        </Space>
        <h2 style={{ margin: "8px 0 0 0", fontSize: "24px", fontWeight: "bold" }}>
          📚 Quản lý Module của khóa học: {courseName}
        </h2>
        <p style={{ margin: "4px 0 0 0", color: "#666" }}>Quản lý các module cho khóa học "{courseName}"</p>
      </div>

      {/* ✅ Bỏ phần tìm kiếm và filter, chỉ giữ lại button thêm mới */}
      <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: "16px" }}>
        <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
          Thêm Module mới
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
          dataSource={modules}
          rowKey={(record) => record.key}
          loading={loading}
          pagination={{
            ...pagination,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) => `${range[0]}-${range[1]} của ${total} module`,
          }}
          onChange={handleTableChange}
          scroll={{ x: 1200 }}
          size="middle"
        />
      </div>

      <Modal
        title={editingModule ? "Chỉnh sửa Module" : "Thêm Module mới"}
        open={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={null}
      >
        <Form form={form} layout="vertical" onFinish={onFinish}>
          <Form.Item
            label="Tên Module"
            name="moduleName"
            rules={[
              { required: true, message: "Vui lòng nhập tên module" },
              { max: 255, message: "Tên module tối đa 255 ký tự" }
            ]}
          >
            <Input placeholder="Nhập tên module" />
          </Form.Item>
          <Form.Item
            label="Số thứ tự Module"
            name="moduleNumber"
            tooltip="Để trống nếu muốn tự động tạo số thứ tự tiếp theo"
            rules={[
              { type: "number", min: 0, message: "Số thứ tự module phải lớn hơn hoặc bằng 0" }
            ]}
          >
            <InputNumber min={0} placeholder="Ví dụ: 1, 2, 3..." style={{ width: "100%" }} />
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
              {editingModule ? "Cập nhật" : "Thêm mới"}
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

export default ManaModule
