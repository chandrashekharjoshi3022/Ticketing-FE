import React from 'react';
import { Button } from '@mui/material';
import { styled } from '@mui/material/styles';

const CustomSubmitBtn = styled(Button)(({ theme }) => ({
  backgroundColor: '#2c6095',
  color: theme.palette.common.white,
  '&:hover': {
    backgroundColor: '#244b78'
  },
  '&:focus': {
    outline: 'none'
  },
  fontSize: '13px',
  padding: '2px 7px !important',
  textTransform: 'none'
}));

const SubmitButton = ({ onClick, ...props }) => {
  return (
    <CustomSubmitBtn type={props.type} variant="contained" onClick={onClick} {...props}>
      {props.children}
    </CustomSubmitBtn>
  );
};

export default SubmitButton;
