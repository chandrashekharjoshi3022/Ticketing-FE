import { lazy } from 'react';

// project-imports
import Loadable from 'components/Loadable';
import DashboardLayout from 'layout/Dashboard';
import SimpleLayout from 'layout/Simple';
import { SimpleLayoutType } from 'config';
import PrivateRoute from './PrivateRoute'; // ✅ NEW

// pages
import VendorsPages from 'pages/master/vender';
import UsersPages from 'pages/master/users';
import ItemsPages from 'pages/master/items';
import TicketRaise from 'pages/tikitingtool/TicketRaise';
import First from 'pages/test/First';
import TicketReply from 'pages/tikitingtool/TicketReply';

const MaintenanceError = Loadable(lazy(() => import('pages/maintenance/error/404')));
const AppContactUS = Loadable(lazy(() => import('pages/contact-us')));
const SamplePage = Loadable(lazy(() => import('pages/extra-pages/dashboard')));
const OPR = Loadable(lazy(() => import('pages/opr1/oprMain')));

const MainRoutes = {
  path: '/',
  children: [
    // ✅ Protected Routes (only for logged-in users)
    {
      element: <PrivateRoute />, // protect all below
      children: [
        {
          path: '/',
          element: <DashboardLayout />,
          children: [{ path: 'dashboard', element: <SamplePage /> }]
        },
        {
          path: '/',
          element: <DashboardLayout />,
          children: [
            {
              path: 'ticket/raise-ticket',
              element: <TicketRaise />
            },
            {
              path: 'ticket/reply-ticket',
              element: <TicketReply />
            }
          ]
        },
        {
          path: '/',
          element: <DashboardLayout />,
          children: [{ path: 'opr', element: <OPR /> }]
        },
        {
          path: '/',
          element: <DashboardLayout />,
          children: [{ path: 'first', element: <First /> }]
        },
        {
          path: '/',
          element: <DashboardLayout />,
          children: [{ path: 'raise-ticket', element: <TicketRaise /> }]
        },
        {
          path: '/',
          element: <DashboardLayout />,
          children: [
            { path: 'master/vendor', element: <VendorsPages /> },
            { path: 'master/users', element: <UsersPages /> },
            { path: 'master/items', element: <ItemsPages /> }
          ]
        }
      ]
    },

    {
      path: '/',
      element: <SimpleLayout layout={SimpleLayoutType.SIMPLE} />,
      children: [{ path: 'contact-us', element: <AppContactUS /> }]
    },

    // ✅ Catch-all
    { path: '*', element: <MaintenanceError /> }
  ]
};

export default MainRoutes;
