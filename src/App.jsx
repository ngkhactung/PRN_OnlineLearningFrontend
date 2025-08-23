import React, { useEffect } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster } from 'react-hot-toast';

// ⚙️ Auth & Layout
import { AuthProvider, useAuth } from "./contexts/AuthContext.jsx";
import { setAuthContextUpdate } from "./services/apiClient.js";

// 🔐 Route guards
import PrivateRoute from "./components/PrivateRoute.jsx";
import AdminRoute from "./components/PrivateRoute.jsx";

// 🧩 Layouts
import MainLayout from "./components/layouts/MainLayout.jsx";
import AdminLayout from "./components/admin/AdminLayout.jsx";

// 📄 Common Pages
import Auth from "./pages/auth/Auth.jsx";
import AccessDenied from "./pages/auth/AccessDenied.jsx";
import GoogleCallback from "./components/auth/GoogleCallback.jsx";
import FacebookCallback from "./components/auth/FacebookCallback.jsx";
import MicrosoftCallback from "./components/auth/MicrosoftCallback.jsx";
import Home from "./pages/Home.jsx";
import About from "./pages/About.jsx";
import Courses from "./pages/Courses.jsx";
import CourseDetails from "./pages/CourseDetails.jsx";
import Contact from "./pages/Contact.jsx";

// 👤 User Pages
import Profile from "./pages/user/Profile.jsx";
import Cart from "./pages/user/Cart.jsx";
import CourseLearning from "./pages/user/CourseLearning.jsx";
import MyLearning from "./pages/user/MyLearning.jsx";
import CourseRatingsManager from "./components/admin/ratings/CourseRatingsManager.jsx";

// 👑 Admin Pages
import ManaCourse from "./pages/admin/ManaCourse.jsx";
import AddCourse from "./pages/admin/AddCourse.jsx";
import EditCourse from "./pages/admin/EditCourse.jsx";
import ManaModule from "./pages/admin/ManaModule.jsx";
import ManaLesson from "./pages/admin/ManaLesson.jsx";
import ManaQuiz from "./pages/admin/ManaQuiz.jsx";
import ManaQuestion from "./pages/admin/ManaQuestion.jsx";
import DiscountManagement from './components/admin/discounts/DiscountManagement.jsx';
import UserManagement from './pages/admin/UserManagement.jsx';
import DashboardPage from "./pages/admin/DashboardPage.jsx";
import AdminCommentPage from './pages/admin/AdminCommentPage.jsx';

function AppContent() {
  const { updateAuthState } = useAuth();

  const AdminDashboard = () => (
    <div>
      <h2 style={{ marginBottom: "16px" }}>Dashboard</h2>
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
        gap: "16px",
      }}>
        <div style={{
          padding: "24px", background: "#f0f2f5",
          borderRadius: "8px", textAlign: "center"
        }}>
          <h3>Tổng số khóa học</h3>
          <p style={{ fontSize: "24px", fontWeight: "bold", color: "#1890ff" }}>0</p>
        </div>
        <div style={{
          padding: "24px", background: "#f0f2f5",
          borderRadius: "8px", textAlign: "center"
        }}>
          <h3>Học viên</h3>
          <p style={{ fontSize: "24px", fontWeight: "bold", color: "#52c41a" }}>0</p>
        </div>
        <div style={{
          padding: "24px", background: "#f0f2f5",
          borderRadius: "8px", textAlign: "center"
        }}>
          <h3>Doanh thu tháng</h3>
          <p style={{ fontSize: "24px", fontWeight: "bold", color: "#faad14" }}>0 VNĐ</p>
        </div>
      </div>
    </div>
  );

  useEffect(() => {
    setAuthContextUpdate(updateAuthState);
  }, [updateAuthState]);

  return (
    <BrowserRouter>
      <Toaster position="top-right"
        toastOptions={{
          duration: 3000,
          style: { background: '#363636', color: '#fff' },
          success: { style: { background: '#10b981' } },
          error: { style: { background: '#ef4444' } },
        }}
      />

      <Routes>
        {/* 🌐 Public routes */}
        <Route element={<MainLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/courses" element={<Courses />} />
          <Route path="/courses/:id" element={<CourseDetails />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/cart" element={<Cart />} />

          {/* 👨‍🎓 Course Rating (user) */}
          <Route path="/ratings/:courseId" element={<CourseRatingsManager />} />

          {/* Các route cần đăng nhập */}
          <Route element={<PrivateRoute />}>
            <Route path="/user/my-learning/:myLearningTab" element={<MyLearning />} />
          </Route>
        </Route>

        <Route element={<PrivateRoute />}>
          <Route path="/user/course-learning/:courseId" element={<CourseLearning />} />
        </Route>

        {/* Auth routes */}
        <Route path="/auth" element={<Auth />} />
        <Route path="/auth/google/callback" element={<GoogleCallback />} />
        <Route path="/auth/facebook/callback" element={<FacebookCallback />} />
        <Route path="/auth/microsoft/callback" element={<MicrosoftCallback />} />
        <Route path="/access-denied" element={<AccessDenied />} />

        {/* 👑 Admin routes */}
        <Route element={<AdminRoute />}>
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<AdminDashboard />} />
            <Route path="dashboard" element={<DashboardPage />} />
            <Route path="courses" element={<ManaCourse />} />
            <Route path="courses/add" element={<AddCourse />} />
            <Route path="courses/edit/:id" element={<EditCourse />} />
            <Route path="courses/:courseId/modules" element={<ManaModule />} />
            <Route path="courses/:courseId/modules/:moduleId/lessons" element={<ManaLesson />} />
            <Route path="courses/:courseId/modules/:moduleId/quizzes" element={<ManaQuiz />} />
            <Route path="courses/:courseId/modules/:moduleId/quizzes/:quizId/questions" element={<ManaQuestion />} />
            <Route path="users" element={<UserManagement />} />
            <Route path="discounts" element={<DiscountManagement />} />
            <Route path="comments" element={<AdminCommentPage />} />
            <Route path="settings" element={<div>Cài đặt - Coming soon</div>} />
          </Route>
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
