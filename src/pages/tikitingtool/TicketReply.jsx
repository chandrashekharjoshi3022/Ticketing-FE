import React, { useState, useEffect } from 'react';
import {
  Box,
  Grid,
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  DialogContentText,
  Paper,
  Tabs,
  Tab,
  IconButton,
  Divider,
  MenuItem,
  TextField,
  TableRow,
  TableCell,
  TableHead,
  Table
} from '@mui/material';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import CloseIcon from '@mui/icons-material/Close';
import SendIcon from '@mui/icons-material/Send';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import { DataGrid } from '@mui/x-data-grid';
import KeyboardArrowUpOutlinedIcon from '@mui/icons-material/KeyboardArrowUpOutlined';
import KeyboardArrowDownOutlinedIcon from '@mui/icons-material/KeyboardArrowDownOutlined';
import MainCard from 'components/MainCard';
import PlusButton from 'components/CustomButton';
import CustomParagraphLight from 'components/CustomParagraphLight';
import SelectFieldPadding from 'components/selectFieldPadding';
import CustomRefreshBtn from 'components/CustomRefreshBtn';
import SubmitButton from 'components/CustomSubmitBtn';
import { NoButton, YesButton } from 'components/DialogActionsButton';
import { padding } from '@mui/system';
import CustomParagraphDark from 'components/CustomParagraphDark';
import { toast } from 'react-toastify';
// Styled components (assuming these exist in your project)

