import React from 'react';
import { styled } from '@mui/material/styles';
import Typography from '@mui/material/Typography';

const CustomParagrapha = styled(Typography)({
  fontSize: '14px',
  color: '#333',
  fontWeight: '600'
});

const CustomParagraphDark = ({ children, ...props }) => {
  return (
    <div>
      <CustomParagrapha variant="body1" {...props}>
        {children}
      </CustomParagrapha>
    </div>
  );
};

export default CustomParagraphDark;
