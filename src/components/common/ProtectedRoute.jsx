
//client/src/components/ProtectedRoutes.jsx
import { Navigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";



const ProtectedRoute = ({ children, allowedRoles = [] }) => {
  const { token, role } = useAuth();

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles.length && !allowedRoles.includes(role)) {
    return <Navigate to="/" replace />;
  }

  return children;
};


export default ProtectedRoute;