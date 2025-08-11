import { Navigate } from "react-router-dom";

export default function PrivateRoute({ children, roles = [] }) {
  const token = localStorage.getItem("auth_token");
  const userRole = localStorage.getItem("role");

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  if (roles.length > 0 && !roles.includes(userRole)) {
    return <Navigate to="/" replace />;
  }

  return children;
}
