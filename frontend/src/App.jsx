import { Navigate, Route, Routes } from "react-router-dom";
import { useAuth } from "./hooks/useAuth";

import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import MyTrips from "./pages/MyTrips.jsx";
import Profile from "./pages/Profile.jsx";

import MainLayout from "./layouts/MainLayout.jsx";
import ProtectedRoute from "./components/layout/ProtectedRoute.jsx";
import Loader from "./components/common/Loader.jsx";

function App() {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return <Loader label="Loading Travel Itinerary Planner..." />;
  }

  return (
    <Routes>
      {/* Public routes */}
      <Route
        path="/login"
        element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <Login />}
      />
      <Route
        path="/register"
        element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <Register />}
      />

      {/* Protected routes, wrapped in the main app shell (Navbar + content) */}
      <Route element={<ProtectedRoute />}>
        <Route element={<MainLayout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/trips" element={<MyTrips />} />
          <Route path="/profile" element={<Profile />} />
        </Route>
      </Route>

      {/* Default redirect */}
      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
}

export default App;
