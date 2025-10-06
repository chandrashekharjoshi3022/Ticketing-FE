import { FormattedMessage } from 'react-intl';
import { DocumentText } from 'iconsax-react';
const icons = {
  opr1: DocumentText
};

const MasterTabMenu = {
  id: 'OPR',
  title: <FormattedMessage id="Manage Master" />,
  type: 'group',
  url: '/mastertab',
  icon: icons.opr1
};

export default MasterTabMenu;
