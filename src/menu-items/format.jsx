import { FormattedMessage } from 'react-intl';
import { DocumentText } from 'iconsax-react';
const icons = {
  formatePage: DocumentText
};

const formatePage = {
  id: 'Form Formate',
  title: <FormattedMessage id="Form Formate" />,
  type: 'group',
  url: '/formate',
  icon: icons.formatePage
};

export default formatePage;
