import { FormattedMessage } from 'react-intl';
import AssignmentIcon from '@mui/icons-material/Assignment';

const icons = {
  AssignmentIcon: AssignmentIcon
};

// ==============================|| MENU ITEMS - PAGES ||============================== //

const masterForm = {
  id: 'group-pages',
  type: 'group',
  children: [
    {
      id: 'masterform',
      title: <FormattedMessage id="MasterForm" />,
      type: 'collapse',
      icon: icons.AssignmentIcon,
      children: [
        {
          id: 'category',
          title: <FormattedMessage id="Category" />,
          type: 'item',
          url: '/category',
          target: false
        },
        {
          id: 'subcategory',
          title: <FormattedMessage id="Sub Category" />,
          type: 'item',
          url: '/subcategory',
          target: false
        },
        {
          id: 'issuetype',
          title: <FormattedMessage id="issue type" />,
          type: 'item',
          url: '/issuetype',
          target: false
        },
        {
          id: 'priority',
          title: <FormattedMessage id="Priority" />,
          type: 'item',
          url: '/priority',
          target: false
        },
        {
          id: 'slamaster',
          title: <FormattedMessage id="SLA Master" />,
          type: 'item',
          url: '/slamaster',
          target: false
        }
      ]
    }
  ]
};

export default masterForm;