const TicketReply = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [openTicketDialog, setOpenTicketDialog] = useState(false);
  const [activeTab, setActiveTab] = useState('Open');
  const [tickets, setTickets] = useState([]);
  const [filteredTickets, setFilteredTickets] = useState([]);
  const [showTableBodies, setShowTableBodies] = useState({
    availableTicket: true
  });
  // Mock data for demonstration
  const mockTickets = [
    {
      id: 1,
      ticket_no: 'TK001',
      module: 'RFQ',
      submodule: 'Create RFQ',
      category: 'Wrong Data / Information',
      status: 'Open',
      created_by: 'John Doe',
      created_on: '2024-01-15',
      priority: 'High',
      last_updated: '2024-01-16'
    },
    {
      id: 2,
      ticket_no: 'TK002',
      module: 'Purchase Order',
      submodule: 'PO Acceptance',
      category: 'Unable to Download',
      status: 'Open',
      created_by: 'Jane Smith',
      created_on: '2024-01-14',
      priority: 'Medium',
      last_updated: '2024-01-15'
    },
    {
      id: 3,
      ticket_no: 'TK003',
      module: 'Quotation',
      submodule: 'Create Quotation',
      category: 'Data Not Reflecting',
      status: 'Closed',
      created_by: 'Mike Johnson',
      created_on: '2024-01-10',
      priority: 'Low',
      last_updated: '2024-01-12'
    }
  ];
  const renderTableHeader = (sectionName, sectionLabel) => (
    <TableHead sx={{ backgroundColor: '#EAF1F6' }}>
      <TableRow>
        <TableCell sx={{ padding: 0, paddingLeft: '8px !important' }} colSpan={12}>
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Typography fontSize={'14px'} fontWeight={600} textTransform={'none'}>
              {sectionLabel}
            </Typography>
            <IconButton size="large" onClick={() => toggleTableBody(sectionName)} sx={{ height: '30px' }}>
              {showTableBodies[sectionName] ? <KeyboardArrowUpOutlinedIcon /> : <KeyboardArrowDownOutlinedIcon />}
            </IconButton>
          </Box>
        </TableCell>
      </TableRow>
    </TableHead>
  );

  const toggleTableBody = (section) => {
    setShowTableBodies((prevState) => ({
      ...prevState,
      [section]: !prevState[section]
    }));
  };
  useEffect(() => {
    setTickets(mockTickets);
    setFilteredTickets(mockTickets.filter((ticket) => ticket.status === 'Open'));
  }, []);

  const initialValues = {
    ticketNo: '',
    priority: '',
    comments: '',
    files: []
  };

  const validationSchema = Yup.object({
    ticketNo: Yup.string().required('Ticket number is required'),
    priority: Yup.string().required('Priority is required'),
    comments: Yup.string().required('Comment is required')
  });

  const errorMessageStyle = {
    color: 'red',
    fontSize: '0.75rem',
    marginTop: '4px'
  };

  const handleBackClick = () => {
    // Navigate back functionality
    console.log('Back clicked');
  };

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
    setFilteredTickets(tickets.filter((ticket) => ticket.status === newValue));
  };

  const handleFileChange = (event, setFieldValue) => {
    const files = Array.from(event.target.files);
    setFieldValue('files', files);
  };

  const handleSubmitClick = (values) => {
    console.log('Reply values:', values);
    setConfirmDialogOpen(true);
    toast.success('Ticket raised successfully!', { autoClose: 2000 });
  };

  const handleConfirmSubmit = () => {
    // Submit reply logic here
    console.log('Reply submitted');
    setConfirmDialogOpen(false);
    // Reset form or redirect
  };

  const handleTicketSelect = (ticket) => {
    setSelectedTicket(ticket);
    setOpenTicketDialog(true);
  };

  const handleCloseTicketDialog = () => {
    setOpenTicketDialog(false);
    setSelectedTicket(null);
  };

  const ticketColumns = [
    {
      field: 'ticket_no',
      headerName: 'Ticket No',
      width: 120,
      renderCell: (params) => (
        <Button variant="text" size="small" onClick={() => handleTicketSelect(params.row)} sx={{ textTransform: 'none', color: '#2c6095' }}>
          {params.value}
        </Button>
      )
    },
    { field: 'module', headerName: 'Module', width: 130 },
    { field: 'submodule', headerName: 'Sub Module', width: 150 },
    { field: 'category', headerName: 'Category', width: 180 },
    { field: 'priority', headerName: 'Priority', width: 100 },
    { field: 'created_by', headerName: 'Created By', width: 130 },
    { field: 'created_on', headerName: 'Created On', width: 120 },
    { field: 'last_updated', headerName: 'Last Updated', width: 120 },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 100,
      renderCell: (params) => (
        <Button
          variant="contained"
          size="small"
          startIcon={<SendIcon />}
          onClick={() => {
            // Pre-fill the form with selected ticket
            setSelectedTicket(params.row);
          }}
          sx={{
            backgroundColor: '#28a745',
            '&:hover': { backgroundColor: '#218838' },
            textTransform: 'none',
            fontSize: '0.75rem'
          }}
        >
          Reply
        </Button>
      )
    }
  ];

  const gridStyle = {
    '& .MuiDataGrid-cell': {
      border: '1px solid rgba(224, 224, 224, 1)',
      fontSize: '0.75rem'
    },
    '& .MuiDataGrid-columnHeader': {
      backgroundColor: '#f5f5f5',
      border: '1px solid rgba(224, 224, 224, 1)',
      fontSize: '0.75rem',
      fontWeight: 600
    }
  };

  return (
    <Box>
      {isLoading ? (
        <Box sx={{ height: '80vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>loading</Box>
      ) : (
        <MainCard
          title={
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontWeight: 600, fontSize: '16px' }}>
              <span>Ticket Reply</span>
              <PlusButton label="Back" onClick={handleBackClick} />
            </Box>
          }
        >
          <Box sx={{ height: '85dvh', overflowY: 'scroll', overflowX: 'hidden' }}>
            {/* Reply Form */}
            <Formik
              initialValues={{
                ...initialValues,
                ticketNo: selectedTicket?.ticket_no || ''
              }}
              validationSchema={validationSchema}
              onSubmit={handleSubmitClick}
              enableReinitialize
            >
              {({ isSubmitting, resetForm, values, handleSubmit, setFieldValue }) => (
                <>
                  <Form>
                    <Box padding={1}>
                      <Grid container spacing={2} alignItems="center">
                        {/* Ticket Number */}
                        <Grid item xs={12} sm={3}>
                          <CustomParagraphLight>
                            Ticket Number <span style={{ color: 'red' }}>*</span>
                          </CustomParagraphLight>
                          <Field
                            as={TextField}
                            name="ticketNo"
                            variant="outlined"
                            size="small"
                            fullWidth
                            placeholder="Enter ticket number or select from list"
                            value={selectedTicket?.ticket_no || values.ticketNo}
                            onChange={(e) => setFieldValue('ticketNo', e.target.value)}
                          />
                          <ErrorMessage name="ticketNo" component="div" style={errorMessageStyle} />
                        </Grid>

                        {/* Priority */}
                        <Grid item xs={12} sm={2}>
                          <CustomParagraphLight>
                            Priority <span style={{ color: 'red' }}>*</span>
                          </CustomParagraphLight>
                          <Field as={SelectFieldPadding} name="priority" variant="outlined" fullWidth>
                            <MenuItem value="Low">Low</MenuItem>
                            <MenuItem value="Medium">Medium</MenuItem>
                            <MenuItem value="High">High</MenuItem>
                            <MenuItem value="Critical">Critical</MenuItem>
                          </Field>
                          <ErrorMessage name="priority" component="div" style={errorMessageStyle} />
                        </Grid>

                        {/* Upload Files */}
                        <Grid item xs={12} sm={3}>
                          <Button
                            component="label"
                            variant="contained"
                            startIcon={<AttachFileIcon />}
                            fullWidth
                            size="small"
                            sx={{
                              backgroundColor: '#2c6095',
                              '&:hover': { backgroundColor: '#244b78' },
                              fontSize: '0.875rem',
                              py: 1,
                              textTransform: 'none'
                            }}
                          >
                            Attach Files
                            <input
                              type="file"
                              hidden
                              multiple
                              accept=".pdf,.jpeg,.jpg,.png"
                              onChange={(e) => handleFileChange(e, setFieldValue)}
                            />
                          </Button>
                        </Grid>

                        {/* File List */}
                        <Grid item xs={12} sm={4}>
                          {values.files?.length > 0 && (
                            <Box>
                              <Typography variant="body2" sx={{ fontWeight: 600, mb: 1 }}>
                                Attached Files:
                              </Typography>
                              {values.files.map((file, index) => (
                                <Typography key={index} variant="body2" sx={{ display: 'flex', alignItems: 'center', marginBottom: '4px' }}>
                                  <AttachFileIcon sx={{ fontSize: 16, mr: 1 }} />
                                  {file.name}
                                </Typography>
                              ))}
                            </Box>
                          )}
                        </Grid>

                        {/* Comments */}
                        <Grid item xs={12}>
                          <CustomParagraphLight>
                            Reply Comment <span style={{ color: 'red' }}>*</span>
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
                              'font',
                              'header',
                              'bold',
                              'italic',
                              'underline',
                              'strike',
                              'list',
                              'bullet',
                              'color',
                              'background',
                              'align',
                              'link'
                            ]}
                            style={{ height: '150px', marginBottom: '50px' }}
                            placeholder="Enter your reply comment..."
                          />
                          <ErrorMessage name="comments" component="div" style={errorMessageStyle} />
                        </Grid>
                      </Grid>

                      {/* Action Buttons */}
                      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 3 }}>
                        <CustomRefreshBtn
                          type="button"
                          variant="contained"
                          onClick={() => {
                            resetForm();
                            setSelectedTicket(null);
                          }}
                        >
                          Reset
                        </CustomRefreshBtn>
                        <SubmitButton
                          type="button"
                          variant="contained"
                          onClick={() => handleSubmit()}
                          startIcon={<SendIcon />}
                          style={{ marginLeft: '10px', padding: '10px' }}
                        >
                          Send Reply
                        </SubmitButton>
                      </Box>
                    </Box>
                  </Form>

                  {/* Confirmation Dialog */}
                  <Dialog open={confirmDialogOpen} onClose={() => setConfirmDialogOpen(false)}>
                    <DialogTitle>Confirm Send Reply</DialogTitle>
                    <DialogContent>
                      <DialogContentText>Are you sure you want to send this reply?</DialogContentText>
                    </DialogContent>
                    <DialogActions>
                      <NoButton onClick={() => setConfirmDialogOpen(false)}>
                        <span>No</span>
                      </NoButton>
                      <YesButton onClick={handleConfirmSubmit}>
                        <span>Yes</span>
                      </YesButton>
                    </DialogActions>
                  </Dialog>
                </>
              )}
            </Formik>

            {/* Tickets List */}
            <Paper sx={{ mb: 2 }}>
              <Table sx={{ mb: 1 }}>{renderTableHeader('availableTicket', 'Available Ticket')}</Table>

              <Tabs
                value={activeTab}
                onChange={handleTabChange}
                indicatorColor="primary"
                textColor="primary"
                sx={{
                  minHeight: '30px',
                  height: '30px',
                  '& .MuiTabs-flexContainer': {
                    height: '100%',
                    borderBottom: '1px solid gray'
                  },
                  '& .MuiTab-root': {
                    padding: '0px 12px',
                    minHeight: '30px',
                    border: '1px solid #f6c846',
                    color: 'gray',
                    borderTopLeftRadius: '10px',
                    borderTopRightRadius: '10px',
                    marginRight: '1px',
                    backgroundColor: '#f5f5f5',
                    '&.Mui-selected': {
                      color: 'black',
                      backgroundColor: '#f6c846'
                    },
                    '&:hover': {
                      borderColor: '#f6c846'
                    }
                  },
                  '& .MuiTabs-indicator': {
                    backgroundColor: '#f6c846'
                  }
                }}
              >
                <Tab label="Open" value="Open" />
                <Tab label="Closed" value="Closed" />
              </Tabs>

              <DataGrid
                getRowHeight={() => 'auto'}
                sx={{ ...gridStyle, height: '60vh' }}
                rows={filteredTickets}
                columns={ticketColumns}
                pageSize={10}
                rowsPerPageOptions={[10]}
              />
            </Paper>

            {/* Ticket Details Dialog */}
            <Dialog open={openTicketDialog} onClose={handleCloseTicketDialog} maxWidth="md" fullWidth>
              <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#a5b8ca' }}>
                <Box>Ticket Details ({selectedTicket?.ticket_no})</Box>
                <IconButton edge="end" color="inherit" onClick={handleCloseTicketDialog}>
                  <CloseIcon />
                </IconButton>
              </DialogTitle>

              <DialogContent dividers sx={{ p: 3 }}>
                {selectedTicket && (
                  <Grid container spacing={2}>
                    <Grid item xs={6}>
                      <CustomParagraphDark>Module:</CustomParagraphDark>
                      <CustomParagraphLight>{selectedTicket.module}</CustomParagraphLight>
                    </Grid>
                    <Grid item xs={6}>
                      <CustomParagraphDark>Sub Module:</CustomParagraphDark>
                      <CustomParagraphLight>{selectedTicket.submodule}</CustomParagraphLight>
                    </Grid>
                    <Grid item xs={6}>
                      <CustomParagraphDark>Category:</CustomParagraphDark>
                      <CustomParagraphLight>{selectedTicket.category}</CustomParagraphLight>
                    </Grid>
                    <Grid item xs={6}>
                      <CustomParagraphDark>Priority:</CustomParagraphDark>
                      <CustomParagraphLight>{selectedTicket.priority}</CustomParagraphLight>
                    </Grid>
                    <Grid item xs={6}>
                      <CustomParagraphDark>Created By:</CustomParagraphDark>
                      <CustomParagraphLight>{selectedTicket.created_by}</CustomParagraphLight>
                    </Grid>
                    <Grid item xs={6}>
                      <CustomParagraphDark>Created On:</CustomParagraphDark>
                      <CustomParagraphLight>{selectedTicket.created_on}</CustomParagraphLight>
                    </Grid>
                  </Grid>
                )}
              </DialogContent>

              <DialogActions>
                <Button onClick={handleCloseTicketDialog} variant="outlined">
                  Close
                </Button>
                <Button
                  onClick={() => {
                    handleCloseTicketDialog();
                    // This would scroll to the reply form or focus on it
                  }}
                  variant="contained"
                  startIcon={<SendIcon />}
                >
                  Reply to This Ticket
                </Button>
              </DialogActions>
            </Dialog>
          </Box>
        </MainCard>
      )}
    </Box>
  );
};

export default TicketReply;
