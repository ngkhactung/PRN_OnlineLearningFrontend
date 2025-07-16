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
import { AuthProvider, useAuth } from "./contexts/AuthContext.jsx";
import { setAuthContextUpdate } from "./services/authService.js";
import AccessDenied from "./pages/auth/AccessDenied.jsx";
import { useEffect } from "react";

function AppContent() {
  const { updateAuthState } = useAuth();

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
          <Route path="/profile" element={<Profile />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/user/my-learning/:myLearningTab" element={<MyLearning />} />
        </Route>
        <Route path="/auth" element={<Auth />} />
        <Route path="/access-denied" element={<AccessDenied />} />
        <Route path="/user/course-learning/:courseId" element={<CourseLearning />} />
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
