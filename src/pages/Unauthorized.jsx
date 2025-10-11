// pages/Unauthorized.jsx
import { Link } from 'react-router-dom';
import { Box, Typography, Button } from '@mui/material';

const Unauthorized = () => {
  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      minHeight="60vh"
      textAlign="center"
    >
      <Typography variant="h1" color="error" gutterBottom>
        403
      </Typography>
      <Typography variant="h4" gutterBottom>
        Access Denied
      </Typography>
      <Typography variant="body1" color="textSecondary" paragraph>
        You don't have permission to access this page.
      </Typography>
      <Button component={Link} to="/dashboard" variant="contained">
        Back to Dashboard
      </Button>
    </Box>
  );
};

export default Unauthorized;