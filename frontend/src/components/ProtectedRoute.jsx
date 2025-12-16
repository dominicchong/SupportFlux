import { Navigate } from "react-router-dom";
import { rolePermissions } from "../constants/roles.js"

const ProtectedRoute = ({ authUser, requiredPermission, children }) => {
  if (!authUser) return <Navigate to="/login" replace />;

  const userRole = authUser.role;
  const allowedPermissions = rolePermissions[userRole] || [];

  if (!allowedPermissions.includes(requiredPermission)) {
    return <Navigate to="/not-authorized" replace />;
  }

  return children;
};

export default ProtectedRoute;
