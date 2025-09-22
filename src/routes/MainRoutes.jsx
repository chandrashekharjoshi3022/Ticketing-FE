import { lazy } from 'react';

// project-imports
import Loadable from 'components/Loadable';
import DashboardLayout from 'layout/Dashboard';
import SimpleLayout from 'layout/Simple';
import { SimpleLayoutType } from 'config';

import VendorsPages from 'pages/master/vender';
import UsersPages from 'pages/master/users';
import ItemsPages from 'pages/master/items';
import NafdacCertificate from 'pages/permit/nafdacCertificate';
import SonCertificate from 'pages/permit/sonCertificate';
import Pending from 'pages/permit/pending';

//RFQ DROP DWON LIST ITEM PAGE
import GenrateRfqPage from 'pages/rfq/GenrateRfqPage';
import RfqListPage from 'pages/rfq/RfqListPage';
import NewQuotationPage from 'pages/rfq/QuotationPage';
import PurchaseOrderPage from 'pages/rfq/PurchaseOrderPage';

import CreateQuotation from 'pages/quotation/create';
import ViewQuotation from 'pages/quotation/quatation-page';

const MaintenanceError = Loadable(lazy(() => import('pages/maintenance/error/404')));
const AppContactUS = Loadable(lazy(() => import('pages/contact-us')));
// render - sample page
const SamplePage = Loadable(lazy(() => import('pages/extra-pages/dashboard')));
const QuotationPage = Loadable(lazy(() => import('pages/quotation/quatation-page')));
const FormateForm = Loadable(lazy(() => import('pages/formate/format')));
const OPR = Loadable(lazy(() => import('pages/opr1/oprMain')));

const MainRoutes = {
  path: '/',
  children: [
    {
      path: '/',
      element: <DashboardLayout />,
      children: [
        {
          path: 'dashboard',
          element: <SamplePage />
        }
      ]
    },
    {
      path: '/',
      element: <DashboardLayout />,
      children: [
        {
          path: 'opr',
          element: <OPR />
        }
      ]
    },
    // Rfq Select Menu
    {
      path: '/',
      element: <DashboardLayout />,
      children: [
        {
          path: 'rfq/genraterfq',
          element: <GenrateRfqPage />
        },
        {
          path: 'rfq/rfqlist',
          element: <RfqListPage />
        },
        {
          path: 'rfq/quotation',
          element: <NewQuotationPage />
        },
        {
          path: 'rfq/polist',
          element: <PurchaseOrderPage />
        }
      ]
    },
    {
      path: '/',
      element: <DashboardLayout />,
      children: [
        {
          path: 'quotation/create',
          element: <CreateQuotation />
        },
        {
          path: 'quotation/view',
          element: <ViewQuotation />
        }
        // {
        //   path: 'masters/items',
        //   element: <ItemsPages />
        // }
      ]
    },
    {
      path: '/',
      element: <DashboardLayout />,
      children: [
        {
          path: 'quotation-page',
          element: <QuotationPage />
        }
      ]
    },
    // permit
    {
      path: '/',
      element: <DashboardLayout />,
      children: [
        {
          path: 'permit/navdac',
          element: <NafdacCertificate />
        },
        {
          path: 'permit/son',
          element: <SonCertificate />
        },
        {
          path: 'permit/pending',
          element: <Pending />
        }
      ]
    },
    // MASTER Data second Version
    {
      path: '/',
      element: <DashboardLayout />,
      children: [
        {
          path: 'master/vendor',
          element: <VendorsPages />
        },
        {
          path: 'master/users',
          element: <UsersPages />
        },
        {
          path: 'master/items',
          element: <ItemsPages />
        }
      ]
    },
    {
      path: '/',
      element: <DashboardLayout />,
      children: [
        {
          path: 'formate',
          element: <FormateForm />
        }
      ]
    },

    {
      path: '/',
      element: <SimpleLayout layout={SimpleLayoutType.SIMPLE} />,
      children: [
        {
          path: 'contact-us',
          element: <AppContactUS />
        }
      ]
    },
    // {
    //   path: '/maintenance',
    //   element: <PagesLayout />,
    //   children: [
    //     {
    //       path: '404',
    //       element: <MaintenanceError />
    //     },
    //     {
    //       path: '500',
    //       element: <MaintenanceError500 />
    //     },
    //     {
    //       path: 'under-construction',
    //       element: <MaintenanceUnderConstruction />
    //     },
    //     {
    //       path: 'coming-soon',
    //       element: <MaintenanceComingSoon />
    //     }
    //   ]
    // },
    // {
    //   path: 'charts',
    //   children: [
    //     {
    //       path: 'apexchart',
    //       element: <ChartApexchart />
    //     },
    //     {
    //       path: 'org-chart',
    //       element: <ChartOrganization />
    //     }
    //   ]
    // },

    {
      path: '*',
      element: <MaintenanceError />
    }
  ]
};

export default MainRoutes;
