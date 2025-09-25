// src/pages/tikitingtool/TicketRaise.jsx
import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Grid,
  MenuItem,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
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
  Card,
  CardContent
} from '@mui/material';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import MainCard from 'components/MainCard';
import { DataGrid } from '@mui/x-data-grid';
import { errorMessageStyle } from 'components/StyleComponent';
import SelectFieldPadding from 'components/selectFieldPadding';
import { useNavigate } from 'react-router-dom';
import PlusButton from 'components/CustomButton';
import { NoButton, YesButton } from 'components/DialogActionsButton';
import SubmitButton from 'components/CustomSubmitBtn';
import CustomRefreshBtn from 'components/CustomRefreshBtn';
import CustomParagraphLight from 'components/CustomParagraphLight';
import gridStyle from 'utils/gridStyle';
import VisibilityIcon from '@mui/icons-material/Visibility';
import CloseIcon from '@mui/icons-material/Close';
import CustomParagraphDark from 'components/CustomParagraphDark';
import CustomHeading from 'components/CustomHeading';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import KeyboardArrowUpOutlinedIcon from '@mui/icons-material/KeyboardArrowUpOutlined';
import KeyboardArrowDownOutlinedIcon from '@mui/icons-material/KeyboardArrowDownOutlined';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import PersonIcon from '@mui/icons-material/Person';
import ReplyIcon from '@mui/icons-material/Reply';
import PendingActionsIcon from '@mui/icons-material/PendingActions';

import { useDispatch, useSelector } from 'react-redux';
import { fetchTickets, fetchTicketDetails, createTicket, replyToTicket, clearTicketDetails } from '../../features/tickets/ticketSlice';
import { selectUserRole, selectCurrentUser, selectIsInitialized } from '../../features/auth/authSlice';

