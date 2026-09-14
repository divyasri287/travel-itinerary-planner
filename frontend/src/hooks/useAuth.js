import { useContext } from "react";
import { AuthContext } from "../context/AuthContext.jsx";

/**
 * Convenience hook to access authentication state and actions
 * (user, token, isAuthenticated, login, register, logout).
 */
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
