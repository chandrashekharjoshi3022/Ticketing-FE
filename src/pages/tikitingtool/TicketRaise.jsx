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
import { axiosInstance } from 'utils/axiosInstance';
import { NoButton, YesButton } from 'components/DialogActionsButton';
import SubmitButton from 'components/CustomSubmitBtn';
import CustomRefreshBtn from 'components/CustomRefreshBtn';
import CustomParagraphLight from 'components/CustomParagraphLight';
// import LoaderLogo from 'components/LoaderLogo';
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
export default function TicketRaise() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [submitValues, setSubmitValues] = useState(null);
  const [activeTab, setActiveTab] = useState('Open');
  const [showTableBodies, setShowTableBodies] = useState({
    ticketView: true
  });
  const theme = useTheme();
  const handleBackClick = () => {
    navigate('/dashboard');
  };
  const commentColumn = [
    { field: 'id', headerName: 'Sr. No.', width: 60 },
    { field: 'comments', headerName: 'Comments', width: 300, flex: 1 },

    { field: 'created_by', headerName: 'Created By', width: 150 },
    {
      field: 'created_on',
      headerName: 'Created On',
      width: 150
    },
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
  const commentRow = [
    {
      id: 1,
      status: 'Open',
      comments: 'User Raised the issue',
      created_on: '2024-08-03',
      created_by: 'Ravi Kumar'
    },
    {
      id: 2,
      status: 'Open',
      comments: 'Ticket Assign to',
      created_on: '2024-08-03',
      created_by: 'Anjali Sharma'
    },
    {
      id: 3,
      status: 'Closed',
      comments: 'Ticket Issue Resolved',
      created_on: '2024-08-04',
      created_by: 'Logistics Team'
    },
    {
      id: 4,
      status: 'Closed',
      comments: 'User Confirmed the Closure Issue',
      created_on: '2024-08-04',
      created_by: 'Ravi Kumar'
    }
  ];

  const rows = [
    {
      id: 1,
      ticket_no: 'TCKT-001',
      module: 'OPR',
      submodule: 'Approve OPR',
      category: 'Wrong Data / Information',
      comments: 'User reported issue at 10 AM',
      created_on: '2024-08-01',
      updated_by: 'Support Team',
      status: 'Open',
      files: [
        'https://via.placeholder.com/200x150.png?text=Screenshot+1',
        'https://via.placeholder.com/200x150.png?text=Screenshot+2',
        'https://via.placeholder.com/200x150.png?text=Screenshot+3',
        'https://via.placeholder.com/200x150.png?text=Screenshot+4',
        'https://via.placeholder.com/200x150.png?text=Screenshot+5'
      ]
    },
    {
      id: 2,
      ticket_no: 'TCKT-002',
      module: 'RFQ',
      submodule: 'Create RFQ',
      category: 'Unable To Upload',
      comments: 'Sent reset instructions via email',
      created_on: '2024-08-02',
      updated_by: 'Admin',
      status: 'Closed',
      files: []
    },
    {
      id: 3,
      ticket_no: 'TCKT-003',
      module: 'Quotation',
      submodule: 'Create Quotation',
      category: 'Unable to Download',
      comments: 'Issue observed mostly in 2nd floor',
      created_on: '2024-08-03',
      updated_by: 'Network Admin',
      status: 'Open',
      files: []
    },
    {
      id: 4,
      ticket_no: 'TCKT-004',
      module: 'Purchase Order',
      submodule: 'PO Acceptance',
      category: 'Unbale to Approve',
      comments: 'Fixed in v2.3.1 patch',
      created_on: '2024-08-04',
      updated_by: 'Frontend Dev',
      status: 'Closed',
      files: []
    },
    {
      id: 5,
      ticket_no: 'TCKT-005',
      module: 'Shipment',
      submodule: 'Create Advice ',
      category: 'Unbale to Input',
      comments: 'Fixed in v2.3.1 patch',
      created_on: '2024-08-04',
      updated_by: 'Frontend Dev',
      status: 'Closed',
      files: []
    },
    {
      id: 6,
      ticket_no: 'TCKT-006',
      module: 'PFI',
      submodule: 'View PFI GBO',
      category: 'Unable to Add More',
      comments: 'Issue observed mostly in 2nd floor',
      created_on: '2024-08-03',
      updated_by: 'Network Admin',
      status: 'Open',
      files: []
    },
    {
      id: 7,
      ticket_no: 'TCKT-007',
      module: 'Shipping Status',
      submodule: 'Shipping Instructions',
      category: 'Data Not Reflecting',
      comments: 'Issue observed mostly in 2nd floor',
      created_on: '2024-08-03',
      updated_by: 'Network Admin',
      status: 'Open',
      files: []
    }
  ];

  const columns = [
    {
      field: 'id',
      headerName: 'Sr. No.',
      width: 60,
      renderCell: (params) => {
        // Get the index of the row in the filtered data
        const rowIndex = filteredRows.findIndex((row) => row.id === params.row.id) + 1;
        return rowIndex;
      }
    },
    { field: 'ticket_no', headerName: 'Ticket No.', width: 120 },
    { field: 'module', headerName: 'Module', width: 150 },
    { field: 'submodule', headerName: 'Sub Module', width: 300, flex: 1 },
    { field: 'category', headerName: 'Category', width: 300, flex: 1 },
    {
      field: 'comments',
      headerName: 'Comments',
      width: 300,
      flex: 1
    },
    {
      field: 'created_on',
      headerName: 'Created On',
      width: 150
    },
    { field: 'updated_by', headerName: 'Updated By', width: 120 },
    {
      field: 'status',
      headerName: 'Status',
      width: 120,
      renderCell: (params) => (
        <Box
          sx={{
            color: params.value === 'Open' ? 'success.main' : 'error.main',
            fontWeight: 'bold'
          }}
        >
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

  const handleView = (row) => {
    setSelectedRow(row);
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setSelectedRow(null);
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

    try {
      setIsLoading(true);
      const { values, formikHelpers } = submitValues;
      const { resetForm, setSubmitting } = formikHelpers;

      // Create FormData for file upload
      const formData = new FormData();
      formData.append('module', values.modules);
      formData.append('submodule', values.submodule);
      formData.append('category', values.category);
      formData.append('comments', values.comments);

      // Append each file
      values.files.forEach((file, index) => {
        formData.append(`files`, file);
      });

      await axiosInstance.post('/api/tickets', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      resetForm();
      setSubmitting(false);
    } catch (error) {
      console.error('Error submitting ticket:', error);
    } finally {
      setIsLoading(false);
      setConfirmDialogOpen(false);
      setSubmitValues(null);
    }
  };
  const dialogStyle = {
    '& .MuiDialog-paper': {
      borderRadius: theme.spacing(2),
      boxShadow: theme.shadows[10]
    }
  };
  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const filteredRows = rows.filter((row) => row.status === activeTab);

  return (
    <Box>
      {isLoading ? (
        <Box sx={{ height: '80vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          {/* <LoaderLogo /> */}
loading
        </Box>
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
            <Formik
              initialValues={initialValues}
              validationSchema={validationSchema}
              onSubmit={handleSubmitClick} // Changed to handleSubmitClick
              enableReinitialize
            >
              {({ isSubmitting, resetForm, values, handleSubmit, setFieldValue }) => (
                <>
                  <Form>
                    <Box padding={1}>
                      <Grid container spacing={2} alignItems="center">
                        {/* Module */}
                        <Grid item xs={12} sm={2}>
                          <CustomParagraphLight>
                            Module <span style={{ color: 'red' }}>*</span>
                          </CustomParagraphLight>
                          <Field as={SelectFieldPadding} name="modules" variant="outlined" fullWidth>
                            <MenuItem value="Open">OPR</MenuItem>
                            <MenuItem value="RFQ">RFQ</MenuItem>
                            <MenuItem value="Quotation">Quotation</MenuItem>
                            <MenuItem value="Purchase Order">Purchase Order</MenuItem>
                            <MenuItem value="Shipment">Shipment</MenuItem>
                            <MenuItem value="PFI">PFI</MenuItem>
                          </Field>
                          <ErrorMessage name="modules" component="div" style={errorMessageStyle} />
                        </Grid>

                        {/* Sub Module */}
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

                        {/* Category */}
                        <Grid item xs={12} sm={2}>
                          <CustomParagraphLight>
                            Category <span style={{ color: 'red' }}>*</span>
                          </CustomParagraphLight>
                          <Field as={SelectFieldPadding} name="category" variant="outlined" fullWidth>
                            <MenuItem value="Wrong Data / Information">Wrong Data / Information</MenuItem>
                            <MenuItem
                              value="
Unable to Download"
                            >
                              Unable to Download
                            </MenuItem>
                            <MenuItem
                              value="
Unable to Add More"
                            >
                              Unable to Add More
                            </MenuItem>
                            <MenuItem value="Data Not Reflecting">Data Not Reflecting</MenuItem>
                            <MenuItem value="Unable To Upload">Unable To Upload</MenuItem>
                            <MenuItem value="Unbale to Approve">Unbale to Approve</MenuItem>
                            <MenuItem value="Unbale to Input">Unbale to Input</MenuItem>
                          </Field>
                          <ErrorMessage name="category" component="div" style={errorMessageStyle} />
                        </Grid>

                        {/* Upload Button */}
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
                            <input
                              type="file"
                              hidden
                              multiple
                              accept=".pdf,.jpeg,.jpg,.png"
                              onChange={(e) => handleFileChange(e, setFieldValue)}
                            />
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
                          <ReactQuill
                            value={values.comments} // Use Formik's values instead of separate state
                            onChange={(value) => {
                              setFieldValue('comments', value); // Update Formik's state directly
                            }}
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
                            style={{ height: '200px', marginBottom: '50px' }}
                          />
                          <ErrorMessage name="comments" component="div" style={errorMessageStyle} />
                        </Grid>
                      </Grid>
                      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 3 }}>
                        <CustomRefreshBtn
                          type="button"
                          variant="contained"
                          onClick={() => {
                            resetForm();
                            setcomments('');
                          }}
                        >
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
            <Table sx={{ mb: 1 }}>{renderTableHeader('ticketView', 'Ticket View')}</Table>

            <Paper sx={{ mb: 2 }}>
              <Tabs
                value={activeTab}
                onChange={handleTabChange}
                indicatorColor="primary"
                textColor="primary"
                sx={{
                  minHeight: '30px', // Changed from 37px to 30px
                  height: '30px', // Changed from 37px to 30px
                  '& .MuiTabs-flexContainer': {
                    height: '100%',
                    borderBottom: '1px solid gray'
                  },
                  '& .MuiTab-root': {
                    padding: '0px 12px',
                    minHeight: '30px', // Changed from 37px to 30px
                    border: '1px solid #f6c846',
                    color: 'gray',
                    borderTopLeftRadius: '10px',
                    borderTopRightRadius: '10px',
                    borderBottomLeftRadius: '0px',
                    borderBottomRightRadius: '0px',
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
                sx={{ ...gridStyle, height: '80vh' }}
                stickyHeader={true}
                rows={filteredRows}
                columns={columns}
              />
            </Paper>

            <Dialog open={openModal} onClose={handleCloseModal} maxWidth="md" fullWidth sx={dialogStyle}>
              <DialogTitle
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  backgroundColor: '#a5b8ca',
                  padding: '5px 16px',
                  fontWeight: '600'
                }}
              >
                <Box>
                  Ticket Status(<span style={{ color: 'navy' }}>{selectedRow ? selectedRow.ticket_no : ''}</span>)
                </Box>
                <IconButton edge="end" color="inherit" onClick={handleCloseModal} sx={{ p: 0.5 }}>
                  <CloseIcon />
                </IconButton>
              </DialogTitle>

              <DialogContent dividers sx={{ p: 3 }}>
                {selectedRow ? (
                  <Grid container spacing={2}>
                    <Grid item xs={2}>
                      <CustomParagraphDark>Module :</CustomParagraphDark>
                      <CustomParagraphLight>{selectedRow.module}</CustomParagraphLight>
                    </Grid>
                    <Grid item xs={3}>
                      <CustomParagraphDark>Sub Module :</CustomParagraphDark>
                      <CustomParagraphLight>{selectedRow.submodule}</CustomParagraphLight>
                    </Grid>

                    <Grid item xs={3}>
                      <CustomParagraphDark>Category:</CustomParagraphDark>
                      <CustomParagraphLight>{selectedRow.category}</CustomParagraphLight>
                    </Grid>

                    <Grid item xs={2}>
                      <CustomParagraphDark>Created On:</CustomParagraphDark>
                      <CustomParagraphLight>{selectedRow.created_on}</CustomParagraphLight>
                    </Grid>

                    <Grid item xs={2}>
                      <CustomParagraphDark>Updated By:</CustomParagraphDark>
                      <CustomParagraphLight>{selectedRow.updated_by}</CustomParagraphLight>
                    </Grid>
                    <Grid item xs={12}>
                      <CustomParagraphDark>Comment:</CustomParagraphDark>
                      <CustomParagraphLight>{selectedRow.comments}</CustomParagraphLight>
                    </Grid>
                    <Grid item xs={12}>
                      <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                        View Images:
                      </Typography>

                      <Grid container spacing={2}>
                        {Array.isArray(selectedRow.files) && selectedRow.files.length > 0 ? (
                          selectedRow.files.map((imgUrl, index) => (
                            <Grid item xs={6} sm={1} md={1} key={index}>
                              <Box
                                component="img"
                                src={imgUrl}
                                alt={`Image ${index + 1}`}
                                sx={{
                                  width: '100%',
                                  height: 150,
                                  objectFit: 'cover',
                                  padding: 1,
                                  borderRadius: 2,
                                  boxShadow: 2
                                }}
                              />
                            </Grid>
                          ))
                        ) : (
                          <Grid item xs={6} sm={1} md={1}>
                            <Typography variant="body2" color="textSecondary">
                              No images uploaded
                            </Typography>
                          </Grid>
                        )}
                      </Grid>
                    </Grid>
                  </Grid>
                ) : (
                  <CustomParagraphLight>No data available</CustomParagraphLight>
                )}

                <Divider sx={{ my: 2 }} />

                <CustomHeading>Issue Log</CustomHeading>

                <DataGrid
                  autoHeight
                  getRowHeight={() => 'auto'}
                  sx={{
                    '& .MuiDataGrid-cell': {
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      border: '1px solid rgba(224, 224, 224, 1)',
                      display: 'flex',
                      alignItems: 'center'
                    },
                    '& .MuiDataGrid-columnHeader': {
                      backgroundColor: '#f5f5f5',
                      border: '1px solid rgba(224, 224, 224, 1)',
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      height: '25px !important',
                      display: 'flex',
                      alignItems: 'center'
                    },
                    marginBottom: '16px'
                  }}
                  hideFooter
                  hideFooterPagination
                  hideFooterSelectedRowCount
                  rows={commentRow}
                  columns={commentColumn}
                  pageSizeOptions={[5]}
                />
              </DialogContent>
            </Dialog>
          </Box>
        </MainCard>
      )}
    </Box>
  );
}
