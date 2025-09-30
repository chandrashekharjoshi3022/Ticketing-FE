// src/pages/tikitingtool/TicketRaise.jsx
import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Grid,
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  useTheme,
  Divider,
  Tabs,
  Tab,
  Paper,
  Button,
  TableRow,
  TableCell,
  TableHead,
  Table,
  Chip,
  Alert,
  CircularProgress,
  Tooltip
} from '@mui/material';
import MainCard from 'components/MainCard';
import { DataGrid } from '@mui/x-data-grid';
import { useNavigate } from 'react-router-dom';
import PlusButton from 'components/CustomButton';
import CustomParagraphLight from 'components/CustomParagraphLight';
import gridStyle from 'utils/gridStyle';
import VisibilityIcon from '@mui/icons-material/Visibility';
import CloseIcon from '@mui/icons-material/Close';
import CustomParagraphDark from 'components/CustomParagraphDark';
import CustomHeading from 'components/CustomHeading';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import KeyboardArrowUpOutlinedIcon from '@mui/icons-material/KeyboardArrowUpOutlined';
import KeyboardArrowDownOutlinedIcon from '@mui/icons-material/KeyboardArrowDownOutlined';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import PersonIcon from '@mui/icons-material/Person';
import ReplyIcon from '@mui/icons-material/Reply';
import PendingActionsIcon from '@mui/icons-material/PendingActions';
import { formatDate, formatDateTime, formatDateTimeSplit } from 'components/DateFormate';
import { useDispatch, useSelector } from 'react-redux';
import { fetchTickets, fetchTicketDetails, createTicket, replyToTicket, clearTicketDetails } from '../../features/tickets/ticketSlice';
import { selectUserRole, selectCurrentUser, selectIsInitialized } from '../../features/auth/authSlice';
import TicketForm from './TicketForm';

