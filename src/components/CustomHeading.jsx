import React from 'react';
import { styled } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
const CustomHeadingw = styled(Typography)({
  fontSize: '13px',
  color: 'navy',
  fontWeight: '600'
});

const CustomHeading = ({ children, ...props }) => {
  return (
    <div>
      <CustomHeadingw variant="body1"{...props}>{children}
      </CustomHeadingw>
    </div>
  );
};

export default CustomHeading;
