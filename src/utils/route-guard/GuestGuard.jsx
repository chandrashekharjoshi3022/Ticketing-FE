import { useSelector } from 'react-redux';
import { Navigate, Outlet } from 'react-router-dom';
import Loader from 'components/Loader';

export default function GuestGuard() {
  const { user, isInitialized } = useSelector(s => s.auth);
  if (!isInitialized) return <Loader />;
  if (user) return <Navigate to="/dashboard" replace />;
  return <Outlet />;
}

