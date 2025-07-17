import Auth from "./pages/auth/Auth.jsx";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "./pages/Home.jsx";
import About from "./pages/About.jsx";
import Courses from "./pages/Courses.jsx";
import CourseDetails from "./pages/CourseDetails.jsx";
import Contact from "./pages/Contact.jsx";
import Profile from "./pages/user/Profile.jsx";
import Cart from "./pages/user/Cart.jsx";
import MainLayout from "./components/layouts/MainLayout.jsx";
import CourseLearning from "./pages/user/CourseLearning.jsx";
import MyLearning from "./pages/user/MyLearning.jsx";
import ManaCourse from "./pages/admin/ManaCourse.jsx";
import AddCourse from "./pages/admin/AddCourse.jsx";
import EditCourse from "./pages/admin/EditCourse.jsx";
import ManaModule from "./pages/admin/ManaModule.jsx"; // Import ManaModule
import ManaLesson from "./pages/admin/ManaLesson.jsx"; // Import ManaLesson
import ManaQuiz from "./pages/admin/ManaQuiz.jsx"; // Import ManaQuiz
import ManaQuestion from "./pages/admin/ManaQuestion.jsx"; // Import ManaQuestion
import AdminLayout from "./components/admin/AdminLayout.jsx";
import { AuthProvider, useAuth } from "./contexts/AuthContext.jsx";
import { setAuthContextUpdate } from "./services/authService.js";
import AccessDenied from "./pages/auth/AccessDenied.jsx";
import { useEffect } from "react";
import PrivateRoute from "./components/PrivateRoute.jsx";

function AppContent() {
  const { updateAuthState } = useAuth();
  const AdminDashboard = () => (
    <div>
      <h2 style={{ marginBottom: "16px" }}>Dashboard</h2>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
          gap: "16px",
        }}
      >
        <div
          style={{
            padding: "24px",
            background: "#f0f2f5",
            borderRadius: "8px",
            textAlign: "center",
          }}
        >
          <h3>Tổng số khóa học</h3>
          <p style={{ fontSize: "24px", fontWeight: "bold", color: "#1890ff" }}>
            0
          </p>
        </div>
        <div
          style={{
            padding: "24px",
            background: "#f0f2f5",
            borderRadius: "8px",
            textAlign: "center",
          }}
        >
          <h3>Học viên</h3>
          <p style={{ fontSize: "24px", fontWeight: "bold", color: "#52c41a" }}>
            0
          </p>
        </div>
        <div
          style={{
            padding: "24px",
            background: "#f0f2f5",
            borderRadius: "8px",
            textAlign: "center",
          }}
        >
          <h3>Doanh thu tháng</h3>
          <p style={{ fontSize: "24px", fontWeight: "bold", color: "#faad14" }}>
            0 VNĐ
          </p>
        </div>
      </div>
    </div>
  );

  useEffect(() => {
    // Set the auth context update function for authService
    setAuthContextUpdate(updateAuthState);
  }, [updateAuthState]);

  return (
    <BrowserRouter>
      <Routes>
        <Route element={<MainLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/courses" element={<Courses />} />
          <Route path="/courses/:id" element={<CourseDetails />} />
          <Route path="/contact" element={<Contact />} />
          {/* Các route cần đăng nhập */}
          <Route element={<PrivateRoute />}>
            <Route path="/profile" element={<Profile />} />
            <Route path="/cart" element={<Cart />} />
          </Route>
        </Route>
        <Route element={<PrivateRoute />}>
          <Route
            path="/user/my-learning/:myLearningTab"
            element={<MyLearning />}
          />
          <Route
            path="/user/course-learning/:courseId"
            element={<CourseLearning />}
          />
        </Route>
        <Route path="/auth" element={<Auth />} />
        <Route path="/access-denied" element={<AccessDenied />} />
        {/* Admin routes với layout */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<AdminDashboard />} />
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="courses" element={<ManaCourse />} />
          <Route path="courses/add" element={<AddCourse />} />
          <Route path="courses/edit/:id" element={<EditCourse />} />
          {/* Thêm route cho ManaModule */}
          <Route path="courses/:courseId/modules" element={<ManaModule />} />
          {/* Thêm route cho ManaLesson */}
          <Route
            path="courses/:courseId/modules/:moduleId/lessons"
            element={<ManaLesson />}
          />
          {/* Thêm route cho ManaQuiz */}
          <Route
            path="courses/:courseId/modules/:moduleId/quizzes"
            element={<ManaQuiz />}
          />
          {/* Thêm route cho ManaQuestion */}
          <Route
            path="courses/:courseId/modules/:moduleId/quizzes/:quizId/questions"
            element={<ManaQuestion />}
          />
          <Route
            path="users"
            element={<div>Quản lý người dùng - Coming soon</div>}
          />
          <Route path="settings" element={<div>Cài đặt - Coming soon</div>} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
