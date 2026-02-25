import { Navigate, useLocation } from "react-router-dom";
import { useUser } from "../Context/UserContext";

const ProtectedRoute = ({ children, role }) => {
  const { user, loading } = useUser();
  const location = useLocation();

  if (loading) return null;

  if (!user) {
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  if (
    role &&
    user.role?.toLowerCase() !== role.toLowerCase()
  ) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;
