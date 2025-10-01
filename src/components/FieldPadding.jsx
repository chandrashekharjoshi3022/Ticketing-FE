import React from 'react';
import TextField from '@mui/material/TextField';
import { styled } from '@mui/material/styles';

const CustomTextField = styled(TextField)({
  '& .MuiInputBase-input': {
    padding: '8px',
    fontSize: '11px'
  },
  '& .MuiInputBase-input.Mui-disabled': {
    WebkitTextFillColor: '#000000'
  },
  // Disable the up/down arrows for number input
  '& input[type="number"]::-webkit-outer-spin-button, & input[type="number"]::-webkit-inner-spin-button': {
    '-webkit-appearance': 'none',
    margin: 0
  },
  '& input[type="number"]': {
    '-moz-appearance': 'textfield' // For Firefox
  }
});

// eslint-disable-next-line no-unused-vars
const FieldPadding = ({ max, ...props }) => {
  return <CustomTextField {...props} max={max} />;
};

export default FieldPadding;
