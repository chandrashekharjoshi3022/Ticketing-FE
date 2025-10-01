import React, { useState } from 'react';
import {
  Box,
  Typography,
  Grid,
  MenuItem,
  Button,
  Alert,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle
} from '@mui/material';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { errorMessageStyle } from 'components/StyleComponent';
import SelectFieldPadding from 'components/selectFieldPadding';
import SubmitButton from 'components/CustomSubmitBtn';
import CustomRefreshBtn from 'components/CustomRefreshBtn';
import CustomParagraphLight from 'components/CustomParagraphLight';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { useDispatch, useSelector } from 'react-redux';
import { selectUserRole, selectCurrentUser } from '../../features/auth/authSlice';
import { fetchTickets, createTicket } from '../../features/tickets/ticketSlice';
import { NoButton, YesButton } from 'components/DialogActionsButton';
import FieldPadding from 'components/FieldPadding';
import ValidationStar from 'components/ValidationStar';
const TicketForm = () => {
  const dispatch = useDispatch();

  // UI state
  const [isLoading, setIsLoading] = useState(false);

  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [submitValues, setSubmitValues] = useState(null);

  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const initialValues = {
    category: '',
    subCategory: '',
    issueType: '',
    priority: '',
    issueName: '',
    files: [],
    comments: ''
  };

  const validationSchema = Yup.object({
    category: Yup.string().required('Module is required'),
    subCategory: Yup.string().required('subCategory is required'),
    issueType: Yup.string().required('issueType is required'),
    priority: Yup.string().required('priority is required'),
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
      formData.append('category', values.category);
      formData.append('subCategory', values.subCategory);
      formData.append('issueType', values.issueType);
      formData.append('priority', values.priority);
      formData.append('comment', values.comments);
      formData.append('issueName', values.issueNames);

      formData.append('sla_id', 1);
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

  return (
    <Box>
      {/* Success Message */}
      {successMessage && (
        <Alert severity="success" sx={{ mb: 2 }}>
          {successMessage}
        </Alert>
      )}

      {/* Error Message */}
      {errorMessage && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {errorMessage}
        </Alert>
      )}

      <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={handleSubmitClick} enableReinitialize>
        {({ isSubmitting, resetForm, values, handleSubmit, setFieldValue }) => (
          <>
            <Form>
              <Grid container spacing={2} alignItems="flex-start">
                <Grid item xs={12} sm={6} md={3}>
                  <CustomParagraphLight>
                    Category <ValidationStar />
                  </CustomParagraphLight>
                  <Field as={SelectFieldPadding} name="category" variant="outlined" fullWidth size="small">
                    <MenuItem value="">
                      <em>Select Module</em>
                    </MenuItem>
                    <MenuItem value="OPR">OPR</MenuItem>
                    <MenuItem value="RFQ">RFQ</MenuItem>
                    <MenuItem value="Quotation">Quotation</MenuItem>
                    <MenuItem value="Purchase Order">Purchase Order</MenuItem>
                    <MenuItem value="Shipment">Shipment</MenuItem>
                    <MenuItem value="PFI">PFI</MenuItem>
                  </Field>
                  <ErrorMessage name="category" component="div" style={errorMessageStyle} />
                </Grid>

                <Grid item xs={12} sm={6} md={3}>
                  <CustomParagraphLight>
                    Sub Category <ValidationStar />
                  </CustomParagraphLight>
                  <Field as={SelectFieldPadding} name="subCategory" variant="outlined" fullWidth size="small">
                    <MenuItem value="">
                      <em>Select subCategory</em>
                    </MenuItem>
                    <MenuItem value="Create RFQ">Create RFQ</MenuItem>
                    <MenuItem value="PO Acceptance">PO Acceptance</MenuItem>
                    <MenuItem value="Create Advice">Create Advice</MenuItem>
                    <MenuItem value="Approve OPR">Approve OPR</MenuItem>
                    <MenuItem value="Create Quotation">Create Quotation</MenuItem>
                    <MenuItem value="View PFI GBO">View PFI GBO</MenuItem>
                  </Field>
                  <ErrorMessage name="subCategory" component="div" style={errorMessageStyle} />
                </Grid>

                <Grid item xs={12} sm={6} md={3}>
                  <CustomParagraphLight>
                    Issue Type <ValidationStar />
                  </CustomParagraphLight>
                  <Field as={SelectFieldPadding} name="issueType" variant="outlined" fullWidth size="small">
                    <MenuItem value="">
                      <em>Select Issue Type</em>
                    </MenuItem>
                    <MenuItem value="Wrong Data / Information">Wrong Data / Information</MenuItem>
                    <MenuItem value="Unable to Download">Unable to Download</MenuItem>
                    <MenuItem value="Unable to Add More">Unable to Add More</MenuItem>
                    <MenuItem value="Data Not Reflecting">Data Not Reflecting</MenuItem>
                    <MenuItem value="Unable To Upload">Unable To Upload</MenuItem>
                    <MenuItem value="Unable to Approve">Unable to Approve</MenuItem>
                    <MenuItem value="Unable to Input">Unable to Input</MenuItem>
                    <MenuItem value="Other">Other</MenuItem>
                  </Field>
                  <ErrorMessage name="issueType" component="div" style={errorMessageStyle} />
                </Grid>

                {/* Conditionally render Issue Name only if Other is selected */}
                {values.issueType === 'Other' && (
                  <Grid item xs={12} sm={3}>
                    <Typography variant="body2">Issue Name</Typography>
                    <Field as={FieldPadding} name="issueName" variant="outlined" fullWidth />
                    <ErrorMessage name="issueName" component="div" style={errorMessageStyle} />
                  </Grid>
                )}

                <Grid item xs={12} sm={6} md={3}>
                  <CustomParagraphLight>
                    Priority <ValidationStar />
                  </CustomParagraphLight>
                  <Field as={SelectFieldPadding} name="priority" variant="outlined" fullWidth size="small">
                    <MenuItem value="">
                      <em>Select priority</em>
                    </MenuItem>
                    <MenuItem value="Wrong Data / Information">Wrong Data / Information</MenuItem>
                    <MenuItem value="Unable to Download">Unable to Download</MenuItem>
                    <MenuItem value="Unable to Add More">Unable to Add More</MenuItem>
                    <MenuItem value="Data Not Reflecting">Data Not Reflecting</MenuItem>
                    <MenuItem value="Unable To Upload">Unable To Upload</MenuItem>
                    <MenuItem value="Unable to Approve">Unable to Approve</MenuItem>
                    <MenuItem value="Unable to Input">Unable to Input</MenuItem>
                    <MenuItem value="Other">Other</MenuItem>
                  </Field>
                  <ErrorMessage name="priority" component="div" style={errorMessageStyle} />
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
                    <input type="file" hidden multiple accept=".pdf,.jpeg,.jpg,.png" onChange={(e) => handleFileChange(e, setFieldValue)} />
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
                    Comment <ValidationStar />
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
                    style={{ height: '150px', marginBottom: '60px' }}
                  />
                  <ErrorMessage name="comments" component="div" style={errorMessageStyle} />
                </Grid>
              </Grid>
              <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1, mt: 2 }}>
                <CustomRefreshBtn type="button" variant="outlined" onClick={() => resetForm()} disabled={isSubmitting}>
                  Reset
                </CustomRefreshBtn>
                <SubmitButton type="button" variant="contained" onClick={() => handleSubmit()} disabled={isSubmitting}>
                  {isSubmitting ? 'Submitting...' : 'Submit Ticket'}
                </SubmitButton>
              </Box>
            </Form>

            <Dialog open={confirmDialogOpen} onClose={() => setConfirmDialogOpen(false)}>
              <DialogTitle>Confirm Raise Ticket</DialogTitle>
              <DialogContent>
                <DialogContentText>Are you sure you want to raise this ticket? This action cannot be undone.</DialogContentText>
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
    </Box>
  );
};

export default TicketForm;
