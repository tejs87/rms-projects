// src/components/ProtectedRoute.jsx
import { Navigate, Outlet } from "react-router-dom";
import { getCurrentUser } from "../utils/auth";

export default function ProtectedRoute({ allowedRoles = [] }) {
  const user = getCurrentUser();

  // not logged in
  if (!user) {
    return <Navigate to="/" replace />;
  }

  // if allowedRoles provided, check membership
  if (Array.isArray(allowedRoles) && allowedRoles.length > 0) {
    if (!allowedRoles.includes(user.role)) {
      // redirect to dashboard if unauthorized
      return <Navigate to="/dashboard" replace />;
    }
  }

  // allowed
  return <Outlet />;
}
