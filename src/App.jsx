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
import LearningLayout from "./components/layouts/LearningLayout.jsx";
import MyLearning from "./pages/user/MyLearning.jsx";
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<MainLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/courses" element={<Courses />} />
          <Route path="/courses/:id" element={<CourseDetails />} />
          <Route path="/contact" element={<Contact />} />

          {/* Required authentication */}
          <Route
            path="/user/my-learning/:myLearningTab"
            element={<MyLearning />}
          />
        </Route>
        <Route path="/auth" element={<Auth />} />
        <Route path="/otp" element={<Otp />} />

        {/* Required authentication */}
        <Route element={<LearningLayout />}>
          <Route
            path="/user/course-learning/:courseId"
            element={<CourseLearning />}
          />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
