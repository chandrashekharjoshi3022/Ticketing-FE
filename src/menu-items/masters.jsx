// third-party
import { FormattedMessage } from 'react-intl';

// assets
import { I24Support, MessageProgramming } from 'iconsax-react';

// type

// icons
// icons
const icons = {
  maintenance: MessageProgramming,
  contactus: I24Support
};

// ==============================|| MENU ITEMS - PAGES ||============================== //

const masters = {
  id: 'group-pages',
  //title: <FormattedMessage id="pages" />,
  type: 'group',
  children: [
    {
      id: 'maintenance',
      title: <FormattedMessage id="Master" />,
      type: 'collapse',
      icon: icons.maintenance,
      children: [
        {
          id: 'Vendor',
          title: <FormattedMessage id="Vendor" />,
          type: 'item',
          url: '/master/vendor',
          target: false
        },
        {
          id: 'Users',
          title: <FormattedMessage id="Users" />,
          type: 'item',
          url: '/master/users',
          target: false
        },
        {
          id: 'Items',
          title: <FormattedMessage id="Items" />,
          type: 'item',
          url: '/master/items',
          target: false
        }
      ]
    }
  ]
};

export default masters;
