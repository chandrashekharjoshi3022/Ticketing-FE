import { FormattedMessage } from 'react-intl';
import { DocumentText } from 'iconsax-react';
import { I24Support, MessageProgramming } from 'iconsax-react';
import RequestQuoteIcon from '@mui/icons-material/RequestQuote';

const icons = {
  quotationPage: DocumentText,
  userPage: DocumentText,
  maintenance: MessageProgramming,
  contactus: I24Support,
  quotation: RequestQuoteIcon
};

// ==============================|| MENU ITEMS - PAGES ||============================== //

const rfq_page = {
  id: 'group-pages',
  //title: <FormattedMessage id="pages" />,
  type: 'group',
  children: [
    {
      id: 'rfq',
      title: <FormattedMessage id="RFQ" />,
      type: 'collapse',
      icon: icons.quotation,
      children: [
        {
          id: 'itemlist',
          title: <FormattedMessage id="Generate RFQ" />,
          type: 'item',
          url: '/rfq/genraterfq',
          target: false
        },
        {
          id: 'rfq_list',
          title: <FormattedMessage id="RFQ List" />,
          type: 'item',
          url: '/rfq/rfqlist',
          target: false
        }
        // {
        //   id: 'Quotation',
        //   title: <FormattedMessage id="Quotation" />,
        //   type: 'item',
        //   url: '/rfq/quotation',
        //   target: false
        // },
        // {
        //   id: 'Purchage',
        //   title: <FormattedMessage id="Purchage Order" />,
        //   type: 'item',
        //   url: '/rfq/polist',
        //   target: false
        // }
      ]
    }
  ]
};

export default rfq_page;
