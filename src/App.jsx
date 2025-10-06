// App.js
import { RouterProvider } from 'react-router-dom';

// project import
import router from 'routes';
import ThemeCustomization from 'themes';
import Locales from 'components/Locales';
import ScrollTop from 'components/ScrollTop';
import Snackbar from 'components/@extended/Snackbar';

import { ToastContainer, toast } from 'react-toastify';
// auth-provider
import { JWTProvider as AuthProvider } from 'contexts/JWTContext';
import 'scss/style.css';
// RFQCONTEXT

// ==============================|| APP - THEME, ROUTER, LOCAL  ||============================== //

export default function App() {
  return (
    <ThemeCustomization>
      <Locales>
        <ScrollTop>
          <AuthProvider>
            <RouterProvider router={router} fallbackElement={<div>Loading router...</div>} />
            <ToastContainer />
          </AuthProvider>
        </ScrollTop>
      </Locales>
    </ThemeCustomization>
  );
}
