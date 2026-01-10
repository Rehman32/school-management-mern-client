// ============================================
// PROTECTED ROUTE - SINGLE-TENANT EDITION
// Only allows admin and teacher roles
// ============================================

import { Navigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const ProtectedRoute = ({ children }) => {
  const { token, role, loading } = useAuth();

  // Show nothing while checking auth status
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // Only allow admin and teacher roles
  if (role !== 'admin' && role !== 'teacher') {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;