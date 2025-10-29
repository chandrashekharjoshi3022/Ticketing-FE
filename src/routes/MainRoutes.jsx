import { lazy } from 'react';
import Loadable from 'components/Loadable';
import DashboardLayout from 'layout/Dashboard';
import SimpleLayout from 'layout/Simple';
import { SimpleLayoutType } from 'config';
import PrivateRoute from './PrivateRoute';

// pages
import VendorsPages from 'pages/master/vender';
import UsersPages from 'pages/master/users';
import ItemsPages from 'pages/master/items';
import TicketRaise from 'pages/tikitingtool/TicketRaise';
import First from 'pages/test/First';
import TicketReply from 'pages/tikitingtool/TicketReply';
import MasterTab from 'pages/masterTab';
import IssueTypeMaster from 'pages/master/IssueTypeMaster';
import CateroryMaster from 'pages/master/CateroryMaster';
import SubCategoryMaster from 'pages/master/SubCategoryMaster';
import PriorityMaster from 'pages/master/PriorityMaster';
import SLAMaster from 'pages/master/SLAMaster';
import WorkingHoursManagement from 'pages/master/WorkingHoursManagement';
import SystemRegistration from 'pages/master/SystemRegistration';

import EscalationReport from 'pages/master/EscalationReport';

const MaintenanceError = Loadable(lazy(() => import('pages/maintenance/error/404')));
const AppContactUS = Loadable(lazy(() => import('pages/contact-us')));
const Unauthorized = Loadable(lazy(() => import('pages/Unauthorized'))); // Add this
const SamplePage = Loadable(lazy(() => import('pages/extra-pages/dashboard')));

const MainRoutes = {
  path: '/',
  children: [
    // ✅ Public Routes
    {
      path: '/',
      element: <SimpleLayout layout={SimpleLayoutType.SIMPLE} />,
      children: [
        { path: 'contact-us', element: <AppContactUS /> },
        { path: 'unauthorized', element: <Unauthorized /> } // Add unauthorized route
      ]
    },

    // ✅ Protected Routes (only for logged-in users)
    {
      element: <PrivateRoute />,
      children: [
        // Routes accessible to all authenticated users
        {
          path: '/',
          element: <DashboardLayout />,
          children: [
            { path: 'dashboard', element: <SamplePage /> },
            { path: 'ticket/raise-ticket', element: <TicketRaise /> },
            { path: 'ticket/reply-ticket', element: <TicketReply /> },
            { path: 'first', element: <First /> },
            { path: 'raise-ticket', element: <TicketRaise /> }
          ]
        },

        // ✅ Admin-only routes (block user and executive)
        {
          element: <PrivateRoute requiredRoles={['admin', 'managerr', 'superadmin']} />, // Adjust roles as needed
          children: [
            {
              path: '/',
              element: <DashboardLayout />,
              children: [
                { path: 'mastertab', element: <MasterTab /> },
                { path: 'master/vendor', element: <VendorsPages /> },
                { path: 'master/users', element: <UsersPages /> },
                { path: 'master/WorkingHoursManagement', element: <WorkingHoursManagement /> },
                { path: 'master/items', element: <ItemsPages /> },
                { path: '/category', element: <CateroryMaster /> },
                { path: '/subcategory', element: <SubCategoryMaster /> },
                { path: '/issuetype', element: <IssueTypeMaster /> },
                { path: '/priority', element: <PriorityMaster /> },
                { path: '/slamaster', element: <SLAMaster /> },
                { path: 'master/SystemRegistration', element: <SystemRegistration /> },
                { path: 'master/EscalationReport', element: <EscalationReport /> }
              ]
            }
          ]
        }
      ]
    },

    // ✅ Catch-all
    { path: '*', element: <MaintenanceError /> }
  ]
};

export default MainRoutes;
