<<<<<<< HEAD
import React, { useState, useEffect } from "react";
import { Form, Input, Button, Select, message, Upload } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import Header from "../../components/common/Header";
import Footer from "../../components/common/Footer";
=======
import { useState, useEffect } from "react";
import { Form, Input, Button, Select, message, Upload, Card, Space, Row, Col, InputNumber } from "antd";
import { UploadOutlined, ArrowLeftOutlined } from "@ant-design/icons";
import { api } from "../../services/apiClient";
import { useNavigate } from "react-router-dom";

const API_BASE_URL = "https://localhost:5000";
>>>>>>> dev

function AddCourse() {
  const [form] = Form.useForm();
  const [languages, setLanguages] = useState([]);
  const [levels, setLevels] = useState([]);
  const [categories, setCategories] = useState([]);
<<<<<<< HEAD
  const [imagePaths, setImagePaths] = useState([]);
  const [loading, setLoading] = useState(true); // Add loading state
=======
  const [file, setFile] = useState(null); // Single file to be uploaded
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
>>>>>>> dev
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [langRes, levelRes, catRes] = await Promise.all([
<<<<<<< HEAD
          axios.get("/api/languages"),
          axios.get("/api/levels"),
          axios.get("/api/categories"),
        ]);
        // Adjust based on your API response structure
        setLanguages(langRes.data || []); // Fallback to empty array
        setLevels(levelRes.data || []);
        setCategories(catRes.data || []);
      } catch (error) {
        message.error("Failed to fetch data");
        setLanguages([]); // Fallback on error
        setLevels([]);
        setCategories([]);
=======
          api.get(`/admin/Languages`),
          api.get(`/admin/Levels`),
          api.get(`/admin/Categories`),
        ]);
        setLanguages(
          langRes.data.map((lang) => ({
            value: lang.languageId,
            text: lang.languageName,
          }))
        );
        setLevels(
          levelRes.data.map((level) => ({
            value: level.levelId,
            text: level.levelName,
          }))
        );
        setCategories(
          catRes.data.map((cat) => ({
            value: cat.categoryId,
            text: cat.categoryName,
          }))
        );
      } catch (error) {
        console.error("Fetch Data Error:", error.response?.data || error.message);
        message.error("Không thể tải dữ liệu cần thiết để tạo khóa học.");
>>>>>>> dev
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

<<<<<<< HEAD
  const handleImageUpload = async ({ file }) => {
    if (imagePaths.length >= 4) {
      message.error("Bạn chỉ có thể tải lên tối đa 4 ảnh.");
      return;
    }
    if (!file.type.startsWith("image/")) {
      message.error("Vui lòng chỉ tải lên file hình ảnh.");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      message.error("Kích thước ảnh không được vượt quá 5MB.");
      return;
    }

    const formData = new FormData();
    formData.append("images", file);
    try {
      const response = await axios.post("/api/courses/upload-images", formData);
      if (response.data.success) {
        setImagePaths((prev) => [...prev, ...response.data.imagePaths]);
        message.success("Image uploaded successfully");
      } else {
        message.error(response.data.message || "Error uploading image");
      }
    } catch (error) {
      message.error("Error uploading image");
    }
  };

  const handleImageRemove = async (path) => {
    try {
      await axios.post("/api/courses/delete-image", { imagePath: path });
      setImagePaths((prev) => prev.filter((p) => p !== path));
      message.success("Image removed successfully");
    } catch (error) {
      message.error("Error removing image");
    }
  };

  const onFinish = async (values) => {
    const courseData = {
      ...values,
      uploadedImagePaths: imagePaths,
    };
    try {
      await axios.post("/api/courses", courseData);
      message.success("Course created successfully");
      navigate("/courses");
    } catch (error) {
      message.error("Failed to create course");
=======
  const handleUploadChange = ({ fileList }) => {
    // Since maxCount is 1, fileList will have at most 1 item
    if (fileList.length > 0) {
      setFile(fileList[0].originFileObj);
    } else {
      setFile(null);
    }
  };

  const beforeUpload = (newFile) => {
    // Prevent upload if a file is already selected
    if (file) {
      message.error("Bạn chỉ có thể tải lên tối đa 1 ảnh!");
      return Upload.LIST_IGNORE; // Prevent adding to fileList
    }

    // Validate file type
    const allowedExtensions = [".jpg", ".jpeg", ".png", ".gif"];
    const extension = newFile.name.slice(newFile.name.lastIndexOf(".")).toLowerCase();
    if (!allowedExtensions.includes(extension)) {
      message.error(`File ${newFile.name} có định dạng không hợp lệ. Chỉ cho phép: ${allowedExtensions.join(", ")}`);
      return Upload.LIST_IGNORE;
    }

    // Validate file size (max 10MB)
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (newFile.size > maxSize) {
      message.error(`File ${newFile.name} vượt quá giới hạn 10MB`);
      return Upload.LIST_IGNORE;
    }

    return true; // Allow upload
  };

  const onFinish = async (values) => {
    setSubmitting(true);
    const formData = new FormData();
    formData.append("CourseName", values.courseName);
    formData.append("Description", values.description || "");
    formData.append("Creator", "Admin");
    formData.append("StudyTime", "0");
    if (values.languageId !== undefined && values.languageId !== null) {
      formData.append("LanguageID", values.languageId.toString());
    }
    if (values.levelId !== undefined && values.levelId !== null) {
      formData.append("LevelID", values.levelId.toString());
    }
    if (values.price !== undefined && values.price !== null) {
      formData.append("Price", Number(values.price));
    }
    if (values.status !== undefined && values.status !== null) {
      formData.append("Status", values.status.toString());
    }
    if (Array.isArray(values.categoryId)) {
      values.categoryId.forEach((id) => formData.append("CategoryIDs", id.toString()));
    }
    if (file) {
      formData.append("AttachmentFiles", file);
    }

    try {
      const res = await api.post(`/admin/Courses`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      message.success("Tạo khóa học thành công");
      navigate("/admin/courses");
    } catch (error) {
      console.error("Create Course Error:", error.response?.data || error.message);
      message.error("Tạo khóa học thất bại: " + (error.response?.data || error.message));
    } finally {
      setSubmitting(false);
>>>>>>> dev
    }
  };

  if (loading) {
<<<<<<< HEAD
    return <div className="pt-20 min-h-screen flex items-center justify-center">Loading...</div>; // Adjusted for fixed Header
  }

  return (
    <>
      <Header />
      <section className="pt-20 min-h-screen bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="bg-white rounded-lg shadow-md p-8">
            <h4 className="text-2xl font-bold mb-4">Add Course</h4>
            <Form form={form} onFinish={onFinish} layout="vertical">
              <Form.Item
                label="Course Name"
                name="courseName"
                rules={[{ required: true, message: "Please enter course name" }]}
              >
                <Input />
              </Form.Item>
              <Form.Item label="Course Images (Max 4)">
                <Upload
                  listType="picture-card"
                  fileList={imagePaths.map((path, index) => ({
                    uid: index,
                    name: `image-${index}`,
                    status: "done",
                    url: path,
                  }))}
                  onRemove={(file) => handleImageRemove(file.url)}
                  customRequest={handleImageUpload}
                  accept="image/*"
                >
                  {imagePaths.length < 4 && <UploadOutlined />}
                </Upload>
              </Form.Item>
              <Form.Item label="Course Description" name="description">
                <Input.TextArea rows={3} />
              </Form.Item>
              <Form.Item
                label="Course Price"
                name="price"
                rules={[{ required: true, message: "Please enter course price" }]}
              >
                <Input type="number" />
              </Form.Item>
              <Form.Item label="Course Discount" name="discount">
                <Input type="number" />
              </Form.Item>
              <Form.Item
                label="Course Language"
                name="languageId"
                rules={[{ required: true, message: "Please select a language" }]}
              >
                <Select>
                  {Array.isArray(languages) ? (
                    languages.map((lang) => (
                      <Select.Option key={lang.value} value={lang.value}>
                        {lang.text}
                      </Select.Option>
                    ))
                  ) : (
                    <Select.Option disabled>No languages available</Select.Option>
                  )}
                </Select>
              </Form.Item>
              <Form.Item
                label="Course Level"
                name="levelId"
                rules={[{ required: true, message: "Please select a level" }]}
              >
                <Select>
                  {Array.isArray(levels) ? (
                    levels.map((level) => (
                      <Select.Option key={level.value} value={level.value}>
                        {level.text}
                      </Select.Option>
                    ))
                  ) : (
                    <Select.Option disabled>No levels available</Select.Option>
                  )}
                </Select>
              </Form.Item>
              <Form.Item
                label="Course Type"
                name="categoryId"
                rules={[{ required: true, message: "Please select a category" }]}
              >
                <Select>
                  {Array.isArray(categories) ? (
                    categories.map((cat) => (
                      <Select.Option key={cat.value} value={cat.value}>
                        {cat.text}
                      </Select.Option>
                    ))
                  ) : (
                    <Select.Option disabled>No categories available</Select.Option>
                  )}
                </Select>
              </Form.Item>
              <Form.Item>
                <Button type="primary" htmlType="submit">
                  Submit
                </Button>
                <Link to="/courses">
                  <Button className="ml-2">Back</Button>
                </Link>
              </Form.Item>
            </Form>
          </div>
        </div>
      </section>
      <Footer />
    </>
=======
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "400px",
        }}
      >
        <div>Đang tải dữ liệu...</div>
      </div>
    );
  }

  // Prepare fileList for Ant Design Upload component
  const currentFileList = file ? [{
    uid: '1', // Unique ID for the file
    name: file.name,
    status: 'done',
    url: URL.createObjectURL(file),
    originFileObj: file,
  }] : [];

  return (
    <div>
      <div style={{ marginBottom: "24px" }}>
        <Space>
          <Button icon={<ArrowLeftOutlined />} onClick={() => navigate("/admin/courses")}>
            Quay lại
          </Button>
        </Space>
        <h2 style={{ margin: "8px 0 0 0", fontSize: "24px", fontWeight: "bold" }}>➕ Thêm khóa học mới</h2>
        <p style={{ margin: "4px 0 0 0", color: "#666" }}>Tạo khóa học mới cho hệ thống</p>
      </div>
      <Row gutter={24}>
        <Col xs={24} lg={24}>
          <Card title="📝 Thông tin khóa học">
            <Form form={form} onFinish={onFinish} layout="vertical" requiredMark={false}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px" }}>
                <div>
                  <Form.Item
                    label="Tên khóa học"
                    name="courseName"
                    rules={[
                      { required: true, message: "Vui lòng nhập tên khóa học" },
                      { max: 100, message: "Tên khóa học tối đa 100 ký tự" }
                    ]}
                  >
                    <Input placeholder="Nhập tên khóa học" />
                  </Form.Item>
                  <Form.Item
                    label="Mô tả khóa học"
                    name="description"
                    rules={[
                      { required: true, message: "Vui lòng nhập mô tả" },
                      { max: 1000, message: "Mô tả tối đa 1000 ký tự" }
                    ]}
                  >
                    <Input.TextArea rows={4} placeholder="Nhập mô tả chi tiết về khóa học" />
                  </Form.Item>
                  <Form.Item
                    label="Thời gian học"
                    name="studyTime"
                    initialValue={0}
                    hidden
                  >
                    <Input type="hidden" value={0} />
                  </Form.Item>
                </div>
                <div>
                  <Form.Item label="Hình ảnh khóa học (Tối đa 1 ảnh)">
                    <Upload
                      listType="picture-card"
                      fileList={currentFileList}
                      onChange={handleUploadChange}
                      beforeUpload={beforeUpload}
                      accept=".jpg,.jpeg,.png,.gif"
                      maxCount={1} // Limit to 1 file
                    >
                      {currentFileList.length < 1 && (
                        <div>
                          <UploadOutlined />
                          <div style={{ marginTop: 8 }}>Tải ảnh lên</div>
                        </div>
                      )}
                    </Upload>
                  </Form.Item>
                </div>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: "16px" }}>
                <Form.Item
                  label="Ngôn ngữ"
                  name="languageId"
                  rules={[
                    { required: true, message: "Vui lòng chọn ngôn ngữ" }
                  ]}
                >
                  <Select placeholder="Chọn ngôn ngữ" allowClear>
                    {languages.map((lang) => (
                      <Select.Option key={lang.value} value={lang.value}>
                        {lang.text}
                      </Select.Option>
                    ))}
                  </Select>
                </Form.Item>
                <Form.Item
                  label="Cấp độ"
                  name="levelId"
                  rules={[
                    { required: true, message: "Vui lòng chọn cấp độ" }
                  ]}
                >
                  <Select placeholder="Chọn cấp độ" allowClear>
                    {levels.map((level) => (
                      <Select.Option key={level.value} value={level.value}>
                        {level.text}
                      </Select.Option>
                    ))}
                  </Select>
                </Form.Item>
                <Form.Item
                  label="Danh mục"
                  name="categoryId"
                  rules={[
                    { required: true, message: "Vui lòng chọn danh mục" },
                    { type: "array", min: 1, message: "Phải chọn ít nhất 1 danh mục" }
                  ]}
                >
                  <Select placeholder="Chọn danh mục" mode="multiple" allowClear>
                    {categories.map((cat) => (
                      <Select.Option key={cat.value} value={cat.value}>
                        {cat.text}
                      </Select.Option>
                    ))}
                  </Select>
                </Form.Item>
                <Form.Item
                  label="Trạng thái"
                  name="status"
                  rules={[{ required: true, message: "Vui lòng chọn trạng thái" }]}
                  initialValue={1} // Default to active for new courses
                >
                  <Select placeholder="Chọn trạng thái">
                    <Select.Option value={0}>Bản nháp</Select.Option>
                    <Select.Option value={1}>Hoạt động</Select.Option>
                  </Select>
                </Form.Item>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                <Form.Item
                  label="Giá khóa học (VNĐ)"
                  name="price"
                  rules={[
                    { required: true, message: "Vui lòng nhập giá khóa học" },
                    { type: "number", min: 0, message: "Giá phải lớn hơn hoặc bằng 0" }
                  ]}
                >
                  <InputNumber style={{ width: "100%" }} min={0} />
                </Form.Item>
              </div>
              <div
                style={{
                  marginTop: "24px",
                  paddingTop: "24px",
                  borderTop: "1px solid #f0f0f0",
                  display: "flex",
                  gap: "12px",
                }}
              >
                <Button type="primary" htmlType="submit" loading={submitting} size="large">
                  {submitting ? "Đang tạo..." : "Tạo khóa học"}
                </Button>
                <Button size="large" onClick={() => navigate("/admin/courses")}>
                  Hủy bỏ
                </Button>
              </div>
            </Form>
          </Card>
        </Col>
      </Row>
    </div>
>>>>>>> dev
  );
}

export default AddCourse;