import { FormattedMessage } from 'react-intl';
import { DocumentText } from 'iconsax-react';
const icons = {
  tickitingRaiseicon: DocumentText
};

const tickitingRaiseMenu = {
  id: 'Raise Ticket',
  title: <FormattedMessage id=" Raise Ticket" />,
  type: 'group',
  url: '/raise-ticket',
  icon: icons.tickitingRaiseicon
};

export default tickitingRaiseMenu;
