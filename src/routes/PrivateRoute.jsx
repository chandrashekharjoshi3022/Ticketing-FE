import { useSelector } from 'react-redux';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import Loader from 'components/Loader';

export default function PrivateRoute({ role }) {
  const { user, isInitialized } = useSelector(s => s.auth);
  const location = useLocation();

  if (!isInitialized) return <Loader />; // wait for getMe()
  if (!user) return <Navigate to="/login" state={{ from: location }} replace />;
  if (role && user.role_name !== role) return <Navigate to="/unauthorized" replace />;

  return <Outlet />;
}
