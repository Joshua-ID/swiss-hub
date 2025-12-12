import { Link, useLocation } from "react-router-dom";
import { BookMarked, BookOpen, Layout, LibraryBig } from "lucide-react";
import { useUser, SignInButton, UserButton } from "@clerk/clerk-react";
import { useStore } from "../store/useStore";
import { useEffect } from "react";

export const Navbar = () => {
  const location = useLocation();
  const { user, isLoaded } = useUser();
  const { currentUser, initializeUser, logoutUser } = useStore();

  // Initialize user in Supabase when Clerk user loads
  useEffect(() => {
    if (isLoaded && user && !currentUser) {
      const email = user.primaryEmailAddress?.emailAddress || "";
      const name = user.fullName || user.firstName || "User";

      // Pass clerkId (camelCase) to match database
      initializeUser(user.id, email, name);
    }
  }, [isLoaded, user, currentUser, initializeUser]);

  // Detect when user signs out and clear storage
  useEffect(() => {
    if (isLoaded && !user && currentUser) {
      // User was logged in but now is logged out
      logoutUser();
      localStorage.clear();
      sessionStorage.clear();
    }
  }, [isLoaded, user, currentUser, logoutUser]);

  const isAdmin = currentUser?.role === "admin";
  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="bg-white w-[calc(100vw-1rem)] py-2 sm:py-4 shadow-md sticky top-0 z-40 px-3 md:px-5 flex justify-between items-center gap-2 md:p-2">
      {/* Logo */}
      <Link to="/" className="flex items-center gap-2 flex-wrap">
        <img src="/logo.png" alt="Swiss-Hub" className="w-10 h-10" />
        <span
          className="text-2xl text-[#243E36FF] font-extrabold whitespace-nowrap hidden sm:flex"
          style={{ fontFamily: "var(--font-design)" }}
        >
          Swiss-Hub
        </span>
      </Link>

      <div className="flex items-center gap-3">
        {/* Navigation Links - Only show when user is authenticated */}
        {user && currentUser && (
          <>
            {/* Admin Links */}
            {isAdmin && (
              <div>
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
              </div>
            )}

            {/* Student Links */}
            {!isAdmin && (
              <div className="flex flex-col items-end sm:flex-row">
                <Link
                  to="/dashboard"
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors ${
                    isActive("/dashboard")
                      ? "bg-[#243E36FF]/25 text-[#243E36FF]"
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  <BookMarked className="w-5 h-5" />
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
                  <LibraryBig className="w-5 h-5" />
                  <span className="font-medium">Browse Courses</span>
                </Link>
              </div>
            )}
          </>
        )}

        {/* User Authentication */}
        <div className="flex items-center gap-3 pl-2 md:pl-3 border-l border-gray-200">
          {!isLoaded ? (
            <div className="h-8 w-8 rounded-full bg-gray-200 animate-pulse" />
          ) : user ? (
            <>
              <div className="text-right hidden md:block">
                <p className="text-sm font-medium text-gray-900">
                  {currentUser?.name || user.fullName || "User"}
                </p>
                <p className="text-xs text-gray-500">
                  {isAdmin ? "Admin" : "Student"}
                </p>
              </div>
              <UserButton
                afterSignOutUrl="/"
                appearance={{
                  elements: {
                    avatarBox: "w-10 h-10",
                    userButtonPopoverCard: "shadow-lg",
                  },
                }}
              />
            </>
          ) : (
            <div className="flex items-center gap-2">
              <SignInButton mode="modal">
                <button className="text-[#243E36FF] hover:text-[#243E36FF]/80 text-sm font-medium transition-colors">
                  Sign In
                </button>
              </SignInButton>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};
