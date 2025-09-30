import React from 'react';
import { Button } from '@mui/material';
import { styled } from '@mui/material/styles';

const CustomCancelButton = styled(Button)(({ theme }) => ({
  backgroundColor: '#cd640d',
  color: theme.palette.common.white,
  '&:hover': {
    backgroundColor: '#cd640d'
  },
  '&:focus': {
    outline: 'none'
  },
  fontSize: '13px',
  padding: '2px 7px !important',
  textTransform: 'none'
}));

const CancelButton = ({ onClick, ...props }) => {
  return (
    <CustomCancelButton variant="contained" onClick={onClick} {...props}>
      {props.children}
    </CustomCancelButton>
  );
};

export default CancelButton;
