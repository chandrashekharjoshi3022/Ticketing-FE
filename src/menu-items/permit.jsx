// third-party
import { FormattedMessage } from 'react-intl';

// assets
import { MessageProgramming } from 'iconsax-react';

// type

// icons
// icons
const icons = {
  maintenance: MessageProgramming
};

// ==============================|| MENU ITEMS - PAGES ||============================== //

const permit = {
  id: 'group-pages',
  //title: <FormattedMessage id="pages" />,
  type: 'group',
  children: [
    {
      id: 'maintenance',
      title: <FormattedMessage id="Permit" />,
      type: 'collapse',
      icon: icons.maintenance,
      children: [
        {
          id: 'navDac',
          title: <FormattedMessage id="Nafdac Certificate" />,
          type: 'item',
          url: '/permit/navdac',
          target: false
        },
        // {
        //   id: 'son',
        //   title: <FormattedMessage id="SON Certificate" />,
        //   type: 'item',
        //   url: '/permit/son',
        //   target: false
        // },
        {
          id: 'pending',
          title: <FormattedMessage id="Pending Items" />,
          type: 'item',
          url: '/permit/pending',
          target: false
        }
        // {
        //   id: 'Items',
        //   title: <FormattedMessage id="Items" />,
        //   type: 'item',
        //   url: '/permit/items',
        //   target: false
        // }
      ]
    }
  ]
};

export default permit;
