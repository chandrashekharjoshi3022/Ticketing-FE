// index.jsx
import React, { useEffect } from 'react';
import { createRoot } from 'react-dom/client';

// styles (keep your existing imports)
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
import { Provider, useDispatch, useSelector } from 'react-redux';
import { store } from './app/store';
import { ConfigProvider } from 'contexts/ConfigContext';
import Loader from 'components/Loader';
import reportWebVitals from './reportWebVitals';

// auth
import { getMe } from './features/auth/authSlice';

function InitApp({ children }) {
  const dispatch = useDispatch();
  const { isInitialized, user } = useSelector((state) => state.auth);

  useEffect(() => {
    console.log('[InitApp] dispatching getMe()');
    dispatch(getMe());
  }, [dispatch]);

  // DEBUG: show transitions in console (remove after testing)
  console.log('[InitApp] render -> isInitialized:', isInitialized, 'user:', user);

  if (!isInitialized) return <Loader />;

  return children;
}

const container = document.getElementById('root');
const root = createRoot(container);

root.render(
  <ConfigProvider>
    <Provider store={store}>
      <InitApp>
        <App />
      </InitApp>
    </Provider>
  </ConfigProvider>
);

reportWebVitals();
