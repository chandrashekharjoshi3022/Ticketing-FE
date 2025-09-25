import React from 'react';
import { styled } from '@mui/material/styles';
import Typography from '@mui/material/Typography';

const CustomParagraphLighta = styled(Typography)({
  fontSize: '13px',
  color: '#555'
});

const CustomParagraphLight = ({ children, ...props }) => {
  return (
    <div>
      <CustomParagraphLighta variant="body1" {...props}>
        {children}
      </CustomParagraphLighta>
    </div>
  );
};

export default CustomParagraphLight;
