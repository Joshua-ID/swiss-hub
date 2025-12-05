import { Link, useLocation } from "react-router-dom";
import { BookOpen, Layout } from "lucide-react";
import { useStore } from "../store/useStore";

export const Navbar = () => {
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
    <nav className="bg-white shadow-md sticky top-0 z-40 px-3 md:px-5">
      <div className="flex justify-between items-center h-16">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 flex-wrap">
          <img src="/logo.png" alt="Swiss-Hub" className="w-10 h-10" />
          <span
            className="text-2xl  text-[#243E36FF] font-extrabold white-space-nowrap"
            style={{ fontFamily: "var(--font-design)" }}
          >
            Swiss-Hub
          </span>
        </Link>

        <div className="flex items-center gap-6">
          {/* admin  */}
          {isAdmin && (
            <>
              <Link
                to="/admin"
                className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors ${
                  isActive("/admin")
                    ? "bg-[#243E36FF]/25 text-[#243E36FF]"
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
                    ? "bg-[#243E36FF]/25 text-[#243E36FF]"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                <BookOpen className="w-5 h-5" />
                <span className="font-medium">Courses</span>
              </Link>
            </>
          )}
          {/* student */}
          {!isAdmin && (
            <>
              <Link
                to="/dashboard"
                className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors ${
                  isActive("/dashboard")
                    ? "bg-[#243E36FF]/25 text-[#243E36FF]"
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
                    ? "bg-[#243E36FF]/25 text-[#243E36FF]"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                <BookOpen className="w-5 h-5" />
                <span className="font-medium">Browse Courses</span>
              </Link>
            </>
          )}

          {/* Navigation Links */}
          <div className="flex items-center gap-6">
            {/* User Info & Role Switcher */}
            <div className="flex items-center gap-3 pl-6 border-l border-gray-200">
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900">
                  {currentUser?.name}
                </p>
              </div>
              {currentUser ? (
                <button
                  onClick={switchRole}
                  className="bg-[#243E36FF] hover:bg-[#243E36FF]/85 text-white text-xs p-3 rounded-full transition-colors"
                >
                  Logout
                </button>
              ) : (
                <button>Sign Up</button>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};
