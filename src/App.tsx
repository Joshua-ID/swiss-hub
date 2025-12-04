import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { useStore } from "./store/useStore";

import AdminCourses from "./pages/AdminCourses";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import AdminDashboard from "./pages/AdminDashboard";
import StudentDashboard from "./pages/StudentDashboard";
import CourseCatalog from "./pages/CourseCatalog";
import CourseDetail from "./pages/CourseDetail";
import LessonView from "./pages/LessonView";

function App() {
  const { currentUser } = useStore();
  const isAdmin = currentUser?.role === "admin";

  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />

          {/* Admin Routes */}
          <Route
            path="/admin"
            element={
              isAdmin ? (
                <AdminDashboard />
              ) : (
                <Navigate to="/dashboard" replace />
              )
            }
          />
          <Route
            path="/admin/courses"
            element={
              isAdmin ? <AdminCourses /> : <Navigate to="/dashboard" replace />
            }
          />

          {/* Student Routes */}
          <Route
            path="/dashboard"
            element={
              !isAdmin ? <StudentDashboard /> : <Navigate to="/admin" replace />
            }
          />
          <Route path="/catalog" element={<CourseCatalog />} />

          {/* Course and Lesson Routes */}
          <Route path="/course/:courseId" element={<CourseDetail />} />
          <Route path="/lesson/:lessonId" element={<LessonView />} />

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
