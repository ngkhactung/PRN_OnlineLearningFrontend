<<<<<<< HEAD
import React, { useState, useEffect } from "react";
import { Form, Input, Button, Select, message, Upload, List } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import axios from "axios";
import { useParams, useNavigate, Link } from "react-router-dom";
import Header from "../../components/common/Header";
import Footer from "../../components/common/Footer";
=======
import { useState, useEffect } from "react";
import { Form, Input, Button, Select, message, Upload, Card, Space, Row, Col, InputNumber } from "antd";
import { UploadOutlined, ArrowLeftOutlined } from "@ant-design/icons";
import { api } from "../../services/apiClient";
import { useParams, useNavigate } from "react-router-dom";

const API_BASE_URL = "https://localhost:5000";
>>>>>>> dev

function EditCourse() {
  const [form] = Form.useForm();
  const { id } = useParams();
  const navigate = useNavigate();
  const [languages, setLanguages] = useState([]);
  const [levels, setLevels] = useState([]);
  const [categories, setCategories] = useState([]);
<<<<<<< HEAD
  const [modules, setModules] = useState([]);
  const [imagePaths, setImagePaths] = useState([]);
=======
  const [initialCourseImage, setInitialCourseImage] = useState(null); // Stores the raw URL of the image loaded from API
  const [currentUploadFile, setCurrentUploadFile] = useState([]); // Ant Design's fileList format for the single image
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [isDeleted, setIsDeleted] = useState(false);
>>>>>>> dev

  useEffect(() => {
    const fetchData = async () => {
      try {
<<<<<<< HEAD
        const [courseRes, langRes, levelRes, catRes, modRes] = await Promise.all([
          axios.get(`/api/courses/${id}`),
          axios.get("/api/languages"),
          axios.get("/api/levels"),
          axios.get("/api/categories"),
          axios.get(`/api/modules?courseId=${id}`),
        ]);
        form.setFieldsValue(courseRes.data);
        setImagePaths(courseRes.data.existingImageUrls || []);
        setLanguages(langRes.data);
        setLevels(levelRes.data);
        setCategories(catRes.data);
        setModules(modRes.data);
      } catch (error) {
        message.error("Failed to fetch data");
=======
        const [courseRes, langRes, levelRes, catRes] = await Promise.all([
          api.get(`/admin/Courses/${id}`, {
            headers: { Accept: "application/json" },
          }),
          api.get(`/admin/Languages`),
          api.get(`/admin/Levels`),
          api.get(`/admin/Categories`),
        ]);

        if (courseRes.data.status === -1) {
          setIsDeleted(true);
          message.error("Khóa học đã bị xóa và không thể chỉnh sửa.");
          return;
        }

        const courseData = {
          courseName: courseRes.data.courseName,
          description: courseRes.data.description,
          creator: courseRes.data.creator,
          studyTime: courseRes.data.studyTime,
          languageId: courseRes.data.languageID,
          levelId: courseRes.data.levelID,
          price: courseRes.data.currentPrice,
          categoryId: courseRes.data.categoryIDs,
          status: courseRes.data.status,
        };
        form.setFieldsValue(courseData);

        // Set initial image state
        if (courseRes.data.imageUrls && courseRes.data.imageUrls.length > 0) {
          const imageUrl = courseRes.data.imageUrls[0];
          setInitialCourseImage(imageUrl); // Store raw URL
          setCurrentUploadFile([
            {
              uid: `existing-0-${imageUrl}`, // Unique ID for existing file
              name: imageUrl.substring(imageUrl.lastIndexOf("/") + 1),
              status: "done",
              url: imageUrl.startsWith("http") ? imageUrl : `${API_BASE_URL}${imageUrl}`,
              rawUrl: imageUrl, // Keep raw URL for removal
            },
          ]);
        } else {
          setInitialCourseImage(null);
          setCurrentUploadFile([]);
        }

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
        message.error("Không thể tải dữ liệu: " + (error.response?.data || error.message));
      } finally {
        setLoading(false);
>>>>>>> dev
      }
    };
    fetchData();
  }, [id, form]);

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
      courseId: id,
      uploadedImagePaths: imagePaths,
    };
    try {
      await axios.put(`/api/courses/${id}`, courseData);
      message.success("Course updated successfully");
      navigate("/courses");
    } catch (error) {
      message.error("Failed to update course");
    }
  };

  return (
    <>
      <Header />
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap -mx-4">
            {/* Left Column: Modules */}
            <div className="w-full lg:w-1/3 px-4">
              <div className="bg-white rounded-lg shadow-md p-6">
                <h4 className="text-xl font-bold mb-4">Modules Course</h4>
                {modules.length > 0 ? (
                  <List
                    dataSource={modules}
                    renderItem={(module) => (
                      <List.Item>
                        <Link
                          to={`/lesson-quiz?moduleNumber=${module.moduleNumber}&moduleName=${module.moduleName}&courseId=${module.courseId}`}
                        >
                          <Button type="link">{module.moduleName}</Button>
                        </Link>
                      </List.Item>
                    )}
                  />
                ) : (
                  <p>No modules available.</p>
                )}
                <Link to={`/modules?courseId=${id}`}>
                  <Button className="mt-4">Add Modules</Button>
                </Link>
              </div>
            </div>
            {/* Right Column: Edit Form */}
            <div className="w-full lg:w-2/3 px-4">
              <div className="bg-white rounded-lg shadow-md p-8">
                <h4 className="text-2xl font-bold mb-4">Edit Course</h4>
                <Form form={form} onFinish={onFinish} layout="vertical">
                  <Form.Item name="courseId" hidden>
                    <Input />
                  </Form.Item>
                  <Form.Item name="oldCategoryId" hidden>
                    <Input />
                  </Form.Item>
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
                      {languages.map((lang) => (
                        <Select.Option key={lang.value} value={lang.value}>
                          {lang.text}
                        </Select.Option>
                      ))}
                    </Select>
                  </Form.Item>
                  <Form.Item
                    label="Course Level"
                    name="levelId"
                    rules={[{ required: true, message: "Please select a level" }]}
                  >
                    <Select>
                      {levels.map((level) => (
                        <Select.Option key={level.value} value={level.value}>
                          {level.text}
                        </Select.Option>
                      ))}
                    </Select>
                  </Form.Item>
                  <Form.Item
                    label="Course Type"
                    name="categoryId"
                    rules={[{ required: true, message: "Please select a category" }]}
                  >
                    <Select>
                      {categories.map((cat) => (
                        <Select.Option key={cat.value} value={cat.value}>
                          {cat.text}
                        </Select.Option>
                      ))}
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
          </div>
        </div>
      </section>
      <Footer />
    </>
=======
  const handleUploadChange = ({ fileList, file: changedFile }) => {
    // If a file was removed, and it was the existing one, clear the initialCourseImage
    if (changedFile.status === 'removed' && changedFile.uid.startsWith('existing-')) {
      setInitialCourseImage(null);
    }
    // Always keep only the last file in the list (due to maxCount=1)
    setCurrentUploadFile(fileList.slice(-1));
  };

  const beforeUpload = (newFile) => {
    // If there's already a file (either existing or newly added but not yet processed), prevent new upload
    if (currentUploadFile.length >= 1) {
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

    // Return false to prevent Ant Design from automatically uploading.
    // We will handle the upload manually in onFinish.
    return false;
  };

  const onFinish = async (values) => {
    setSubmitting(true);
    const formData = new FormData();
    formData.append("CourseName", values.courseName);
    formData.append("Description", values.description || "");
    formData.append("StudyTime", values.studyTime);
    formData.append("Status", values.status.toString());
    if (values.languageId !== undefined && values.languageId !== null) {
      formData.append("LanguageID", values.languageId.toString());
    }
    if (values.levelId !== undefined && values.levelId !== null) {
      formData.append("LevelID", values.levelId.toString());
    }
    if (values.price !== undefined && values.price !== null) {
      formData.append("Price", Number(values.price));
    }
    if (Array.isArray(values.categoryId)) {
      values.categoryId.forEach((catId) => formData.append("CategoryIDs", catId.toString()));
    }

    // Determine if a new file is being uploaded
    const newFileToUpload = currentUploadFile.length > 0 && !currentUploadFile[0].uid.startsWith("existing-")
      ? currentUploadFile[0].originFileObj
      : null;

    // Determine if the existing image should be removed
    // This happens if:
    // 1. There was an initial image (loaded from API) AND
    // 2. (The currentUploadFile is empty (user removed it) OR a new file is being uploaded (user replaced it))
    const shouldRemoveExistingImage = initialCourseImage && (currentUploadFile.length === 0 || newFileToUpload);

    if (shouldRemoveExistingImage) {
      formData.append("RemovedImageUrls", initialCourseImage);
    }

    if (newFileToUpload) {
      formData.append("AttachmentFiles", newFileToUpload);
    }

    try {
      const res = await api.put(`/admin/Courses/${id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      message.success("Cập nhật khóa học thành công");
      // After successful update, update initialCourseImage and currentUploadFile to reflect the new state
      if (newFileToUpload) {
        setInitialCourseImage(newFileToUpload.url || URL.createObjectURL(newFileToUpload));
        setCurrentUploadFile([{
          uid: `existing-0-${newFileToUpload.name}`, // Treat new file as existing after successful upload
          name: newFileToUpload.name,
          status: 'done',
          url: URL.createObjectURL(newFileToUpload),
          rawUrl: newFileToUpload.url || URL.createObjectURL(newFileToUpload), // Store URL for potential future removal
        }]);
      } else if (shouldRemoveExistingImage && !newFileToUpload) {
        // If existing image was removed and no new one was uploaded
        setInitialCourseImage(null);
        setCurrentUploadFile([]);
      }
      navigate("/admin/courses");
    } catch (error) {
      console.error("Update Course Error:", error.response?.data || error.message);
      message.error("Cập nhật khóa học thất bại: " + (error.response?.data || error.message));
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "400px" }}>
        <div>Đang tải dữ liệu...</div>
      </div>
    );
  }

  if (isDeleted) {
    return (
      <div>
        <Space>
          <Button icon={<ArrowLeftOutlined />} onClick={() => navigate("/admin/courses")}>
            Quay lại
          </Button>
        </Space>
        <h2 style={{ margin: "8px 0", fontSize: "24px", fontWeight: "bold" }}>
          Lỗi: Khóa học đã bị xóa
        </h2>
        <p style={{ color: "#ff4d4f" }}>
          Khóa học này đã bị xóa và không thể chỉnh sửa. Vui lòng quay lại danh sách khóa học.
        </p>
      </div>
    );
  }

  return (
    <div>
      <div style={{ marginBottom: "24px" }}>
        <Space>
          <Button icon={<ArrowLeftOutlined />} onClick={() => navigate("/admin/courses")}>
            Quay lại
          </Button>
        </Space>
        <h2 style={{ margin: "8px 0 0 0", fontSize: "24px", fontWeight: "bold" }}>✏️ Chỉnh sửa khóa học</h2>
        <p style={{ margin: "4px 0 0 0", color: "#666" }}>Cập nhật thông tin khóa học</p>
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
                    label="Người tạo"
                    name="creator"
                    rules={[{ required: true, message: "Vui lòng nhập tên người tạo" }]}
                  >
                    <Input placeholder="Nhập tên người tạo" />
                  </Form.Item>
                  <Form.Item
                    label="Thời gian học"
                    name="studyTime"
                  >
                    <Input 
                      placeholder="Thời gian học" 
                      disabled={true}
                      style={{ 
                        backgroundColor: '#f5f5f5', 
                        cursor: 'not-allowed',
                        color: '#666'
                      }}
                    />
                  </Form.Item>
                </div>
                <div>
                  <Form.Item label="Hình ảnh khóa học (Tối đa 1 ảnh)">
                    <Upload
                      listType="picture-card"
                      fileList={currentUploadFile}
                      onChange={handleUploadChange}
                      beforeUpload={beforeUpload}
                      accept=".jpg,.jpeg,.png,.gif"
                      maxCount={1} // Limit to 1 file
                    >
                      {currentUploadFile.length < 1 && (
                        <div>
                          <UploadOutlined />
                          <div style={{ marginTop: 8 }}>Tải ảnh lên</div>
                        </div>
                      )}
                    </Upload>
                  </Form.Item>
                </div>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "16px" }}>
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
              <Form.Item
                label="Trạng thái"
                name="status"
                rules={[{ required: true, message: "Vui lòng chọn trạng thái" }]}
              >
                <Select placeholder="Chọn trạng thái">
                  <Select.Option value={0}>Bản nháp</Select.Option>
                  <Select.Option value={1}>Hoạt động</Select.Option>
                </Select>
              </Form.Item>
              <div
                style={{
                  marginTop: "24px",
                  paddingTop: "24px",
                  borderTop: "1px solid #f0f0f0",
                  display: "flex",
                  gap: "12px",
                }}
              >
                <Button
                  type="primary"
                  htmlType="submit"
                  loading={submitting}
                  size="large"
                >
                  {submitting ? "Đang cập nhật..." : "Cập nhật khóa học"}
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

export default EditCourse;