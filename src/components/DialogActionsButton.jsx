import { Button, styled } from '@mui/material';

const NoButton = styled(Button)(({ theme }) => ({
  padding: '4px',
  color: theme.palette.common.white, // Set text color to white
  backgroundColor: theme.palette.error.dark,
  '&:hover': {
    backgroundColor: theme.palette.error.dark
  },
  '& span': {
    display: 'inline-block',
    border: '1px solid #f8d2d2',
    borderRadius: '5px',
    padding: '0px 16px',
    boxSizing: 'border-box'
  }
}));

const YesButton = styled(Button)(({ theme }) => ({
  padding: '4px',
  color: theme.palette.common.white, // Set text color to white
  backgroundColor: theme.palette.primary.dark,
  '&:hover': {
    backgroundColor: theme.palette.primary.dark
  },
  '& span': {
    display: 'inline-block',
    border: '1px solid #b5c1dd',
    borderRadius: '5px',
    padding: '0px 16px',
    boxSizing: 'border-box'
  }
}));

export { NoButton, YesButton };
