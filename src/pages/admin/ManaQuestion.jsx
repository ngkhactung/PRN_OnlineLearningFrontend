import { useState, useEffect } from "react"
import { Table, Button, message, Popconfirm, Space, Modal, Form, Input, InputNumber, Select, Checkbox } from "antd"
import { PlusOutlined, EditOutlined, DeleteOutlined, ArrowLeftOutlined } from "@ant-design/icons"
import axios from "axios"
import { useParams, useNavigate } from "react-router-dom"

const API_BASE_URL = "https://localhost:5000" // Backend URL

function ManaQuestion() {
  const { courseId, moduleId, quizId } = useParams()
  const navigate = useNavigate()
  const [questions, setQuestions] = useState([])
  const [loading, setLoading] = useState(false)
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  })
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [editingQuestion, setEditingQuestion] = useState(null) // null for add, object for edit
  const [form] = Form.useForm()
  const [courseName, setCourseName] = useState("")
  const [moduleName, setModuleName] = useState("")
  const [quizName, setQuizName] = useState("")

  useEffect(() => {
    fetchQuestions()
    fetchQuizAndModuleAndCourseName()
  }, [pagination.current, pagination.pageSize, quizId]) // ✅ Bỏ searchText và filterStatus

  // Fetch quiz, module, and course name for display
  const fetchQuizAndModuleAndCourseName = async () => {
    try {
      const quizRes = await axios.get(`${API_BASE_URL}/api/admin/Quizzes/${quizId}`)
      setQuizName(quizRes.data.quizName)
      const moduleRes = await axios.get(`${API_BASE_URL}/api/admin/Modules/${moduleId}`)
      setModuleName(moduleRes.data.moduleName)
      const courseRes = await axios.get(`${API_BASE_URL}/api/admin/Courses/${courseId}`)
      setCourseName(courseRes.data.courseName)
    } catch (error) {
      console.error("Fetch Quiz/Module/Course Name Error:", error.response?.data || error.message)
      message.error("Không thể tải thông tin câu đố, module hoặc khóa học.")
    }
  }

  // READ: Lấy danh sách câu hỏi
  const fetchQuestions = async () => {
    setLoading(true)
    try {
      const res = await axios.get(`${API_BASE_URL}/api/admin/Questions`, {
        params: {
          quizId: quizId,
          page: pagination.current,
          pageSize: pagination.pageSize,
          // ✅ Bỏ search và status parameters
        },
      })
      if (!Array.isArray(res.data)) {
        throw new Error("API response for questions is not an array")
      }
      setQuestions(res.data.map((q) => ({ ...q, key: q.questionID })))
      setPagination((prev) => ({
        ...prev,
        total: Number.parseInt(res.headers["x-total-count"]) || 0,
      }))
    } catch (error) {
      console.error("Fetch Questions Error:", error.response?.data || error.message)
      message.error("Không thể tải danh sách câu hỏi.")
    } finally {
      setLoading(false)
    }
  }

  // CREATE: Mở modal để thêm câu hỏi mới
  const handleAdd = () => {
    setEditingQuestion(null) // Đặt null để biết là đang thêm mới
    form.resetFields() // Xóa dữ liệu cũ trong form
    form.setFieldsValue({ options: [{ content: "", isCorrect: false, status: 1 }] }) // Default one option
    setIsModalVisible(true)
  }

  // UPDATE: Mở modal để chỉnh sửa câu hỏi
  const handleEdit = (record) => {
    setEditingQuestion(record)
    form.setFieldsValue({
      questionNum: record.questionNum,
      content: record.content,
      type: record.type,
      status: record.status,
      // Map options to include optionID for updates
      options:
        record.options?.map((opt) => ({
          optionID: opt.optionID, // Ensure optionID is passed for existing options
          content: opt.content,
          isCorrect: opt.isCorrect,
          status: opt.status,
        })) || [],
    })
    setIsModalVisible(true)
  }

  // DELETE: Xóa câu hỏi
  const handleDelete = async (questionId) => {
    try {
      await axios.delete(`${API_BASE_URL}/api/admin/Questions/${questionId}`)
      message.success("Đã xóa câu hỏi thành công")
      fetchQuestions() // Tải lại danh sách sau khi xóa
    } catch (error) {
      console.error("Delete Question Error:", error.response?.data || error.message)
      message.error(
        error.response?.status === 404
          ? "Câu hỏi không tồn tại"
          : error.response?.status === 500
            ? "Lỗi server khi xóa câu hỏi"
            : "Không thể xóa câu hỏi",
      )
    }
  }

  // CREATE/UPDATE: Xử lý khi gửi form (thêm mới hoặc cập nhật)
  const onFinish = async (values) => {
    try {
      // Filter out options with empty content, but keep existing options if their content becomes empty
      // The backend will handle removal of options not sent in the update DTO
      const filteredOptions = values.options
        .map((opt) => ({
          optionID: opt.optionID || 0, // Send 0 for new options, actual ID for existing
          content: opt.content.trim(),
          isCorrect: opt.isCorrect,
          status: opt.status,
        }))
        .filter((opt) => opt.content !== "" || opt.optionID !== 0) // Keep existing options even if content is cleared

      if (editingQuestion) {
        // UPDATE: Gửi yêu cầu PUT nếu đang chỉnh sửa
        await axios.put(`${API_BASE_URL}/api/admin/Questions/${editingQuestion.questionID}`, {
          questionID: editingQuestion.questionID, // Include questionID in the body for PUT
          questionNum: values.questionNum,
          content: values.content,
          type: values.type,
          status: values.status,
          options: filteredOptions,
        })
        message.success("Cập nhật câu hỏi thành công")
      } else {
        // CREATE: Gửi yêu cầu POST nếu đang thêm mới
        await axios.post(`${API_BASE_URL}/api/admin/Questions`, {
          quizID: quizId, // Gửi kèm quizId
          questionNum: values.questionNum || 0,
          content: values.content,
          type: values.type !== undefined ? values.type : 0, // ✅ Sửa lỗi: Kiểm tra undefined cho type
          status: values.status !== undefined ? values.status : 1, // ✅ Sửa lỗi: Kiểm tra undefined cho status
          options: filteredOptions,
        })
        message.success("Thêm câu hỏi mới thành công")
      }
      setIsModalVisible(false) // Đóng modal
      fetchQuestions() // Tải lại danh sách sau khi thêm/cập nhật
    } catch (error) {
      console.error("Question Operation Error:", error.response?.data || error.message)
      message.error("Thao tác câu hỏi thất bại: " + (error.response?.data || error.message))
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
      title: "Số thứ tự Câu hỏi",
      dataIndex: "questionNum",
      key: "questionNum",
      width: 120,
      align: "center",
    },
    {
      title: "Nội dung Câu hỏi",
      dataIndex: "content",
      key: "content",
      width: 300,
      ellipsis: true,
    },
    {
      title: "Loại",
      dataIndex: "type",
      key: "type",
      width: 100,
      align: "center",
      render: (type) => (type === 0 ? "Trắc nghiệm" : "Tự luận"), // Giả định 0 là trắc nghiệm, 1 là tự luận
    },
    {
      title: "Tùy chọn",
      dataIndex: "options",
      key: "options",
      width: 250,
      render: (options) => (
        <ul style={{ paddingLeft: 20, margin: 0 }}>
          {options?.map((opt, idx) => (
            <li key={opt.optionID || idx} style={{ color: opt.isCorrect ? "#52c41a" : "inherit" }}>
              {opt.content} {opt.isCorrect && "(Đúng)"}
            </li>
          ))}
        </ul>
      ),
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
            title="Bạn có chắc chắn muốn xóa câu hỏi này?"
            description="Hành động này không thể hoàn tác."
            onConfirm={() => handleDelete(record.questionID)}
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
          <Button
            icon={<ArrowLeftOutlined />}
            onClick={() => navigate(`/admin/courses/${courseId}/modules/${moduleId}/quizzes`)}
          >
            Quay lại danh sách Câu đố
          </Button>
        </Space>
        <h2 style={{ margin: "8px 0 0 0", fontSize: "24px", fontWeight: "bold" }}>
          📚 Quản lý Câu hỏi của Câu đố: {quizName} (Module: {moduleName}, Khóa học: {courseName})
        </h2>
        <p style={{ margin: "4px 0 0 0", color: "#666" }}>Quản lý các câu hỏi cho câu đố "{quizName}"</p>
      </div>

      {/* ✅ Bỏ phần tìm kiếm và filter, chỉ giữ lại button thêm mới */}
      <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: "16px" }}>
        <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
          Thêm Câu hỏi mới
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
          dataSource={questions}
          rowKey={(record) => record.key}
          loading={loading}
          pagination={{
            ...pagination,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) => `${range[0]}-${range[1]} của ${total} câu hỏi`,
          }}
          onChange={handleTableChange}
          scroll={{ x: 1200 }}
          size="middle"
        />
      </div>

      <Modal
        title={editingQuestion ? "Chỉnh sửa Câu hỏi" : "Thêm Câu hỏi mới"}
        open={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={null}
        width={800}
      >
        <Form form={form} layout="vertical" onFinish={onFinish}>
          <Form.Item
            label="Số thứ tự Câu hỏi"
            name="questionNum"
            tooltip="Để trống nếu muốn tự động tạo số thứ tự tiếp theo"
            rules={[
              { type: "number", min: 0, message: "Số thứ tự câu hỏi phải lớn hơn hoặc bằng 0" }
            ]}
          >
            <InputNumber min={0} placeholder="Ví dụ: 1, 2, 3..." style={{ width: "100%" }} />
          </Form.Item>
          <Form.Item
            label="Nội dung Câu hỏi"
            name="content"
            rules={[
              { required: true, message: "Vui lòng nhập nội dung câu hỏi" },
              { max: 255, message: "Nội dung câu hỏi tối đa 255 ký tự" }
            ]}
          >
            <Input.TextArea rows={3} placeholder="Nhập nội dung câu hỏi" />
          </Form.Item>
          <Form.Item
            label="Loại Câu hỏi"
            name="type"
            rules={[
              { required: true, message: "Vui lòng chọn loại câu hỏi" }
            ]}
            initialValue={0} // Default to Multiple Choice
          >
            <Select placeholder="Chọn loại câu hỏi">
              <Select.Option value={0}>Trắc nghiệm</Select.Option>
              <Select.Option value={1}>Tự luận</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item
            label="Trạng thái"
            name="status"
            rules={[
              { required: true, message: "Vui lòng chọn trạng thái" }
            ]}
            initialValue={1} // Default to active
          >
            <Select placeholder="Chọn trạng thái">
              <Select.Option value={0}>Bản nháp</Select.Option>
              <Select.Option value={1}>Hoạt động</Select.Option>
            </Select>
          </Form.Item>
          {/* Dynamic form for Options */}
          <Form.List name="options">
            {(fields, { add, remove }) => (
              <>
                <div style={{ marginBottom: 16 }}>
                  <h3 style={{ margin: "0 0 8px 0" }}>Tùy chọn trả lời</h3>
                  <Button
                    type="dashed"
                    onClick={() => add({ content: "", isCorrect: false, status: 1 })}
                    block
                    icon={<PlusOutlined />}
                  >
                    Thêm Tùy chọn
                  </Button>
                </div>
                {fields.map(({ key, name, ...restField }) => (
                  <Space key={key} style={{ display: "flex", marginBottom: 8 }} align="baseline">
                    <Form.Item
                      {...restField}
                      name={[name, "content"]}
                      rules={[
                        { required: true, message: "Vui lòng nhập nội dung tùy chọn" },
                        { max: 255, message: "Nội dung tùy chọn tối đa 255 ký tự" }
                      ]}
                      style={{ flexGrow: 1 }}
                    >
                      <Input placeholder="Nội dung tùy chọn" />
                    </Form.Item>
                    <Form.Item {...restField} name={[name, "isCorrect"]} valuePropName="checked">
                      <Checkbox>Là đáp án đúng</Checkbox>
                    </Form.Item>
                    <Form.Item
                      {...restField}
                      name={[name, "status"]}
                      rules={[
                        { required: true, message: "Chọn trạng thái" }
                      ]}
                      initialValue={1}
                    >
                      <Select placeholder="Trạng thái" style={{ width: 100 }}>
                        <Select.Option value={0}>Bản nháp</Select.Option>
                        <Select.Option value={1}>Hoạt động</Select.Option>
                      </Select>
                    </Form.Item>
                    <Button danger onClick={() => remove(name)}>
                      Xóa
                    </Button>
                  </Space>
                ))}
              </>
            )}
          </Form.List>
          <Form.Item>
            <Button type="primary" htmlType="submit">
              {editingQuestion ? "Cập nhật" : "Thêm mới"}
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

export default ManaQuestion
