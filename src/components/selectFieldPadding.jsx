import React from 'react';
import Select from '@mui/material/Select';
import { styled } from '@mui/material/styles';

const CustomSelect = styled(Select)({
  '& .MuiSelect-select': {
    padding: '2px',
    fontSize: '11px' // Set font size for the selected value
  },
  '& .MuiMenuItem-root': {
    fontSize: '11px' // Set font size for dropdown options
  }
});

const SelectFieldPadding = (props) => {
  return <CustomSelect {...props} />;
};

export default SelectFieldPadding;
