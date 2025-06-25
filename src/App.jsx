import Auth from "./pages/auth/Auth.jsx";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "./pages/Home.jsx";
import About from "./pages/About.jsx";
import Courses from "./pages/Courses.jsx";
import CourseDetails from "./pages/CourseDetails.jsx";
import ManaCourse from "./pages/admin/ManaCourse.jsx";
import AddCourse from "./pages/admin/AddCourse.jsx";
import EditCourse from "./pages/admin/EditCourse.jsx";
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/auth" element={<Auth />} />
        <Route path="/about" element={<About />} />
        <Route path="/courses" element={<Courses />} />
        <Route path="/courseDetail" element={<CourseDetails />} />
        <Route path="/manaCourse" element={<ManaCourse />} />
        <Route path="/manaCourses/add" element={<AddCourse />} />
        <Route path="/manaCourses/edit/:id" element={<EditCourse />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
