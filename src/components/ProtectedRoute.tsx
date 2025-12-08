import { Navigate, useLocation } from "react-router-dom";
import { useStore } from "../store/useStore";
import LoadingSpinner from "./LoadingSpinner";

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAuth?: boolean;
  requireRole?: "admin" | "student";
}

export default function ProtectedRoute({
  children,
  requireAuth = true,
  requireRole,
}: ProtectedRouteProps) {
  const { currentUser, isLoading } = useStore();
  const location = useLocation();

  // Show loading while checking authentication
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <LoadingSpinner />
      </div>
    );
  }

  // If authentication is required but user is not logged in
  if (requireAuth && !currentUser) {
    // Store the attempted URL to redirect back after login
    const redirectPath = `/sign-in?redirect=${encodeURIComponent(
      location.pathname + location.search
    )}`;
    return <Navigate to={redirectPath} replace />;
  }

  // Check role if required
  if (requireRole && currentUser?.role !== requireRole) {
    // Redirect based on user role
    if (currentUser?.role === "admin") {
      return <Navigate to="/admin" replace />;
    } else {
      return <Navigate to="/dashboard" replace />;
    }
  }

  // If everything checks out, render the children
  return <>{children}</>;
}
