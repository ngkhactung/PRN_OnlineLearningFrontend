import Auth from "./pages/auth/Auth.jsx";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "./pages/Home.jsx";
import About from "./pages/About.jsx";
import Courses from "./pages/Courses.jsx";
import CourseDetails from "./pages/CourseDetails.jsx";
import Contact from "./pages/Contact.jsx";
import MainLayout from "./components/layouts/MainLayout.jsx";
import CourseLearning from "./pages/user/CourseLearning.jsx";
import Otp from "./pages/auth/Otp.jsx";
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<MainLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/courses" element={<Courses />} />
          <Route path="/courseDetail" element={<CourseDetails />} />
          <Route path="/contact" element={<Contact />} />
        </Route>
        <Route path="/auth" element={<Auth />} />
        <Route path="/otp" element={<Otp />} />
        <Route path="/courseLearning" element={<CourseLearning />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
