// src/components/AuthInitializer.jsx
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getMe, selectIsInitialized, selectAuthLoading, selectUser } from '../features/auth/authSlice';
import { Navigate } from 'react-router-dom';

export default function AuthInitializer({ children }) {
  const dispatch = useDispatch();
  const isInitialized = useSelector(selectIsInitialized);
  const isLoading = useSelector(selectAuthLoading);
  const user = useSelector(selectUser);

  useEffect(() => {
    if (!isInitialized && !isLoading) {
      dispatch(getMe());
    }
  }, [dispatch, isInitialized, isLoading]);

  // 1. Loading state
  if (isLoading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        flexDirection: 'column',
        gap: '16px'
      }}>
        <div>Loading...</div>
        <div>Checking authentication status...</div>
      </div>
    );
  }

  // 2. Not authenticated (initialized but no user)
  if (isInitialized && !user) {
    return <Navigate to="/login" replace />;
  }

  // 3. Authenticated
  return children;
}
