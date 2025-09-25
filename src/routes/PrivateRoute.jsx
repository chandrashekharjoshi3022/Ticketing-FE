// routes/PrivateRoute.jsx
import { useSelector } from 'react-redux';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import Loader from 'components/Loader';

export default function PrivateRoute({ role }) {
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

  // Check role-based access if specific role is required
  if (role && user.role !== role) {
    return <Navigate to="/unauthorized" replace />;
  }

  return <Outlet />;
}