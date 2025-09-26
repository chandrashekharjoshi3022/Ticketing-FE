import React, { useEffect } from 'react';
import { Box, Typography, Grid, Chip, Card, CardContent } from '@mui/material';
import MainCard from 'components/MainCard';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import PersonIcon from '@mui/icons-material/Person';
import { useSelector, useDispatch } from 'react-redux';
import { fetchTickets } from '../../features/tickets/ticketSlice';
import ConfirmationNumberIcon from '@mui/icons-material/ConfirmationNumber';
import LockOpenIcon from '@mui/icons-material/LockOpen';
import ScheduleIcon from '@mui/icons-material/Schedule';
import LockIcon from '@mui/icons-material/Lock';

export default function SamplePage() {
  const dispatch = useDispatch();

  const { tickets, loading, error } = useSelector((state) => state.tickets);
  const currentUser = useSelector((state) => state.auth.user); // ✅ from authSlice
  const userRole = currentUser?.role || 'user';
  const isAdmin = userRole === 'admin';

  useEffect(() => {
    dispatch(fetchTickets());
  }, [dispatch]);

  const totalTickets = tickets?.length || 0;
  const openTickets = tickets?.filter((t) => t.status === 'open').length || 0;
  const pendingTickets = tickets?.filter((t) => t.status === 'Pending').length || 0;
  const closedTickets = tickets?.filter((t) => t.status === 'closed').length || 0;

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" mt={5}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box display="flex" justifyContent="center" mt={5}>
        <Typography color="error">{error}</Typography>
      </Box>
    );
  }
  return (
    <MainCard
      title={
        <Box display="flex" alignItems="center" justifyContent="space-between">
          <Typography variant="h4" fontWeight={600}>
            {isAdmin ? 'Admin Dashboard' : 'User Dashboard'}
          </Typography>

          {/* ✅ User info with role */}
          <Box display="flex" alignItems="center" gap={1} sx={{ ml: 2 }}>
            <Typography variant="body2" color="textSecondary">
              Welcome, {currentUser?.username || 'Guest'}
            </Typography>
            <Chip
              icon={isAdmin ? <AdminPanelSettingsIcon /> : <PersonIcon />}
              label={isAdmin ? 'Admin' : 'User'}
              color={isAdmin ? 'primary' : 'default'}
              size="small"
              variant="outlined"
            />
          </Box>
        </Box>
      }
    >
      <Box p={1}>
        {/* Counts Section */}
        <Grid container spacing={2} mb={3}>
          <Grid item xs={12} sm={3}>
            <Card>
              <CardContent
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  textAlign: 'center'
                }}
              >
                <Box>
                  <ConfirmationNumberIcon color="primary" fontSize="large" />
                </Box>
                <Typography variant="h6">Total Tickets</Typography>
                <Typography variant="h4" color="primary" fontWeight="bold">
                  {totalTickets}
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={3}>
            <Card>
              <CardContent
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  textAlign: 'center'
                }}
              >
                <Box>
                  <LockOpenIcon color="success" fontSize="large" />
                </Box>
                <Typography variant="h6">Open Tickets</Typography>
                <Typography variant="h4" color="success.main" fontWeight="bold">
                  {openTickets}
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={3}>
            <Card>
              <CardContent
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  textAlign: 'center'
                }}
              >
                <Box>
                  <ScheduleIcon color="warning" fontSize="large" />
                </Box>
                <Typography variant="h6">Pending Tickets</Typography>
                <Typography variant="h4" color="warning.main" fontWeight="bold">
                  {pendingTickets}
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={3}>
            <Card>
              <CardContent
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  textAlign: 'center'
                }}
              >
                <Box>
                  <LockIcon color="error" fontSize="large" />
                </Box>
                <Typography variant="h6">Closed Tickets</Typography>
                <Typography variant="h4" color="error.main" fontWeight="bold">
                  {closedTickets}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* <Typography variant="h5" gutterBottom>
          {userRole === 'admin' ? 'All Tickets' : 'My Tickets'}
        </Typography> */}

        {/* <Grid container spacing={2}>
          {tickets && tickets.length > 0 ? (
            tickets.map((ticket, index) => (
              <Grid item xs={12} sm={6} md={4} key={ticket.id || index}>
                <Card>
                  <CardContent>
                    <Typography variant="h6">{ticket.title || `Ticket ${index + 1}`}</Typography>
                    <Typography variant="body2" color="textSecondary">
                      {ticket.description || 'No description provided'}
                    </Typography>
                    <Typography variant="body2" mt={1}>
                      Status: {ticket.status || 'unknown'}
                    </Typography>

                    {userRole === 'admin' && (
                      <Typography variant="caption" color="textSecondary">
                        Created By: {ticket.createdBy || 'N/A'}
                      </Typography>
                    )}
                  </CardContent>
                </Card>
              </Grid>
            ))
          ) : (
            <Grid item xs={12}>
              <Typography>No tickets found</Typography>
            </Grid>
          )}
        </Grid> */}
      </Box>
    </MainCard>
  );
}
