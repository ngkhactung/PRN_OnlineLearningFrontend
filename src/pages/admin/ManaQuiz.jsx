import { useState, useEffect } from "react"
import { Table, Button, message, Popconfirm, Space, Modal, Form, Input, InputNumber, Select } from "antd"
import { PlusOutlined, EditOutlined, DeleteOutlined, ArrowLeftOutlined, QuestionOutlined } from "@ant-design/icons"
import axios from "axios"
import { useParams, useNavigate } from "react-router-dom"

const API_BASE_URL = "http://localhost:5000" // Backend URL

function ManaQuiz() {
  const { courseId, moduleId } = useParams()
  const navigate = useNavigate()
  const [quizzes, setQuizzes] = useState([])
  const [loading, setLoading] = useState(false)
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  })
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [editingQuiz, setEditingQuiz] = useState(null) // null for add, object for edit
  const [form] = Form.useForm()
  const [moduleName, setModuleName] = useState("") // To display the module name
  const [courseName, setCourseName] = useState("") // To display the course name

  useEffect(() => {
    fetchQuizzes()
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

  // READ: Lấy danh sách câu đố
  const fetchQuizzes = async () => {
    setLoading(true)
    try {
      const res = await axios.get(`${API_BASE_URL}/api/admin/Quizzes`, {
        params: {
          moduleId: moduleId,
          page: pagination.current,
          pageSize: pagination.pageSize,
        },
      })
      if (!Array.isArray(res.data)) {
        throw new Error("API response for quizzes is not an array")
      }
      setQuizzes(res.data.map((quiz) => ({ ...quiz, key: quiz.quizID })))
      setPagination((prev) => ({
        ...prev,
        total: Number.parseInt(res.headers["x-total-count"]) || 0,
      }))
    } catch (error) {
      console.error("Fetch Quizzes Error:", error.response?.data || error.message)
      message.error(
        error.response?.status === 404
          ? "API không tìm thấy. Vui lòng kiểm tra cấu hình backend."
          : error.response?.status === 500
            ? "Lỗi server. Vui lòng liên hệ admin."
            : "Không thể tải danh sách câu đố. Vui lòng kiểm tra kết nối mạng hoặc CORS.",
      )
    } finally {
      setLoading(false)
    }
  }

  // CREATE: Mở modal để thêm câu đố mới
  const handleAdd = () => {
    setEditingQuiz(null) // Đặt null để biết là đang thêm mới
    form.resetFields() // Xóa dữ liệu cũ trong form
    setIsModalVisible(true)
  }

  // UPDATE: Mở modal để chỉnh sửa câu đố
  const handleEdit = (record) => {
    setEditingQuiz(record) // Đặt đối tượng câu đố để biết là đang chỉnh sửa
    form.setFieldsValue({
      quizName: record.quizName,
      quizTime: record.quizTime,
      passScore: record.passScore,
      status: record.status,
    })
    setIsModalVisible(true)
  }

  // DELETE: Xóa câu đố
  const handleDelete = async (quizId) => {
    try {
      await axios.delete(`${API_BASE_URL}/api/admin/Quizzes/${quizId}`)
      message.success("Đã xóa câu đố thành công")
      fetchQuizzes() // Tải lại danh sách sau khi xóa
    } catch (error) {
      console.error("Delete Quiz Error:", error.response?.data || error.message)
      message.error(
        error.response?.status === 404
          ? "Câu đố không tồn tại"
          : error.response?.status === 500
            ? "Lỗi server khi xóa câu đố"
            : "Không thể xóa câu đố",
      )
    }
  }

  // CREATE/UPDATE: Xử lý khi gửi form (thêm mới hoặc cập nhật)
  const onFinish = async (values) => {
    try {
      if (editingQuiz) {
        // UPDATE: Gửi yêu cầu PUT nếu đang chỉnh sửa
        await axios.put(`${API_BASE_URL}/api/admin/Quizzes/${editingQuiz.quizID}`, {
          quizName: values.quizName,
          quizTime: values.quizTime,
          passScore: values.passScore,
          status: values.status, // ✅ Đã đúng rồi
        })
        message.success("Cập nhật câu đố thành công")
      } else {
        // CREATE: Gửi yêu cầu POST nếu đang thêm mới
        // Lưu ý: Backend API CreateQuiz yêu cầu Questions trong DTO.
        // Để đơn giản, chúng ta sẽ tạo một quiz rỗng và sau đó quản lý câu hỏi riêng.
        // Hoặc bạn có thể thêm một form phức tạp hơn để thêm câu hỏi ngay khi tạo quiz.
        // Hiện tại, tôi sẽ gửi một mảng Questions rỗng.
        await axios.post(`${API_BASE_URL}/api/admin/Quizzes`, {
          moduleID: moduleId, // Gửi kèm moduleId
          quizName: values.quizName,
          quizTime: values.quizTime,
          passScore: values.passScore,
          status: values.status !== undefined ? values.status : 1, // ✅ Sửa lỗi: Kiểm tra undefined thay vì falsy
          questions: [], // Gửi mảng câu hỏi rỗng khi tạo quiz ban đầu
        })
        message.success("Thêm câu đố mới thành công")
      }
      setIsModalVisible(false) // Đóng modal
      fetchQuizzes() // Tải lại danh sách sau khi thêm/cập nhật
    } catch (error) {
      console.error("Quiz Operation Error:", error.response?.data || error.message)
      message.error("Thao tác câu đố thất bại: " + (error.response?.data || error.message))
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
      title: "Tên Câu đố",
      dataIndex: "quizName",
      key: "quizName",
      width: 200,
      ellipsis: true,
    },
    {
      title: "Thời gian (phút)",
      dataIndex: "quizTime",
      key: "quizTime",
      width: 120,
      align: "center",
      render: (time) => time || "N/A",
    },
    {
      title: "Tổng số câu hỏi",
      dataIndex: "totalQuestions",
      key: "totalQuestions",
      width: 120,
      align: "center",
    },
    {
      title: "Điểm đạt",
      dataIndex: "passScore",
      key: "passScore",
      width: 100,
      align: "center",
      render: (score) => score || "N/A",
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
            title="Bạn có chắc chắn muốn xóa câu đố này?"
            description="Hành động này không thể hoàn tác. Câu đố có câu hỏi sẽ bị xóa cùng."
            onConfirm={() => handleDelete(record.quizID)}
            okText="Có"
            cancelText="Không"
          >
            <Button danger size="small" icon={<DeleteOutlined />}>
              Xóa
            </Button>
          </Popconfirm>
          <Button
            icon={<QuestionOutlined />}
            onClick={() =>
              navigate(`/admin/courses/${courseId}/modules/${moduleId}/quizzes/${record.quizID}/questions`)
            }
          >
            Quản lý Câu hỏi
          </Button>
        </Space>
      ),
      width: 250,
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
          📚 Quản lý Câu đố của Module: {moduleName} (Khóa học: {courseName})
        </h2>
        <p style={{ margin: "4px 0 0 0", color: "#666" }}>Quản lý các câu đố cho module "{moduleName}"</p>
      </div>
      <div
        style={{
          display: "flex",
          justifyContent: "flex-end",
          marginBottom: "16px",
        }}
      >
        <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
          Thêm Câu đố mới
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
          dataSource={quizzes}
          rowKey={(record) => record.key}
          loading={loading}
          pagination={{
            ...pagination,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) => `${range[0]}-${range[1]} của ${total} câu đố`,
          }}
          onChange={handleTableChange}
          scroll={{ x: 1000 }}
          size="middle"
        />
      </div>
      <Modal
        title={editingQuiz ? "Chỉnh sửa Câu đố" : "Thêm Câu đố mới"}
        open={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={null}
        width={600}
      >
        <Form form={form} layout="vertical" onFinish={onFinish}>
          <Form.Item
            label="Tên Câu đố"
            name="quizName"
            rules={[
              { required: true, message: "Vui lòng nhập tên câu đố" },
              { max: 255, message: "Tên câu đố tối đa 255 ký tự" }
            ]}
          >
            <Input placeholder="Nhập tên câu đố" />
          </Form.Item>
          <Form.Item
            label="Thời gian làm bài (phút)"
            name="quizTime"
            rules={[
              { type: "number", min: 1, message: "Thời gian làm bài phải lớn hơn 0" }
            ]}
          >
            <InputNumber min={1} placeholder="Ví dụ: 30" style={{ width: "100%" }} />
          </Form.Item>
          <Form.Item
            label="Điểm đạt"
            name="passScore"
            rules={[
              { type: "number", min: 0, max: 100, message: "Điểm đạt phải từ 0 đến 100" }
            ]}
          >
            <InputNumber min={0} max={100} placeholder="Ví dụ: 70" style={{ width: "100%" }} />
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
              {editingQuiz ? "Cập nhật" : "Thêm mới"}
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

export default ManaQuiz
