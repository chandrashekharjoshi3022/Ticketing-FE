// src/utils/route-guard/AuthGuard.jsx
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';
import Loader from 'components/Loader';

/**
 * Synchronous guard that reads auth state from Redux.
 * Waits for isInitialized, then redirects if not logged in or role mismatch.
 */
export default function AuthGuard({ children, role }) {
  const { user, isInitialized } = useSelector((s) => s.auth);

  // Wait for the initial /me completion
  if (!isInitialized) return <Loader />;

  // Not authenticated -> redirect to login
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Role check (optional)
  if (role && user.role_name !== role) {
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
}

AuthGuard.propTypes = {
  children: PropTypes.node,
  role: PropTypes.string,
};
