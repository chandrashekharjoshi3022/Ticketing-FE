import { FormattedMessage } from 'react-intl';
import { DocumentText } from 'iconsax-react';
const icons = {
  tickitingRaiseicon: DocumentText
};

// const tickitingRaiseMenu = {
//   id: 'Raise Ticket',
//   title: <FormattedMessage id=" Raise Ticket" />,
//   type: 'group',
//   url: '/raise-ticket',
//   icon: icons.tickitingRaiseicon
// };

const tickitingRaiseMenu = {
  id: 'group-pages',
  //title: <FormattedMessage id="pages" />,
  type: 'group',
  children: [
    {
      id: ' Ticket',
      title: <FormattedMessage id="Ticket" />,
      type: 'collapse',
      icon: icons.tickitingRaiseicon,
      children: [
        {
          id: 'Raise Ticket',
          title: <FormattedMessage id="Raise Ticket" />,
          type: 'item',
          url: '/ticket/raise-ticket',
          target: false
        },
        // {
        //   id: 'Reply Ticket',
        //   title: <FormattedMessage id="Reply Ticket" />,
        //   type: 'item',
        //   url: '/ticket/reply-ticket',
        //   target: false
        // }
      ]
    }
  ]
};

export default tickitingRaiseMenu;
