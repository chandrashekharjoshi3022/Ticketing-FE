import * as React from 'react';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import SettingsIcon from '@mui/icons-material/Settings';
import { useNavigate } from 'react-router-dom';
import MainCard from 'components/MainCard';
import { useTheme } from '@mui/material/styles';
import getColors from '../utils/getColors';
import StoreIcon from '@mui/icons-material/Store';

const MasterTab = () => {
  const navigate = useNavigate();
  const theme = useTheme(); // Get the theme
  const colors = getColors(theme);

  const boxesUppper = [
    {
      icon: <StoreIcon sx={{ color: colors.success, fontSize: 40 }} />,
      label: 'Catrgory',
      path: '/category'
    },
    {
      icon: <StoreIcon sx={{ color: colors.success, fontSize: 40 }} />,
      label: 'Sub Category',
      path: '/subcategory'
    },
    {
      icon: <StoreIcon sx={{ color: colors.success, fontSize: 40 }} />,
      label: 'Issue Type',
      path: '/issuetype'
    },
    {
      icon: <StoreIcon sx={{ color: colors.success, fontSize: 40 }} />,
      label: 'Priority',
      path: '/priority'
    },
     {
      icon: <StoreIcon sx={{ color: colors.success, fontSize: 40 }} />,
      label: 'SLA Master',
      path: '/slamaster'
    },
    {
      icon: <AccountCircleIcon sx={{ color: colors.primary, fontSize: 40 }} />,
      label: 'User',
      path: '/master/users'
    },
        {
      icon: <AccountCircleIcon sx={{ color: colors.primary, fontSize: 40 }} />,
      label: 'WorkingHoursManagement',
      path: '/master/WorkingHoursManagement'
    },
            {
      icon: <AccountCircleIcon sx={{ color: colors.primary, fontSize: 40 }} />,
      label: 'SystemRegistration',
      path: '/master/SystemRegistration'
    }
  ];

  // boxesUppper.sort((a, b) => a.label.localeCompare(b.label));
  const handleViewClick = (path) => {
    navigate(path);
  };

  return (
    <MainCard
      title={
        <Box fontWeight={'600'} fontSize={'16px'}>
          Manage Master
        </Box>
      }
    >
      <Grid container spacing={3}>
        {boxesUppper.map((box, index) => (
          <Grid item xs={12} sm={6} md={4} lg={2} key={index}>
            <Box
              height={100}
              display="flex"
              flexDirection="column"
              alignItems="center"
              justifyContent="center"
              borderRadius="5px"
              fontWeight={600}
              sx={{ border: '1px solid', borderColor: '#A1BCDB', cursor: 'pointer' }}
              onClick={() => handleViewClick(box.path)}
            >
              <Box sx={{ marginBottom: 1 }}>{box.icon}</Box>
              {box.label}
            </Box>
          </Grid>
        ))}
      </Grid>
    </MainCard>
  );
};

export default MasterTab;
