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
  Table
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

import { useDispatch, useSelector } from 'react-redux';
import { fetchTickets, fetchTicketDetails, createTicket, replyToTicket, clearTicketDetails } from '../../features/tickets/ticketSlice';

export default function TicketRaise() {
  const navigate = useNavigate();
  const theme = useTheme();
  const dispatch = useDispatch();

  // redux state
  const { tickets, ticketDetails, isLoading: ticketsLoading } = useSelector((s) => s.tickets || { tickets: [], ticketDetails: null, isLoading: false });

  // UI state
  const [isLoading, setIsLoading] = useState(false); // local loading for actions
  const [openModal, setOpenModal] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [submitValues, setSubmitValues] = useState(null);
  const [activeTab, setActiveTab] = useState('Open');
  const [showTableBodies, setShowTableBodies] = useState({ ticketView: true });
  const [replyMessage, setReplyMessage] = useState('');
  const [isSubmittingReply, setIsSubmittingReply] = useState(false);

  useEffect(() => {

    console.log('Fetching tickets');
    dispatch(fetchTickets());
  }, [dispatch]);

  const handleBackClick = () => navigate('/dashboard');

  const toggleTableBody = (section) => {
    setShowTableBodies((prevState) => ({ ...prevState, [section]: !prevState[section] }));
  };

  const handleView = async (row) => {
    setSelectedTicket(row);
    setOpenModal(true);
    setIsLoading(true);
    try {
      await dispatch(fetchTicketDetails(row.id)).unwrap();
    } catch (err) {
      console.error('Failed to load details', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setSelectedTicket(null);
    setReplyMessage('');
    dispatch(clearTicketDetails());
  };

  const initialValues = { modules: '', submodule: '', category: '', files: [], comments: '' };

  const validationSchema = Yup.object({
    modules: Yup.string().required('Module is required'),
    category: Yup.string().required('Category is required'),
    submodule: Yup.string().required('Submodule is required'),
    comments: Yup.string().required('comments is required'),
    files: Yup.array()
      .min(1, 'At least one file is required')
      .test('fileSize', 'File size too large', (value) => {
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


      console.log('Submitting form data:', { ...values, files: values.files?.map((f) => f.module) });

      await dispatch(createTicket(formData)).unwrap();

      // refresh list
      await dispatch(fetchTickets()).unwrap();

      resetForm();
      setSubmitting(false);
      setConfirmDialogOpen(false);
      setSubmitValues(null);
      // user feedback
      window.alert('Ticket raised successfully');
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
    setIsSubmittingReply(true);
    try {
      await dispatch(replyToTicket({ ticketId: ticketDetails.ticket_id, message: replyMessage })).unwrap();
      // refresh details and list
      await dispatch(fetchTicketDetails(ticketDetails.ticket_id)).unwrap();
      await dispatch(fetchTickets()).unwrap();
      setReplyMessage('');
    } catch (err) {
      console.error('Reply failed', err);
      window.alert(err?.message || 'Failed to send reply');
    } finally {
      setIsSubmittingReply(false);
    }
  };

  const filteredRows = (tickets || []).filter((row) => row.status === activeTab);

  // Columns tailored to state
  const columns = [
    {
      field: 'id',
      headerName: 'Sr. No.',
      width: 60,
      renderCell: (params) => (filteredRows.findIndex((row) => row.id === params.row.id) + 1)
    },
    { field: 'ticket_no', headerName: 'Ticket No.', width: 120 },
    { field: 'module', headerName: 'Module', width: 150 },
    { field: 'submodule', headerName: 'Sub Module', width: 300, flex: 1 },
    { field: 'category', headerName: 'Category', width: 300, flex: 1 },
    { field: 'comments', headerName: 'Comments', width: 300, flex: 1 },
    { field: 'created_on', headerName: 'Created On', width: 150 },
    { field: 'updated_by', headerName: 'Updated By', width: 120 },
    {
      field: 'status',
      headerName: 'Status',
      width: 120,
      renderCell: (params) => (
        <Box sx={{ color: params.value === 'Open' ? 'success.main' : 'error.main', fontWeight: 'bold' }}>
          {params.value}
        </Box>
      )
    },
    {
      field: 'actions',
      headerName: 'View Ticket',
      width: 90,
      renderCell: (params) => (
        <Box sx={{ display: 'flex', gap: 1 }}>
          <IconButton color="primary" onClick={() => handleView(params.row)}>
            <VisibilityIcon />
          </IconButton>
        </Box>
      )
    }
  ];

  const commentColumn = [
    { field: 'id', headerName: 'Sr. No.', width: 60 },
    { field: 'comments', headerName: 'Comments', width: 300, flex: 1 },
    { field: 'created_by', headerName: 'Created By', width: 150 },
    { field: 'created_on', headerName: 'Created On', width: 150 },
    {
      field: 'status',
      headerName: 'Status',
      width: 100,
      renderCell: (params) => {
        const status = params.value;
        const color = status === 'Open' ? 'green' : status === 'Closed' ? 'red' : 'gray';
        return (
          <Box sx={{ display: 'flex', alignItems: 'center', height: '100%' }}>
            <Typography sx={{ color, fontWeight: 'bold' }}>{status}</Typography>
          </Box>
        );
      }
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

  const dialogStyle = {
    '& .MuiDialog-paper': {
      borderRadius: theme.spacing(2),
      boxShadow: theme.shadows[10]
    }
  };

  return (
    <Box>
      {(isLoading || ticketsLoading) ? (
        <Box sx={{ height: '80vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>loading</Box>
      ) : (
        <MainCard
          title={
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontWeight: 600, fontSize: '16px' }}>
              <span> Raise Ticket </span>
              <PlusButton label="Back" onClick={handleBackClick} />
            </Box>
          }
        >
          <Box sx={{ height: '85dvh', overflowY: 'scroll', overflowX: 'hidden' }}>
            <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={handleSubmitClick} enableReinitialize>
              {({ isSubmitting, resetForm, values, handleSubmit, setFieldValue }) => (
                <>
                  <Form>
                    <Box padding={1}>
                      <Grid container spacing={2} alignItems="center">
                        <Grid item xs={12} sm={2}>
                          <CustomParagraphLight>
                            Module <span style={{ color: 'red' }}>*</span>
                          </CustomParagraphLight>
                          <Field as={SelectFieldPadding} name="modules" variant="outlined" fullWidth>
                            <MenuItem value="OPR">OPR</MenuItem>
                            <MenuItem value="RFQ">RFQ</MenuItem>
                            <MenuItem value="Quotation">Quotation</MenuItem>
                            <MenuItem value="Purchase Order">Purchase Order</MenuItem>
                            <MenuItem value="Shipment">Shipment</MenuItem>
                            <MenuItem value="PFI">PFI</MenuItem>
                          </Field>
                          <ErrorMessage name="modules" component="div" style={errorMessageStyle} />
                        </Grid>

                        <Grid item xs={12} sm={2}>
                          <CustomParagraphLight>
                            Sub Module <span style={{ color: 'red' }}>*</span>
                          </CustomParagraphLight>
                          <Field as={SelectFieldPadding} name="submodule" variant="outlined" fullWidth>
                            <MenuItem value="Create RFQ">Create RFQ</MenuItem>
                            <MenuItem value="PO Acceptance">PO Acceptance</MenuItem>
                            <MenuItem value="Create Advice">Create Advice</MenuItem>
                            <MenuItem value="Approve OPR">Approve OPR</MenuItem>
                            <MenuItem value="Create Quotation">Create Quotation</MenuItem>
                            <MenuItem value="View PFI GBO">View PFI GBO</MenuItem>
                          </Field>
                          <ErrorMessage name="submodule" component="div" style={errorMessageStyle} />
                        </Grid>

                        <Grid item xs={12} sm={2}>
                          <CustomParagraphLight>
                            Category <span style={{ color: 'red' }}>*</span>
                          </CustomParagraphLight>
                          <Field as={SelectFieldPadding} name="category" variant="outlined" fullWidth>
                            <MenuItem value="Wrong Data / Information">Wrong Data / Information</MenuItem>
                            <MenuItem value="Unable to Download">Unable to Download</MenuItem>
                            <MenuItem value="Unable to Add More">Unable to Add More</MenuItem>
                            <MenuItem value="Data Not Reflecting">Data Not Reflecting</MenuItem>
                            <MenuItem value="Unable To Upload">Unable To Upload</MenuItem>
                            <MenuItem value="Unbale to Approve">Unbale to Approve</MenuItem>
                            <MenuItem value="Unbale to Input">Unbale to Input</MenuItem>
                          </Field>
                          <ErrorMessage name="category" component="div" style={errorMessageStyle} />
                        </Grid>

                        <Grid item xs={12} sm={2}>
                          <Button
                            component="label"
                            variant="contained"
                            startIcon={<CloudUploadIcon />}
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
                            Upload Screenshots
                            <input type="file" hidden multiple accept=".pdf,.jpeg,.jpg,.png" onChange={(e) => handleFileChange(e, setFieldValue)} />
                          </Button>
                        </Grid>
                        <Grid item xs={12} sm={2}>
                          {values.files?.length > 0 && (
                            <Box>
                              {values.files.map((file, index) => (
                                <Typography key={index} variant="body2" sx={{ display: 'flex', alignItems: 'center', marginBottom: '4px' }}>
                                  <span style={{ marginRight: '8px' }}>{index + 1}.</span>
                                  {file.name}
                                </Typography>
                              ))}
                            </Box>
                          )}
                        </Grid>

                        <Grid item xs={12}>
                          <CustomParagraphLight>
                            Comment <span style={{ color: 'red' }}>*</span>
                          </CustomParagraphLight>
                          <ReactQuill value={values.comments} onChange={(value) => setFieldValue('comments', value)} modules={{
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
                          }} formats={[
                            'font', 'header', 'bold', 'italic', 'underline', 'strike', 'list', 'bullet', 'color', 'background', 'align', 'link'
                          ]} style={{ height: '200px', marginBottom: '50px' }} />
                          <ErrorMessage name="comments" component="div" style={errorMessageStyle} />
                        </Grid>
                      </Grid>
                      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 3 }}>
                        <CustomRefreshBtn type="button" variant="contained" onClick={() => { /* no-op here */ }}>
                          Reset
                        </CustomRefreshBtn>
                        <SubmitButton type="button" variant="contained" onClick={() => handleSubmit()} style={{ marginLeft: '10px' }}>
                          Submit
                        </SubmitButton>
                      </Box>
                    </Box>
                  </Form>

                  <Dialog open={confirmDialogOpen} onClose={() => setConfirmDialogOpen(false)} aria-labelledby="confirm-ticket-dialog">
                    <DialogTitle id="confirm-ticket-dialog">Confirm Raise Ticket</DialogTitle>
                    <DialogContent>
                      <DialogContentText>Are you sure you want to raise this ticket?</DialogContentText>
                    </DialogContent>
                    <DialogActions>
                      <NoButton onClick={() => setConfirmDialogOpen(false)}><span>No</span></NoButton>
                      <YesButton onClick={handleConfirmSubmit}><span>Yes</span></YesButton>
                    </DialogActions>
                  </Dialog>
                </>
              )}
            </Formik>

            <Table sx={{ mb: 1 }}>{renderTableHeader('ticketView', 'Ticket View')}</Table>

            <Paper sx={{ mb: 2 }}>
              <Tabs value={activeTab} onChange={handleTabChange} indicatorColor="primary" textColor="primary" sx={{ minHeight: '30px', height: '30px', '& .MuiTabs-flexContainer': { height: '100%', borderBottom: '1px solid gray' }, '& .MuiTab-root': { padding: '0px 12px', minHeight: '30px', border: '1px solid #f6c846', color: 'gray', borderTopLeftRadius: '10px', borderTopRightRadius: '10px', borderBottomLeftRadius: '0px', borderBottomRightRadius: '0px', marginRight: '1px', backgroundColor: '#f5f5f5', '&.Mui-selected': { color: 'black', backgroundColor: '#f6c846' }, '&:hover': { borderColor: '#f6c846' } }, '& .MuiTabs-indicator': { backgroundColor: '#f6c846' } }}>
                <Tab label="Open" value="Open" />
                <Tab label="Closed" value="Closed" />
              </Tabs>

              <DataGrid getRowHeight={() => 'auto'} sx={{ ...gridStyle, height: '80vh' }} stickyHeader rows={filteredRows} columns={columns} />
            </Paper>

            <Dialog open={openModal} onClose={handleCloseModal} maxWidth="md" fullWidth sx={dialogStyle}>
              <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#a5b8ca', padding: '5px 16px', fontWeight: '600' }}>
                <Box>Ticket Status(<span style={{ color: 'navy' }}>{selectedTicket ? selectedTicket.ticket_no : ''}</span>)</Box>
                <IconButton edge="end" color="inherit" onClick={handleCloseModal} sx={{ p: 0.5 }}><CloseIcon /></IconButton>
              </DialogTitle>

              <DialogContent dividers sx={{ p: 3 }}>
                {ticketDetails ? (
                  <>
                    <Grid container spacing={2}>
                      <Grid item xs={2}><CustomParagraphDark>Module :</CustomParagraphDark><CustomParagraphLight>{ticketDetails.module}</CustomParagraphLight></Grid>
                      <Grid item xs={3}><CustomParagraphDark>Sub Module :</CustomParagraphDark><CustomParagraphLight>{ticketDetails.submodule}</CustomParagraphLight></Grid>
                      <Grid item xs={3}><CustomParagraphDark>Category:</CustomParagraphDark><CustomParagraphLight>{ticketDetails.category}</CustomParagraphLight></Grid>
                      <Grid item xs={2}><CustomParagraphDark>Created On:</CustomParagraphDark><CustomParagraphLight>{ticketDetails.created_on}</CustomParagraphLight></Grid>
                      <Grid item xs={2}><CustomParagraphDark>Updated By:</CustomParagraphDark><CustomParagraphLight>{ticketDetails.updated_by}</CustomParagraphLight></Grid>
                      <Grid item xs={12}><CustomParagraphDark>Comment:</CustomParagraphDark><CustomParagraphLight dangerouslySetInnerHTML={{ __html: ticketDetails.comment }} /></Grid>

                      <Grid item xs={12}>
                        <Typography variant="subtitle1" fontWeight="bold" gutterBottom>View Images:</Typography>
                        <Grid container spacing={2}>
                          {Array.isArray(ticketDetails.files) && ticketDetails.files.length > 0 ? (
                            ticketDetails.files.map((imgUrl, index) => (
                              <Grid item xs={6} sm={1} md={1} key={index}>
                                <Box component="img" src={imgUrl} alt={`Image ${index + 1}`} sx={{ width: '100%', height: 150, objectFit: 'cover', padding: 1, borderRadius: 2, boxShadow: 2 }} />
                              </Grid>
                            ))
                          ) : (
                            <Grid item xs={6} sm={1} md={1}><Typography variant="body2" color="textSecondary">No images uploaded</Typography></Grid>
                          )}
                        </Grid>
                      </Grid>
                    </Grid>

                    <Divider sx={{ my: 2 }} />

                    <CustomHeading>Issue Log</CustomHeading>

                    <DataGrid autoHeight getRowHeight={() => 'auto'} sx={{ '& .MuiDataGrid-cell': { whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', border: '1px solid rgba(224, 224, 224, 1)', display: 'flex', alignItems: 'center' }, '& .MuiDataGrid-columnHeader': { backgroundColor: '#f5f5f5', border: '1px solid rgba(224, 224, 224, 1)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', height: '25px !important', display: 'flex', alignItems: 'center' }, marginBottom: '16px' }} hideFooter hideFooterPagination hideFooterSelectedRowCount rows={(ticketDetails.replies || []).map((r, i) => ({ id: r.reply_id ?? i + 1, comments: r.message ?? r.comment ?? '', created_by: r.sender_type === 'admin' ? 'Admin' : r.sender_id ?? r.sender?.username ?? 'User', created_on: r.created_at ?? r.created_on ?? r.createdAt ?? '', status: r.status ?? '' }))} columns={commentColumn} pageSizeOptions={[5]} />

                    <Box sx={{ mt: 2 }}>
                      <Typography variant="subtitle1" fontWeight="bold" gutterBottom>Add a reply</Typography>
                      <ReactQuill value={replyMessage} onChange={setReplyMessage} modules={{ toolbar: [['bold','italic'], ['link']] }} style={{ height: 120, marginBottom: 12 }} />
                      <Box sx={{ display: 'flex', gap: 2 }}>
                        <Button variant="contained" color="primary" onClick={handleReplySubmit} disabled={isSubmittingReply}>{isSubmittingReply ? 'Sending...' : 'Send Reply'}</Button>
                        <Button variant="outlined" onClick={() => setReplyMessage('')} disabled={isSubmittingReply}>Cancel</Button>
                      </Box>
                    </Box>
                  </>
                ) : (
                  <CustomParagraphLight>No data available</CustomParagraphLight>
                )}
              </DialogContent>
            </Dialog>
          </Box>
        </MainCard>
      )}
    </Box>
  );
}
