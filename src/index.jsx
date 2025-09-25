// index.jsx
import React, { useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import { Provider, useDispatch, useSelector } from 'react-redux';

// styles
import 'assets/fonts/inter/inter.css';
import 'simplebar/dist/simplebar.css';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/700.css';
import '@fontsource/inter/400.css';
import '@fontsource/inter/500.css';
import '@fontsource/inter/600.css';
import '@fontsource/inter/700.css';
import '@fontsource/poppins/400.css';
import '@fontsource/poppins/500.css';
import '@fontsource/poppins/600.css';
import '@fontsource/poppins/700.css';
import '@fontsource/public-sans/400.css';
import '@fontsource/public-sans/500.css';
import '@fontsource/public-sans/600.css';
import '@fontsource/public-sans/700.css';

// project imports
import App from './App';
import { store } from './app/store';
import { ConfigProvider } from 'contexts/ConfigContext';
import Loader from 'components/Loader';
import reportWebVitals from './reportWebVitals';
import { getMe } from './features/auth/authSlice';

function AuthWrapper({ children }) {
  const dispatch = useDispatch();
  const { isInitialized, isLoading } = useSelector((state) => state.auth);

  useEffect(() => {
    // Only call getMe if we haven't initialized yet and not currently loading
    if (!isInitialized && !isLoading) {
      console.log('[AuthWrapper] Initializing authentication...');
      dispatch(getMe());
    }
  }, [dispatch, isInitialized, isLoading]);

  // Show loader while checking authentication
  if (!isInitialized || isLoading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        flexDirection: 'column',
        gap: '16px'
      }}>
        <Loader />
        <div>Checking authentication...</div>
      </div>
    );
  }

  return children;
}

const container = document.getElementById('root');
const root = createRoot(container);

root.render(
  <ConfigProvider>
    <Provider store={store}>
      <AuthWrapper>
        <App />
      </AuthWrapper>
    </Provider>
  </ConfigProvider>
);

reportWebVitals();