import React from 'react';
import { Button } from '@mui/material';
import { styled } from '@mui/material/styles';

const CustomButton = styled(Button)(({ theme }) => ({
  backgroundColor: '#2c6095',
  color: theme.palette.common.white,
  '&:hover': {
    backgroundColor: '#244b78'
  },
  fontSize: '0.7rem',
  padding: '4px 7px',
  textTransform: 'none'
}));

const PlusButton = ({ label, onClick }) => {
  return (
    <CustomButton variant="contained" onClick={onClick}>
      {label}
    </CustomButton>
  );
};

export default PlusButton;
