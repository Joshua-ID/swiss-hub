import React from "react";
import { Link, useLocation } from "react-router-dom";
import { BookOpen, Layout, GraduationCap } from "lucide-react";
import { useStore } from "../store/useStore";

const Navbar: React.FC = () => {
  const location = useLocation();
  const { currentUser, setCurrentUser } = useStore();

  const isAdmin = currentUser?.role === "admin";
  const isActive = (path: string) => location.pathname === path;

  const switchRole = () => {
    const newRole = isAdmin ? "student" : "admin";
    const user = useStore.getState().users.find((u) => u.role === newRole);
    if (user) setCurrentUser(user);
  };

  return (
    <nav className="bg-white shadow-md sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <GraduationCap className="w-8 h-8 text-blue-600" />
            <span className="text-xl font-bold text-gray-900">Swiss-Hub</span>
          </Link>

          {/* Navigation Links */}
          <div className="flex items-center gap-6">
            {isAdmin ? (
              <>
                <Link
                  to="/admin"
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors ${
                    isActive("/admin")
                      ? "bg-blue-50 text-blue-600"
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  <Layout className="w-5 h-5" />
                  <span className="font-medium">Dashboard</span>
                </Link>
                <Link
                  to="/admin/courses"
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors ${
                    isActive("/admin/courses")
                      ? "bg-blue-50 text-blue-600"
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  <BookOpen className="w-5 h-5" />
                  <span className="font-medium">Courses</span>
                </Link>
              </>
            ) : (
              <>
                <Link
                  to="/dashboard"
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors ${
                    isActive("/dashboard")
                      ? "bg-blue-50 text-blue-600"
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  <Layout className="w-5 h-5" />
                  <span className="font-medium">My Learning</span>
                </Link>
                <Link
                  to="/catalog"
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors ${
                    isActive("/catalog")
                      ? "bg-blue-50 text-blue-600"
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  <BookOpen className="w-5 h-5" />
                  <span className="font-medium">Browse Courses</span>
                </Link>
              </>
            )}

            {/* User Info & Role Switcher */}
            <div className="flex items-center gap-3 pl-6 border-l border-gray-200">
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900">
                  {currentUser?.name}
                </p>
                <p className="text-xs text-gray-500 capitalize">
                  {currentUser?.role}
                </p>
              </div>
              <button
                onClick={switchRole}
                className="bg-blue-600 hover:bg-blue-700 text-white text-xs px-3 py-1 rounded-full transition-colors"
              >
                Switch to {isAdmin ? "Student" : "Admin"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
