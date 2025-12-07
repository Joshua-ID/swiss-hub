import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

// Components
import { Navbar } from "./components/Navbar";
import Footer from "./components/Footer";

// Pages
import { AdminCourses } from "./pages/AdminCourses";
import { AdminDashboard } from "./pages/AdminDashboard";
import { StudentDashboard } from "./pages/StudentDashboard";
import { CourseCatalog } from "./pages/CourseCatalog";
import { CourseDetail } from "./pages/CourseDetail";
import { LessonView } from "./pages/LessonView";
import { Home } from "./pages/Home";
import SignInPage from "./pages/SignInPage";
import SignUpPage from "./pages/SignUpPage";
import ProtectedRoute from "./components/ProtectedRoute";

// Loading component
// import LoadingSpinner from "./components/LoadingSpinner";
// import { useStore } from "./store/useStore";
// import { useStore } from "zustand";

function App() {
  // const { currentUser, isLoading, fetchCurrentUser } = useStore();

  // // Fetch user data on app load
  // useEffect(() => {
  //   fetchCurrentUser();
  // }, [fetchCurrentUser]);

  // // Show loading spinner while checking authentication
  // if (isLoading) {
  //   return (
  //     <div className="min-h-screen flex items-center justify-center">
  //       <LoadingSpinner size="lg" />
  //     </div>
  //   );
  // }

  return (
    <Router>
      <div className="min-h-screen w-full flex flex-col">
        <Navbar />
        <main className="grow">
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Home />} />
            <Route path="/sign-in" element={<SignInPage />} />
            <Route path="/sign-up" element={<SignUpPage />} />

            {/* Course and Lesson Routes (Public view, but some features require auth) */}
            <Route path="/catalog" element={<CourseCatalog />} />
            <Route path="/course/:courseId" element={<CourseDetail />} />
            <Route path="/lesson/:lessonId" element={<LessonView />} />

            {/* Protected Student Routes */}
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute requireAuth requireRole="student">
                  <StudentDashboard />
                </ProtectedRoute>
              }
            />

            {/* Protected Admin Routes */}
            <Route
              path="/admin"
              element={
                <ProtectedRoute requireAuth requireRole="admin">
                  <AdminDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/courses"
              element={
                <ProtectedRoute requireAuth requireRole="admin">
                  <AdminCourses />
                </ProtectedRoute>
              }
            />

            {/* Fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
