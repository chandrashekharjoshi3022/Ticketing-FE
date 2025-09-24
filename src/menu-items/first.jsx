import { FormattedMessage } from 'react-intl';
import { DocumentText } from 'iconsax-react';
const icons = {
  opr1: DocumentText
};

const First = {
  id: 'OPR',
  title: <FormattedMessage id="First" />,
  type: 'group',
  url: '/first',
  icon: icons.opr1
};

export default First;