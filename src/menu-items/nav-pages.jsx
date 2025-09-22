import { FormattedMessage } from 'react-intl';
import { DocumentText, DocumentDownload } from 'iconsax-react';

const icons = {
  quotationPage: DocumentText,
  rfqsPage: DocumentDownload
};

// ==============================|| MENU ITEMS - SAMPLE PAGE ||============================== //
const quotation = {
  // id: 'Quotation Page',
  // title: <FormattedMessage id="Quotation Page" />,
  // type: 'group',
  // url: '/quotation-page',
  // icon: icons.quotationPage

  id: 'group-pages',
  //title: <FormattedMessage id="pages" />,
  type: 'group',
  children: [
    {
      id: 'maintenance',
      title: <FormattedMessage id="Quotation" />,
      type: 'collapse',
      icon: icons.maintenance,
      children: [
        {
          id: 'ItemCreate',
          title: <FormattedMessage id="Entry " />,
          type: 'item',
          url: '/quotation/create',
          target: false
        },
        {
          id: 'ItemView',
          title: <FormattedMessage id="View " />,
          type: 'item',
          url: '/quotation/view',
          target: false
        }
        // {
        //   id: 'Items',
        //   title: <FormattedMessage id="Items" />,
        //   type: 'item',
        //   url: '/masters/items',
        //   target: false
        // }
      ]
    }
  ]
};

// export const rfqs = {
//   id: 'rfqs',
//   title: <FormattedMessage id="RFQ" />,
//   type: 'group',
//   url: '/rfq',
//   icon: icons.rfqsPage
// };

export default quotation;