export default function TicketRaise() {
  const navigate = useNavigate();
  const theme = useTheme();
  const dispatch = useDispatch();

  // Redux state
  const {
    tickets,
    ticketDetails,
    isLoading: ticketsLoading,
    error: ticketsError
  } = useSelector(
    (s) =>
      s.tickets || {
        tickets: [],
        ticketDetails: null,
        isLoading: false,
        error: null
      }
  );

  const userRole = useSelector(selectUserRole);
  const currentUser = useSelector(selectCurrentUser);
  const isAuthInitialized = useSelector(selectIsInitialized);

  // UI state
  const [isLoading, setIsLoading] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [activeTab, setActiveTab] = useState('All');
  const [showTableBodies, setShowTableBodies] = useState({ ticketView: true });
  const [replyMessage, setReplyMessage] = useState('');
  const [isSubmittingReply, setIsSubmittingReply] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [showTicketForm, setShowTicketForm] = useState(false);

  // Check if user is admin
  const isAdmin = userRole === 'admin';
  const userId = currentUser?.id;

  // Check authentication status
  useEffect(() => {
    if (isAuthInitialized && !currentUser) {
      navigate('/login');
    }
  }, [isAuthInitialized, currentUser, navigate]);

  // Fetch tickets only when user is authenticated
  useEffect(() => {
    if (isAuthInitialized && currentUser) {
      console.log(`Fetching tickets for user: ${currentUser.username}, role: ${userRole}`);
      dispatch(fetchTickets());
    }
  }, [dispatch, isAuthInitialized, currentUser, userRole]);

  // Clear success message after 5 seconds
  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => {
        setSuccessMessage('');
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [successMessage]);

  // Show loading if auth is not initialized yet
  if (!isAuthInitialized) {
    return (
      <Box sx={{ height: '80vh', display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column', gap: 2 }}>
        <CircularProgress size={40} />
        <Typography>Loading user information...</Typography>
      </Box>
    );
  }

  // Don't render if not authenticated (will redirect in useEffect)
  if (!currentUser) {
    return null;
  }

  const toggleTableBody = (section) => {
    setShowTableBodies((prevState) => ({ ...prevState, [section]: !prevState[section] }));
  };

  // const handleView = async (row) => {
  //   // Check if user has permission to view this ticket
  //   if (!isAdmin && row.created_by !== userId) {
  //     window.alert('You do not have permission to view this ticket');
  //     return;
  //   }

  //   setSelectedTicket(row);
  //   setOpenModal(true);
  //   setIsLoading(true);
  //   try {
  //     await dispatch(fetchTicketDetails(row.id)).unwrap();
  //   } catch (err) {
  //     console.error('Failed to load details', err);
  //     window.alert('Failed to load ticket details');
  //   } finally {
  //     setIsLoading(false);
  //   }
  // };

  const handleView = async (row) => {
    // Debug: Log the values to see what's happening
    console.log('Permission check:', {
      isAdmin,
      rowUserId: row.user_id,
      currentUserId: userId,
      rowCreatedBy: row.created_by,
      row
    });

    // Check if user has permission to view this ticket
    // For admin: can view all tickets
    // For user: can only view their own tickets (compare by user_id)
    if (!isAdmin && row.user_id !== userId) {
      window.alert('You do not have permission to view this ticket');
      return;
    }

    setSelectedTicket(row);
    setOpenModal(true);
    setIsLoading(true);
    try {
      await dispatch(fetchTicketDetails(row.id)).unwrap();
    } catch (err) {
      console.error('Failed to load details', err);
      window.alert('Failed to load ticket details');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setSelectedTicket(null);
    setReplyMessage('');
    dispatch(clearTicketDetails());
    setSuccessMessage('');
  };

  const initialValues = {
    modules: '',
    submodule: '',
    category: '',
    files: [],
    comments: ''
  };

  const handleTabChange = (event, newValue) => setActiveTab(newValue);
  // const handleReplySubmit = async () => {
  //   if (!ticketDetails?.ticket_id) return;
  //   if (!replyMessage || replyMessage.trim() === '') {
  //     return window.alert('Please enter a message');
  //   }

  //   // Check if user has permission to reply to this ticket
  //   if (!isAdmin && ticketDetails.created_by !== userId) {
  //     window.alert('You do not have permission to reply to this ticket');
  //     return;
  //   }

  //   setIsSubmittingReply(true);
  //   try {
  //     await dispatch(
  //       replyToTicket({
  //         ticketId: ticketDetails.ticket_id,
  //         message: replyMessage
  //       })
  //     ).unwrap();

  //     await dispatch(fetchTicketDetails(ticketDetails.ticket_id)).unwrap();
  //     await dispatch(fetchTickets()).unwrap();

  //     setReplyMessage('');
  //     setSuccessMessage('Reply sent successfully!');
  //   } catch (err) {
  //     console.error('Reply failed', err);
  //     window.alert(err?.message || 'Failed to send reply');
  //   } finally {
  //     setIsSubmittingReply(false);
  //   }
  // };

  // Filter tickets based on active tab (backend already filters by user role)

  const handleReplySubmit = async () => {
    if (!ticketDetails?.ticket_id) return;
    if (!replyMessage || replyMessage.trim() === '') {
      return window.alert('Please enter a message');
    }

    // Check if user has permission to reply to this ticket
    if (!isAdmin && ticketDetails.user_id !== userId) {
      window.alert('You do not have permission to reply to this ticket');
      return;
    }

    setIsSubmittingReply(true);
    try {
      await dispatch(
        replyToTicket({
          ticketId: ticketDetails.ticket_id,
          message: replyMessage
        })
      ).unwrap();

      await dispatch(fetchTicketDetails(ticketDetails.ticket_id)).unwrap();
      await dispatch(fetchTickets()).unwrap();

      setReplyMessage('');
      setSuccessMessage('Reply sent successfully!');
    } catch (err) {
      console.error('Reply failed', err);
      window.alert(err?.message || 'Failed to send reply');
    } finally {
      setIsSubmittingReply(false);
    }
  };

  const getFilteredTickets = () => {
    if (!tickets) return [];

    let filtered = tickets;

    // Apply status filter
    if (activeTab !== 'All') {
      filtered = filtered.filter((ticket) => ticket.status === activeTab);
    }

    return filtered;
  };

  const filteredRows = getFilteredTickets();

  // Get status counts for tabs
  const getStatusCounts = () => {
    return {
      All: tickets.length,
      Open: tickets.filter((t) => t.status === 'Open').length,
      Pending: tickets.filter((t) => t.status === 'Pending').length,
      Closed: tickets.filter((t) => t.status === 'Closed').length
    };
  };

  const statusCounts = getStatusCounts();

  const getStatusChip = (status) => {
    const statusConfig = {
      Open: { color: 'success' },
      Pending: { color: 'warning' },
      Closed: { color: 'error' },
      Resolved: { color: 'info' }
    };

    const config = statusConfig[status] || statusConfig.Open;

    return (
      <Chip
        icon={config.icon}
        label={status}
        color={config.color}
        size="small"
        variant="outlined"
        sx={{ fontWeight: 'bold', minWidth: 80 }}
      />
    );
  };

  // const renderDateWithSLA = (params, type) => {
  //   const timeSeconds = type === 'response' ? params.row.response_time_seconds : params.row.resolve_time_seconds;
  //   const targetMinutes = type === 'response' ? params.row.sla?.response_target_minutes : params.row.sla?.resolve_target_minutes;
  //   const timestamp = type === 'response' ? params.row.response_at : params.row.resolved_at;
  //   console.log(`Type: ${type}`, { timeSeconds, targetMinutes, timestamp });
  //   if (!timeSeconds || !targetMinutes || !timestamp) {
  //     return (
  //       <Typography variant="body2" color="gray" fontWeight="bold">
  //         {timestamp ? formatDate(timestamp) : 'Not set'}
  //       </Typography>
  //     );
  //   }
  //   const timeMinutes = timeSeconds / 60;
  //   let color = 'gray';
  //   let status = 'Not Set';
  //   if (timeMinutes <= targetMinutes) {
  //     color = 'green';
  //     status = 'Within SLA';
  //   } else if (timeMinutes <= targetMinutes * 1.1) {
  //     color = 'orange';
  //     status = 'Slightly Exceeded';
  //   } else {
  //     color = 'red';
  //     status = 'Significantly Exceeded';
  //   }
  //   return (
  //     <Typography variant="body2" style={{ color }} fontWeight="bold">
  //       {`${formatDate(timestamp)} - ${status} (${timeMinutes.toFixed(1)} min / ${targetMinutes} min target)`}
  //     </Typography>
  //   );
  // };

  const renderDateWithSLA = (params, type) => {
    const timeSeconds = type === 'response' ? params.row.response_time_seconds : params.row.resolve_time_seconds;
    const targetMinutes = type === 'response' ? params.row.sla?.response_target_minutes : params.row.sla?.resolve_target_minutes;
    const timestamp = type === 'response' ? params.row.response_at : params.row.resolved_at;
    const timeMinutes = timeSeconds / 60;
    let color = 'gray';
    let status = '-';

    return (
      <Tooltip title={`SLA Time ${targetMinutes || 'N/A'} Min`} arrow>
        <Typography variant="body2" style={{ color }} fontWeight="bold">
          {console.log('timeSeconds || !targetMinutes', timeSeconds, targetMinutes)}

          {!timeSeconds || !targetMinutes
            ? (() => {
                const dt = formatDateTime(timestamp);
                return (
                  <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <span>{status}</span>
                  </div>
                );
              })()
            : (() => {
                const dt = formatDateTime(timestamp);
                return (
                  <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <span>{dt.date}</span>
                    <span>
                      {dt.time} ({timeMinutes.toFixed(1)} min)
                    </span>
                  </div>
                );
              })()}
        </Typography>
      </Tooltip>
    );
  };
  // Columns definition
  const columns = [
    {
      field: 'ticket_no',
      headerName: 'Ticket No.',
      width: 130,
      renderCell: (params) => (
        <Typography variant="body2" color="primary" fontWeight="bold">
          {params.value}
        </Typography>
      )
    },
    { field: 'module', headerName: 'Module', width: 120 },
    { field: 'submodule', headerName: 'Sub Module', width: 200 },
    { field: 'category', headerName: 'Category', width: 200 },
    {
      field: 'comments',
      headerName: 'Comments',
      width: 250,
      renderCell: (params) => (
        <div
          style={{
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden'
          }}
          dangerouslySetInnerHTML={{ __html: params.value }}
        />
      )
    },
    {
      field: 'created_on',
      headerName: 'Created On',
      width: 120,
      renderCell: (params) => {
        return formatDateTimeSplit(params?.value);
      }
    },

    {
      field: 'response_at',
      headerName: 'Response On',
      width: 200,
      renderCell: (params) => renderDateWithSLA(params, 'response')
    },
    {
      field: 'resolved_at',
      headerName: 'Resolved On',
      width: 200,
      renderCell: (params) => renderDateWithSLA(params, 'resolve')
    },
    // Show created by only for admin
    ...(isAdmin
      ? [
          // {
          //   field: 'created_by',
          //   headerName: 'Created By',
          //   width: 120,
          //   renderCell: (params) => (
          //     <Typography variant="body2" fontStyle="italic">
          //       {params.row.user?.username || params.value || 'Unknown'}
          //     </Typography>
          //   )
          // }

          {
            field: 'created_by',
            headerName: 'Created By',
            width: 120,
            renderCell: (params) => (
              <Typography variant="body2" fontStyle="italic">
                {params.value || 'Unknown'}
              </Typography>
            )
          }
        ]
      : []),
    {
      field: 'status',
      headerName: 'Status',
      width: 120,
      renderCell: (params) => getStatusChip(params.value)
    },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 100,
      renderCell: (params) => (
        <Box sx={{ display: 'flex', gap: 1 }}>
          <IconButton color="primary" onClick={() => handleView(params.row)} size="small" title="View Ticket">
            <VisibilityIcon />
          </IconButton>
          {params.row.status !== 'Closed' && (
            <IconButton color="secondary" onClick={() => handleView(params.row)} size="small" title="Reply to Ticket">
              <ReplyIcon />
            </IconButton>
          )}
        </Box>
      )
    }
  ];

  const commentColumn = [
    {
      field: 'id',
      headerName: 'Sr. No.',
      width: 70,
      renderCell: (params) => (
        <Typography variant="body2" fontWeight="bold">
          {params.value}
        </Typography>
      )
    },
    {
      field: 'comments',
      headerName: 'Comments',
      width: 300,
      flex: 1,
      renderCell: (params) => (
        <Box
          dangerouslySetInnerHTML={{ __html: params.value }}
          sx={{
            maxHeight: 60,
            overflow: 'hidden',
            '& p': { margin: 0 },
            '& ul, & ol': { margin: 0, paddingLeft: 2 }
          }}
        />
      )
    },
    { field: 'created_by', headerName: 'Created By', width: 120 },
    {
      field: 'created_on',
      headerName: 'Created On',
      width: 130,
      renderCell: (params) => {
        return formatDate(params?.value);
      }
    }
    // {
    //   field: 'status',
    //   headerName: 'Status',
    //   width: 100,
    //   renderCell: (params) => getStatusChip(params.value)
    // }
  ];

  const renderTableHeader = (sectionName, sectionLabel) => (
    <TableHead sx={{ backgroundColor: '#EAF1F6', borderBottom: '2px solid #ddd' }}>
      <TableRow>
        <TableCell sx={{ padding: 0, paddingLeft: '16px' }} colSpan={12}>
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Box display="flex" alignItems="center" gap={1}>
              <Typography fontSize={'16px'} fontWeight={600} color="primary">
                {sectionLabel}
              </Typography>
              <Chip
                icon={isAdmin ? <AdminPanelSettingsIcon /> : <PersonIcon />}
                label={isAdmin ? 'Admin View' : 'My Tickets'}
                color={isAdmin ? 'primary' : 'secondary'}
                size="small"
              />
              <Typography variant="caption" color="textSecondary">
                ({filteredRows.length} tickets)
              </Typography>
            </Box>
            <IconButton size="medium" onClick={() => toggleTableBody(sectionName)} sx={{ height: '36px', width: '36px' }}>
              {showTableBodies[sectionName] ? <KeyboardArrowUpOutlinedIcon /> : <KeyboardArrowDownOutlinedIcon />}
            </IconButton>
          </Box>
        </TableCell>
      </TableRow>
    </TableHead>
  );

  const dialogStyle = {
    '& .MuiDialog-paper': {
      borderRadius: theme.spacing(2),
      boxShadow: theme.shadows[10],
      minWidth: '800px'
    }
  };

  return (
    <Box>
      {isLoading || ticketsLoading ? (
        <Box sx={{ height: '80vh', display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column', gap: 2 }}>
          <CircularProgress size={40} />
          <Typography>Loading tickets...</Typography>
        </Box>
      ) : (
        <MainCard
          title={
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Box display="flex" alignItems="center" gap={1}>
                <Typography variant="h4" fontWeight={600}>
                  <PendingActionsIcon sx={{ mr: 1, verticalAlign: 'bottom' }} />
                  Ticket Management
                </Typography>
                <Box display="flex" alignItems="center" gap={1} sx={{ ml: 2 }}>
                  <Typography variant="body2" color="textSecondary">
                    Welcome, {currentUser?.username}
                  </Typography>
                  <Chip
                    icon={isAdmin ? <AdminPanelSettingsIcon /> : <PersonIcon />}
                    label={isAdmin ? 'admin' : 'User'}
                    color={isAdmin ? 'primary' : 'default'}
                    size="small"
                    variant="outlined"
                  />
                </Box>
              </Box>
              <Box>
                {showTicketForm ? (
                  <PlusButton label="Back" onClick={() => setShowTicketForm(false)} />
                ) : (
                  <PlusButton label="+Raise New Ticket" onClick={() => setShowTicketForm(true)} />
                )}
              </Box>
            </Box>
          }
        >
          <Box sx={{ height: '85dvh', overflowY: 'auto', overflowX: 'hidden' }}>
            {/* Success Message */}
            {successMessage && (
              <Alert severity="success" sx={{ mb: 2 }}>
                {successMessage}
              </Alert>
            )}

            {/* Error Message */}
            {ticketsError && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {ticketsError}
              </Alert>
            )}

            {/* Role Information */}

            {!showTicketForm ? (
              <Box>
                <Table sx={{ mb: 1 }}>{renderTableHeader('ticketView', 'Ticket Management')}</Table>

                {showTableBodies.ticketView && (
                  <Paper sx={{ mb: 2, boxShadow: 2 }}>
                    <Tabs
                      value={activeTab}
                      onChange={handleTabChange}
                      indicatorColor="primary"
                      textColor="primary"
                      sx={{
                        minHeight: '40px',
                        borderBottom: 1,
                        borderColor: 'divider',
                        '& .MuiTab-root': {
                          minHeight: '40px',
                          fontWeight: 600,
                          textTransform: 'none',
                          fontSize: '14px'
                        }
                      }}
                    >
                      <Tab label={`All (${statusCounts.All})`} value="All" />
                      <Tab label={`Open (${statusCounts.Open})`} value="Open" />
                      <Tab label={`Pending (${statusCounts.Pending})`} value="Pending" />
                      <Tab label={`Closed (${statusCounts.Closed})`} value="Closed" />
                    </Tabs>

                    <DataGrid
                      autoHeight
                      getRowHeight={() => 'auto'}
                      sx={{
                        ...gridStyle,
                        height: '85dvh'
                      }}
                      rows={filteredRows.map((row, index) => ({ ...row, sr_no: index + 1 }))}
                      columns={[
                        {
                          field: 'sr_no',
                          headerName: 'Sr. No.',
                          width: 70,
                          renderCell: (params) => (
                            <Typography variant="body2" fontWeight="bold">
                              {params.value}
                            </Typography>
                          )
                        },
                        ...columns.filter((col) => col.field !== 'id') // exclude old id column
                      ]}
                      loading={ticketsLoading}
                      pageSizeOptions={[10, 25, 50]}
                      initialState={{ pagination: { paginationModel: { pageSize: 10 } } }}
                    />
                  </Paper>
                )}
              </Box>
            ) : (
              <Box>
                <TicketForm onCancel={() => setShowTicketForm(false)} />
              </Box>
            )}
            {/* Ticket Details Modal */}
            <Dialog open={openModal} onClose={handleCloseModal} maxWidth="lg" fullWidth sx={dialogStyle}>
              <DialogTitle
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  backgroundColor: '#1976d2',
                  color: 'white',
                  padding: '12px 24px',
                  fontWeight: '600'
                }}
              >
                <Box>
                  Ticket Details -
                  <span style={{ marginLeft: 8, fontFamily: 'monospace' }}>{selectedTicket ? selectedTicket.ticket_no : ''}</span>
                  {ticketDetails && (
                    <Chip
                      label={ticketDetails.status}
                      color={ticketDetails.status === 'Open' ? 'success' : ticketDetails.status === 'Closed' ? 'error' : 'warning'}
                      size="small"
                      sx={{ ml: 2, color: 'white', fontWeight: 'bold' }}
                    />
                  )}
                  {isAdmin && ticketDetails && (
                    <Typography variant="caption" display="block" sx={{ color: 'white', opacity: 0.9, mt: 0.5 }}>
                      Created by: {ticketDetails.created_by || 'Unknown'}
                    </Typography>
                  )}
                </Box>
                <IconButton edge="end" color="inherit" onClick={handleCloseModal} sx={{ p: 0.5 }}>
                  <CloseIcon />
                </IconButton>
              </DialogTitle>

              <DialogContent dividers sx={{ p: 3 }}>
                {isLoading ? (
                  <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 200 }}>
                    <CircularProgress />
                  </Box>
                ) : ticketDetails ? (
                  <>
                    <Grid container spacing={2}>
                      <Grid item xs={12} md={2}>
                        <CustomParagraphDark>Module:</CustomParagraphDark>
                        <CustomParagraphLight>{ticketDetails.module}</CustomParagraphLight>
                      </Grid>
                      <Grid item xs={12} md={2}>
                        <CustomParagraphDark>Sub Module:</CustomParagraphDark>
                        <CustomParagraphLight>{ticketDetails.submodule}</CustomParagraphLight>
                      </Grid>
                      <Grid item xs={12} md={3}>
                        <CustomParagraphDark>Category:</CustomParagraphDark>
                        <CustomParagraphLight>{ticketDetails.category}</CustomParagraphLight>
                      </Grid>
                      <Grid item xs={12} md={3}>
                        <CustomParagraphDark>Created On:</CustomParagraphDark>
                        <CustomParagraphLight>{ticketDetails.created_on ? formatDate(ticketDetails.created_on) : '-'}</CustomParagraphLight>
                      </Grid>
                      {isAdmin && (
                        <Grid item xs={12} md={2}>
                          <CustomParagraphDark>Created By:</CustomParagraphDark>
                          <CustomParagraphLight>{ticketDetails.created_by || 'Unknown'}</CustomParagraphLight>
                        </Grid>
                      )}
                      <Grid item xs={12} display={'flex'} alignItems={'center'}>
                        <CustomParagraphDark> Comment: </CustomParagraphDark>
                        <Box sx={{ marginLeft: '10px' }} dangerouslySetInnerHTML={{ __html: ticketDetails.comment }} />
                      </Grid>

                      {ticketDetails.files && ticketDetails.files.length > 0 && (
                        <Grid item xs={12}>
                          <CustomParagraphDark>Attachments:</CustomParagraphDark>
                          <Grid container spacing={1} sx={{ mt: 1 }}>
                            {ticketDetails.files.map((imgUrl, index) => (
                              <Grid item xs={6} sm={4} md={3} key={index}>
                                <Box
                                  component="img"
                                  src={imgUrl}
                                  alt={`Attachment ${index + 1}`}
                                  sx={{
                                    width: '100%',
                                    height: 120,
                                    objectFit: 'cover',
                                    border: 1,
                                    borderColor: 'divider',
                                    borderRadius: 1,
                                    cursor: 'pointer',
                                    '&:hover': {
                                      opacity: 0.8
                                    }
                                  }}
                                  onClick={() => window.open(imgUrl, '_blank')}
                                />
                              </Grid>
                            ))}
                          </Grid>
                        </Grid>
                      )}
                    </Grid>

                    <Divider sx={{ my: 1 }} />

                    <CustomHeading>Conversation History</CustomHeading>

                    <DataGrid
                      autoHeight
                      getRowHeight={() => 'auto'}
                      sx={{
                        '& .MuiDataGrid-cell': {
                          border: '1px solid rgba(224, 224, 224, 1)',
                          display: 'flex',
                          alignItems: 'center'
                        },
                        '& .MuiDataGrid-columnHeader': {
                          backgroundColor: '#f5f5f5',
                          border: '1px solid rgba(224, 224, 224, 1)',
                          height: '40px'
                        },
                        mb: 3,
                        mt: 1
                      }}
                      rows={[
                        // Add initial comment as first row
                        {
                          id: 'initial',
                          comments: ticketDetails.comment || '',
                          created_by: ticketDetails.created_by || 'User',
                          created_on: ticketDetails.created_on || '',
                          status: ticketDetails.status || ''
                        },
                        // Then append all replies
                        ...(ticketDetails.replies || []).map((r) => {
                          // Determine the display name based on sender information
                          let displayName = 'User';

                          if (r.sender_type === 'system') {
                            displayName = 'System';
                          } else if (r.sender?.username) {
                            // Use the actual username from sender object
                            displayName = r.sender.username;
                          } else if (r.sender_type === 'admin') {
                            // Fallback for admin without sender object
                            displayName = 'Admin';
                          }
                          // For user type without sender object, it will default to 'User'

                          return {
                            id: r.reply_id ?? r.id ?? Math.random(),
                            comments: r.message ?? r.comment ?? '',
                            created_by: displayName,
                            created_on: r.created_at ?? r.created_on ?? r.createdAt ?? '',
                            status: r.status ?? ''
                          };
                        })
                      ].map((row, index) => ({
                        ...row,
                        sr_no: index + 1 // add serial number
                      }))}
                      columns={[
                        {
                          field: 'sr_no',
                          headerName: 'Sr. No.',
                          width: 70,
                          renderCell: (params) => (
                            <Typography variant="body2" fontWeight="bold">
                              {params.value}
                            </Typography>
                          )
                        },
                        ...commentColumn.filter((col) => col.field !== 'id') // exclude old id column
                      ]}
                      hideFooter
                      disableColumnMenu
                    />

                    {/* Show reply section only if user has permission and ticket is not closed */}
                    {(isAdmin || ticketDetails.user_id === userId) && ticketDetails.status !== 'Closed' && (
                      <>
                        <Box sx={{ my: 3, backgroundColor: '#f8f9fa', borderRadius: 1 }}>
                          <CustomHeading>Add Your Comment </CustomHeading>
                          <ReactQuill
                            value={replyMessage}
                            onChange={setReplyMessage}
                            modules={{
                              toolbar: [['bold', 'italic', 'underline'], [{ list: 'ordered' }, { list: 'bullet' }], ['link'], ['clean']]
                            }}
                            style={{ height: 150, marginBottom: 16, marginTop: 8 }}
                            placeholder="Type your reply here..."
                          />
                        </Box>
                        <Box sx={{ display: 'flex', justifyContent: 'flex-end', marginTop: 8, mb: 1, gap: 2 }}>
                          <Button variant="outlined" onClick={() => setReplyMessage('')} disabled={isSubmittingReply}>
                            Clear
                          </Button>
                          <Button
                            variant="contained"
                            onClick={handleReplySubmit}
                            // disabled={isSubmittingReply || !replyMessage.trim()}
                            startIcon={isSubmittingReply ? <CircularProgress size={16} /> : <ReplyIcon />}
                          >
                            {isSubmittingReply ? 'Sending...' : 'Send Reply'}
                          </Button>
                        </Box>
                      </>
                    )}
                  </>
                ) : (
                  <Box sx={{ textAlign: 'center', py: 4 }}>
                    <Typography color="textSecondary">No ticket data available</Typography>
                  </Box>
                )}
              </DialogContent>
            </Dialog>
          </Box>
        </MainCard>
      )}
    </Box>
  );
}
