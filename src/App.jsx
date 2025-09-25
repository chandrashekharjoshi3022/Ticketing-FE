// App.js
import { RouterProvider } from 'react-router-dom';

// project import
import router from 'routes';
import ThemeCustomization from 'themes';
import Locales from 'components/Locales';
import ScrollTop from 'components/ScrollTop';
import Snackbar from 'components/@extended/Snackbar';

// auth-provider
import { JWTProvider as AuthProvider } from 'contexts/JWTContext';
import 'scss/style.css';
// RFQCONTEXT
import { MyContextProvider } from 'contexts/RfqItemContex';

// ==============================|| APP - THEME, ROUTER, LOCAL  ||============================== //

export default function App() {
  return (
    <ThemeCustomization>
      <Locales>
        <ScrollTop>
          <AuthProvider>
            <MyContextProvider>
              <RouterProvider
                router={router}
                fallbackElement={<div>Loading router...</div>}
              />
              <Snackbar />
            </MyContextProvider>
          </AuthProvider>
        </ScrollTop>
      </Locales>
    </ThemeCustomization>
  );
}