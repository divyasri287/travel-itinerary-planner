import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import Loader from "../common/Loader.jsx";

/**
 * Wraps private routes. Redirects unauthenticated users to /login.
 * Shows a loader while the auth state is being restored from localStorage.
 */
const ProtectedRoute = () => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return <Loader label="Checking your session..." />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
