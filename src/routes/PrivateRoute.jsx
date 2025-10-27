// routes/PrivateRoute.jsx
import { useSelector } from 'react-redux';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import Loader from 'components/Loader';

export default function PrivateRoute({ requiredRoles }) {
  const { user, isInitialized, isLoading } = useSelector((state) => state.auth);
  const location = useLocation();

  // Show loader while checking authentication
  if (!isInitialized || isLoading) {
    return <Loader />;
  }

  // Redirect to login if not authenticated
  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Check role-based access if specific roles are required
  if (requiredRoles && !requiredRoles.includes(user.role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return <Outlet />;
}