export default function TicketRaise() {
  const navigate = useNavigate();
  const theme = useTheme();
  const dispatch = useDispatch();

  // Redux state
  const { tickets, ticketDetails, isLoading: ticketsLoading, error: ticketsError } = useSelector((s) => s.tickets || { 
    tickets: [], 
    ticketDetails: null, 
    isLoading: false, 
    error: null 
  });
  
  const userRole = useSelector(selectUserRole);
  const currentUser = useSelector(selectCurrentUser);
  const isAuthInitialized = useSelector(selectIsInitialized);

  // UI state
  const [isLoading, setIsLoading] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [submitValues, setSubmitValues] = useState(null);
  const [activeTab, setActiveTab] = useState('All');
  const [showTableBodies, setShowTableBodies] = useState({ ticketView: true });
  const [replyMessage, setReplyMessage] = useState('');
  const [isSubmittingReply, setIsSubmittingReply] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  // Check if user is admin
  const isAdmin = userRole === 'admin' || userRole === 'administrator';
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

  const handleBackClick = () => navigate('/dashboard');

  const toggleTableBody = (section) => {
    setShowTableBodies((prevState) => ({ ...prevState, [section]: !prevState[section] }));
  };

  const handleView = async (row) => {
    // Check if user has permission to view this ticket
    if (!isAdmin && row.created_by !== userId) {
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

  const validationSchema = Yup.object({
    modules: Yup.string().required('Module is required'),
    category: Yup.string().required('Category is required'),
    submodule: Yup.string().required('Submodule is required'),
    comments: Yup.string().required('Comments are required'),
    files: Yup.array()
      .min(1, 'At least one file is required')
      .test('fileSize', 'File size too large (max 5MB each)', (value) => {
        if (!value) return true;
        return value.every((file) => file.size <= 5 * 1024 * 1024);
      })
  });

  const handleFileChange = (event, setFieldValue) => {
    const selectedFiles = Array.from(event.target.files);
    setFieldValue('files', selectedFiles);
  };

  const handleSubmitClick = (values, formikHelpers) => {
    setSubmitValues({ values, formikHelpers });
    setConfirmDialogOpen(true);
  };

  const handleConfirmSubmit = async () => {
    if (!submitValues) return;
    setIsLoading(true);
    try {
      const { values, formikHelpers } = submitValues;
      const { resetForm, setSubmitting } = formikHelpers;

      const formData = new FormData();
      formData.append('module', values.modules);
      formData.append('submodule', values.submodule);
      formData.append('category', values.category);
      formData.append('comment', values.comments);
      (values.files || []).forEach((file) => formData.append('files', file));

      await dispatch(createTicket(formData)).unwrap();
      await dispatch(fetchTickets()).unwrap();

      resetForm();
      setSubmitting(false);
      setConfirmDialogOpen(false);
      setSubmitValues(null);
      setSuccessMessage('Ticket raised successfully!');
    } catch (err) {
      console.error('Error submitting ticket:', err);
      window.alert(err?.message || 'Failed to raise ticket');
    } finally {
      setIsLoading(false);
    }
  };

  const handleTabChange = (event, newValue) => setActiveTab(newValue);

  const handleReplySubmit = async () => {
    if (!ticketDetails?.ticket_id) return;
    if (!replyMessage || replyMessage.trim() === '') {
      return window.alert('Please enter a message');
    }
    
    // Check if user has permission to reply to this ticket
    if (!isAdmin && ticketDetails.created_by !== userId) {
      window.alert('You do not have permission to reply to this ticket');
      return;
    }
    
    setIsSubmittingReply(true);
    try {
      await dispatch(replyToTicket({ 
        ticketId: ticketDetails.ticket_id, 
        message: replyMessage 
      })).unwrap();
      
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

  // Filter tickets based on active tab (backend already filters by user role)
  const getFilteredTickets = () => {
    if (!tickets) return [];
    
    let filtered = tickets;
    
    // Apply status filter
    if (activeTab !== 'All') {
      filtered = filtered.filter(ticket => ticket.status === activeTab);
    }
    
    return filtered;
  };

  const filteredRows = getFilteredTickets();

  // Get status counts for tabs
  const getStatusCounts = () => {
    return {
      All: tickets.length,
      Open: tickets.filter(t => t.status === 'Open').length,
      Pending: tickets.filter(t => t.status === 'Pending').length,
      Closed: tickets.filter(t => t.status === 'Closed').length,
    };
  };

  const statusCounts = getStatusCounts();

  const getStatusChip = (status) => {
    const statusConfig = {
      Open: { color: 'success', icon: <PendingActionsIcon sx={{ fontSize: 16 }} /> },
      Pending: { color: 'warning', icon: <PendingActionsIcon sx={{ fontSize: 16 }} /> },
      Closed: { color: 'error', icon: <CloseIcon sx={{ fontSize: 16 }} /> },
      Resolved: { color: 'info', icon: <ReplyIcon sx={{ fontSize: 16 }} /> }
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

  // Columns definition
  const columns = [
    {
      field: 'id',
      headerName: 'Sr. No.',
      width: 70,
      renderCell: (params) => (
        <Typography variant="body2" fontWeight="bold">
          {params.api.getRowIndexRelativeToVisibleRows(params.id) + 1}
        </Typography>
      )
    },
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
    { field: 'submodule', headerName: 'Sub Module', width: 180, flex: 1 },
    { field: 'category', headerName: 'Category', width: 200, flex: 1 },
    { 
      field: 'comments', 
      headerName: 'Comments', 
      width: 250, 
      flex: 1,
      renderCell: (params) => (
        <Typography variant="body2" sx={{ 
          display: '-webkit-box',
          WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden'
        }}>
          {params.value}
        </Typography>
      )
    },
    { field: 'created_on', headerName: 'Created On', width: 120 },
    // Show created by only for admin
    ...(isAdmin ? [{
      field: 'created_by', 
      headerName: 'Created By', 
      width: 120,
      renderCell: (params) => (
        <Typography variant="body2" fontStyle="italic">
          {params.row.user?.username || params.value || 'Unknown'}
        </Typography>
      )
    }] : []),
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
          <IconButton 
            color="primary" 
            onClick={() => handleView(params.row)}
            size="small"
            title="View Ticket"
          >
            <VisibilityIcon />
          </IconButton>
          {params.row.status !== 'Closed' && (
            <IconButton 
              color="secondary" 
              onClick={() => handleView(params.row)}
              size="small"
              title="Reply to Ticket"
            >
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
      headerName: 'Message', 
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
    { field: 'created_on', headerName: 'Created On', width: 130 },
    {
      field: 'status',
      headerName: 'Status',
      width: 100,
      renderCell: (params) => getStatusChip(params.value)
    }
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
            <IconButton 
              size="medium" 
              onClick={() => toggleTableBody(sectionName)} 
              sx={{ height: '36px', width: '36px' }}
            >
              {showTableBodies[sectionName] ? 
                <KeyboardArrowUpOutlinedIcon /> : 
                <KeyboardArrowDownOutlinedIcon />
              }
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
      {(isLoading || ticketsLoading) ? (
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
                    label={isAdmin ? 'Administrator' : 'User'} 
                    color={isAdmin ? 'primary' : 'default'} 
                    size="small" 
                    variant="outlined"
                  />
                </Box>
              </Box>
              <PlusButton label="Back to Dashboard" onClick={handleBackClick} />
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
            <Alert 
              severity="info" 
              sx={{ mb: 2 }}
              icon={isAdmin ? <AdminPanelSettingsIcon /> : <PersonIcon />}
            >
              {isAdmin 
                ? 'You are viewing all tickets as an administrator.' 
                : `You are viewing your tickets (${tickets.length} total).`
              }
            </Alert>

            {/* Ticket Statistics */}
            <Card sx={{ mb: 2, backgroundColor: '#f8f9fa' }}>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Ticket Statistics
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={6} sm={3}>
                    <Box textAlign="center">
                      <Typography variant="h4" color="primary" fontWeight="bold">
                        {statusCounts.All}
                      </Typography>
                      <Typography variant="body2" color="textSecondary">
                        Total Tickets
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={6} sm={3}>
                    <Box textAlign="center">
                      <Typography variant="h4" color="success.main" fontWeight="bold">
                        {statusCounts.Open}
                      </Typography>
                      <Typography variant="body2" color="textSecondary">
                        Open Tickets
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={6} sm={3}>
                    <Box textAlign="center">
                      <Typography variant="h4" color="warning.main" fontWeight="bold">
                        {statusCounts.Pending}
                      </Typography>
                      <Typography variant="body2" color="textSecondary">
                        Pending Tickets
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={6} sm={3}>
                    <Box textAlign="center">
                      <Typography variant="h4" color="error.main" fontWeight="bold">
                        {statusCounts.Closed}
                      </Typography>
                      <Typography variant="body2" color="textSecondary">
                        Closed Tickets
                      </Typography>
                    </Box>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>

            <Formik 
              initialValues={initialValues} 
              validationSchema={validationSchema} 
              onSubmit={handleSubmitClick} 
              enableReinitialize
            >
              {({ isSubmitting, resetForm, values, handleSubmit, setFieldValue }) => (
                <>
                  <Form>
                    <Box padding={2} sx={{ backgroundColor: '#f8f9fa', borderRadius: 1, mb: 2 }}>
                      <Typography variant="h6" gutterBottom color="primary">
                        Raise New Ticket
                      </Typography>
                      <Grid container spacing={2} alignItems="flex-start">
                        <Grid item xs={12} sm={6} md={3}>
                          <CustomParagraphLight>
                            Module <span style={{ color: 'red' }}>*</span>
                          </CustomParagraphLight>
                          <Field as={SelectFieldPadding} name="modules" variant="outlined" fullWidth size="small">
                            <MenuItem value=""><em>Select Module</em></MenuItem>
                            <MenuItem value="OPR">OPR</MenuItem>
                            <MenuItem value="RFQ">RFQ</MenuItem>
                            <MenuItem value="Quotation">Quotation</MenuItem>
                            <MenuItem value="Purchase Order">Purchase Order</MenuItem>
                            <MenuItem value="Shipment">Shipment</MenuItem>
                            <MenuItem value="PFI">PFI</MenuItem>
                          </Field>
                          <ErrorMessage name="modules" component="div" style={errorMessageStyle} />
                        </Grid>

                        <Grid item xs={12} sm={6} md={3}>
                          <CustomParagraphLight>
                            Sub Module <span style={{ color: 'red' }}>*</span>
                          </CustomParagraphLight>
                          <Field as={SelectFieldPadding} name="submodule" variant="outlined" fullWidth size="small">
                            <MenuItem value=""><em>Select Submodule</em></MenuItem>
                            <MenuItem value="Create RFQ">Create RFQ</MenuItem>
                            <MenuItem value="PO Acceptance">PO Acceptance</MenuItem>
                            <MenuItem value="Create Advice">Create Advice</MenuItem>
                            <MenuItem value="Approve OPR">Approve OPR</MenuItem>
                            <MenuItem value="Create Quotation">Create Quotation</MenuItem>
                            <MenuItem value="View PFI GBO">View PFI GBO</MenuItem>
                          </Field>
                          <ErrorMessage name="submodule" component="div" style={errorMessageStyle} />
                        </Grid>

                        <Grid item xs={12} sm={6} md={3}>
                          <CustomParagraphLight>
                            Category <span style={{ color: 'red' }}>*</span>
                          </CustomParagraphLight>
                          <Field as={SelectFieldPadding} name="category" variant="outlined" fullWidth size="small">
                            <MenuItem value=""><em>Select Category</em></MenuItem>
                            <MenuItem value="Wrong Data / Information">Wrong Data / Information</MenuItem>
                            <MenuItem value="Unable to Download">Unable to Download</MenuItem>
                            <MenuItem value="Unable to Add More">Unable to Add More</MenuItem>
                            <MenuItem value="Data Not Reflecting">Data Not Reflecting</MenuItem>
                            <MenuItem value="Unable To Upload">Unable To Upload</MenuItem>
                            <MenuItem value="Unable to Approve">Unable to Approve</MenuItem>
                            <MenuItem value="Unable to Input">Unable to Input</MenuItem>
                          </Field>
                          <ErrorMessage name="category" component="div" style={errorMessageStyle} />
                        </Grid>

                        <Grid item xs={12} sm={6} md={3}>
                          <Button
                            component="label"
                            variant="outlined"
                            startIcon={<CloudUploadIcon />}
                            fullWidth
                            size="small"
                            sx={{
                              mt: 2.5,
                              backgroundColor: values.files?.length > 0 ? '#e3f2fd' : 'transparent',
                              borderColor: values.files?.length > 0 ? '#2196f3' : '#ccc',
                              '&:hover': { borderColor: '#2196f3' }
                            }}
                          >
                            Upload Screenshots
                            <input 
                              type="file" 
                              hidden 
                              multiple 
                              accept=".pdf,.jpeg,.jpg,.png" 
                              onChange={(e) => handleFileChange(e, setFieldValue)} 
                            />
                          </Button>
                          {values.files?.length > 0 && (
                            <Box sx={{ mt: 1 }}>
                              <Typography variant="caption" color="textSecondary">
                                Selected files: {values.files.length}
                              </Typography>
                              {values.files.map((file, index) => (
                                <Typography key={index} variant="caption" sx={{ display: 'block', color: 'success.main' }}>
                                  • {file.name}
                                </Typography>
                              ))}
                            </Box>
                          )}
                        </Grid>

                        <Grid item xs={12}>
                          <CustomParagraphLight>
                            Comment <span style={{ color: 'red' }}>*</span>
                          </CustomParagraphLight>
                          <ReactQuill 
                            value={values.comments} 
                            onChange={(value) => setFieldValue('comments', value)} 
                            modules={{
                              toolbar: [
                                [{ font: [] }],
                                [{ header: [1, 2, false] }],
                                ['bold', 'italic', 'underline', 'strike'],
                                [{ list: 'ordered' }, { list: 'bullet' }],
                                [{ color: [] }, { background: [] }],
                                [{ align: [] }],
                                ['link'],
                                ['clean']
                              ]
                            }} 
                            formats={[
                              'font', 'header', 'bold', 'italic', 'underline', 'strike', 'list', 'bullet', 'color', 'background', 'align', 'link'
                            ]} 
                            style={{ height: '150px', marginBottom: '60px' }} 
                          />
                          <ErrorMessage name="comments" component="div" style={errorMessageStyle} />
                        </Grid>
                      </Grid>
                      <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1, mt: 2 }}>
                        <CustomRefreshBtn 
                          type="button" 
                          variant="outlined" 
                          onClick={() => resetForm()}
                          disabled={isSubmitting}
                        >
                          Reset
                        </CustomRefreshBtn>
                        <SubmitButton 
                          type="button" 
                          variant="contained" 
                          onClick={() => handleSubmit()} 
                          disabled={isSubmitting}
                        >
                          {isSubmitting ? 'Submitting...' : 'Submit Ticket'}
                        </SubmitButton>
                      </Box>
                    </Box>
                  </Form>

                  <Dialog open={confirmDialogOpen} onClose={() => setConfirmDialogOpen(false)}>
                    <DialogTitle>Confirm Raise Ticket</DialogTitle>
                    <DialogContent>
                      <DialogContentText>
                        Are you sure you want to raise this ticket? This action cannot be undone.
                      </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                      <NoButton onClick={() => setConfirmDialogOpen(false)}>Cancel</NoButton>
                      <YesButton onClick={handleConfirmSubmit} disabled={isLoading}>
                        {isLoading ? 'Submitting...' : 'Yes, Raise Ticket'}
                      </YesButton>
                    </DialogActions>
                  </Dialog>
                </>
              )}
            </Formik>

            {/* Ticket List Section */}
            <Box sx={{ mt: 3 }}>
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
                      height: '400px',
                      '& .MuiDataGrid-cell': {
                        padding: '8px 16px'
                      }
                    }} 
                    rows={filteredRows} 
                    columns={columns}
                    loading={ticketsLoading}
                    pageSizeOptions={[10, 25, 50]}
                    initialState={{
                      pagination: { paginationModel: { pageSize: 10 } }
                    }}
                  />
                </Paper>
              )}
            </Box>

            {/* Ticket Details Modal */}
            <Dialog open={openModal} onClose={handleCloseModal} maxWidth="lg" fullWidth sx={dialogStyle}>
              <DialogTitle sx={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center', 
                backgroundColor: '#1976d2', 
                color: 'white',
                padding: '12px 24px',
                fontWeight: '600'
              }}>
                <Box>
                  Ticket Details - 
                  <span style={{ marginLeft: 8, fontFamily: 'monospace' }}>
                    {selectedTicket ? selectedTicket.ticket_no : ''}
                  </span>
                  {ticketDetails && (
                    <Chip 
                      label={ticketDetails.status} 
                      color={
                        ticketDetails.status === 'Open' ? 'success' : 
                        ticketDetails.status === 'Closed' ? 'error' : 'warning'
                      }
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
                    <Grid container spacing={3}>
                      <Grid item xs={12} md={6}>
                        <CustomParagraphDark>Module:</CustomParagraphDark>
                        <CustomParagraphLight>{ticketDetails.module}</CustomParagraphLight>
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <CustomParagraphDark>Sub Module:</CustomParagraphDark>
                        <CustomParagraphLight>{ticketDetails.submodule}</CustomParagraphLight>
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <CustomParagraphDark>Category:</CustomParagraphDark>
                        <CustomParagraphLight>{ticketDetails.category}</CustomParagraphLight>
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <CustomParagraphDark>Created On:</CustomParagraphDark>
                        <CustomParagraphLight>{ticketDetails.created_on}</CustomParagraphLight>
                      </Grid>
                      {isAdmin && (
                        <Grid item xs={12}>
                          <CustomParagraphDark>Created By:</CustomParagraphDark>
                          <CustomParagraphLight>{ticketDetails.created_by || 'Unknown'}</CustomParagraphLight>
                        </Grid>
                      )}
                      <Grid item xs={12}>
                        <CustomParagraphDark>Initial Comment:</CustomParagraphDark>
                        <Box 
                          sx={{ 
                            border: 1, 
                            borderColor: 'divider', 
                            borderRadius: 1, 
                            p: 2, 
                            mt: 1,
                            backgroundColor: '#f9f9f9'
                          }}
                          dangerouslySetInnerHTML={{ __html: ticketDetails.comment }} 
                        />
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

                    <Divider sx={{ my: 3 }} />

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
                      rows={(ticketDetails.replies || []).map((r, i) => ({ 
                        id: r.reply_id ?? i + 1, 
                        comments: r.message ?? r.comment ?? '', 
                        created_by: r.sender_type === 'admin' ? 'Admin' : r.sender_id ?? r.sender?.username ?? 'User', 
                        created_on: r.created_at ?? r.created_on ?? r.createdAt ?? '', 
                        status: r.status ?? '' 
                      }))} 
                      columns={commentColumn} 
                      hideFooter
                      disableColumnMenu
                    />

                    {/* Show reply section only if user has permission and ticket is not closed */}
                    {(isAdmin || ticketDetails.created_by === userId) && ticketDetails.status !== 'Closed' && (
                      <Box sx={{ mt: 3, p: 2, backgroundColor: '#f8f9fa', borderRadius: 1 }}>
                        <Typography variant="h6" gutterBottom color="primary">
                          Add Reply {isAdmin && <Chip label="Admin Reply" color="primary" size="small" sx={{ ml: 1 }} />}
                        </Typography>
                        <ReactQuill 
                          value={replyMessage} 
                          onChange={setReplyMessage} 
                          modules={{ 
                            toolbar: [
                              ['bold', 'italic', 'underline'],
                              [{ list: 'ordered' }, { list: 'bullet' }],
                              ['link'],
                              ['clean']
                            ] 
                          }} 
                          style={{ height: 150, marginBottom: 16 }} 
                          placeholder="Type your reply here..."
                        />
                        <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
                          <Button 
                            variant="outlined" 
                            onClick={() => setReplyMessage('')} 
                            disabled={isSubmittingReply}
                          >
                            Clear
                          </Button>
                          <Button 
                            variant="contained" 
                            onClick={handleReplySubmit} 
                            disabled={isSubmittingReply || !replyMessage.trim()}
                            startIcon={isSubmittingReply ? <CircularProgress size={16} /> : <ReplyIcon />}
                          >
                            {isSubmittingReply ? 'Sending...' : 'Send Reply'}
                          </Button>
                        </Box>
                      </Box>
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