import { FormattedMessage } from 'react-intl';
import { DocumentText } from 'iconsax-react';
const icons = {
  opr1: DocumentText
};

const opr1 = {
  id: 'OPR',
  title: <FormattedMessage id="OPR" />,
  type: 'group',
  url: '/opr',
  icon: icons.opr1
};

export default opr1;
