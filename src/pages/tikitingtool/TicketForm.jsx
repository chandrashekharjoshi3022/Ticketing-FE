import React, { useState, useRef } from 'react';
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
  DialogTitle,
  IconButton,
  Card,
  CardContent
} from '@mui/material';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { errorMessageStyle } from 'components/StyleComponent';
import SelectFieldPadding from 'components/selectFieldPadding';
import SubmitButton from 'components/CustomSubmitBtn';
import CustomRefreshBtn from 'components/CustomRefreshBtn';
import CustomParagraphLight from 'components/CustomParagraphLight';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import DeleteIcon from '@mui/icons-material/Delete';
import VisibilityIcon from '@mui/icons-material/Visibility';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { useDispatch, useSelector } from 'react-redux';
import { selectUserRole, selectCurrentUser } from '../../features/auth/authSlice';
import { fetchTickets, createTicket } from '../../features/tickets/ticketSlice';
import { NoButton, YesButton } from 'components/DialogActionsButton';
import FieldPadding from 'components/FieldPadding';
import ValidationStar from 'components/ValidationStar';

const FilePreviewDialog = ({ open, onClose, file, fileUrl }) => {
  if (!file) return null;

  const isImage = file.type.startsWith('image/');
  
  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        File Preview: {file.name}
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{ position: 'absolute', right: 8, top: 8 }}
        >
          <DeleteIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent>
        {isImage ? (
          <Box sx={{ display: 'flex', justifyContent: 'center' }}>
            <img 
              src={fileUrl} 
              alt={file.name} 
              style={{ 
                maxWidth: '100%', 
                maxHeight: '70vh', 
                objectFit: 'contain' 
              }} 
            />
          </Box>
        ) : (
          <Box sx={{ textAlign: 'center', p: 3 }}>
            <Typography variant="h6" color="textSecondary">
              Preview not available for {file.type}
            </Typography>
            <Typography variant="body2">
              File: {file.name} ({(file.size / 1024).toFixed(2)} KB)
            </Typography>
            <Button 
              href={fileUrl} 
              download={file.name}
              variant="contained"
              sx={{ mt: 2 }}
            >
              Download File
            </Button>
          </Box>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Close</Button>
      </DialogActions>
    </Dialog>
  );
};

const TicketForm = () => {
  const dispatch = useDispatch();
  const fileInputRef = useRef(null);

  // UI state
  const [isLoading, setIsLoading] = useState(false);
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [submitValues, setSubmitValues] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  
  // File preview state
  const [previewDialogOpen, setPreviewDialogOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [selectedFileUrl, setSelectedFileUrl] = useState('');

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
      .test('totalSize', 'Total files size too large (max 50MB)', (value) => {
        if (!value) return true;
        const totalSize = value.reduce((acc, file) => acc + file.size, 0);
        return totalSize <= 50 * 1024 * 1024;
      })
  });

  const handleFileChange = (event, setFieldValue, values) => {
    const newFiles = Array.from(event.target.files);
    
    // Check for duplicates by name and size
    const existingFiles = values.files || [];
    const uniqueNewFiles = newFiles.filter(newFile => 
      !existingFiles.some(existingFile => 
        existingFile.name === newFile.name && 
        existingFile.size === newFile.size &&
        existingFile.lastModified === newFile.lastModified
      )
    );

    if (uniqueNewFiles.length === 0) {
      setErrorMessage('Some files are already selected');
      return;
    }

    // Append new files to existing files
    const updatedFiles = [...existingFiles, ...uniqueNewFiles];
    setFieldValue('files', updatedFiles);
    
    // Reset file input to allow selecting same files again
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }

    // Clear error message if files were added successfully
    if (uniqueNewFiles.length > 0) {
      setErrorMessage('');
    }
  };

  const handleRemoveFile = (index, setFieldValue, values) => {
    const updatedFiles = values.files.filter((_, i) => i !== index);
    setFieldValue('files', updatedFiles);
  };

  const handleRemoveAllFiles = (setFieldValue) => {
    setFieldValue('files', []);
    // Clear any preview URLs
    if (selectedFileUrl) {
      URL.revokeObjectURL(selectedFileUrl);
    }
  };

  const handlePreviewFile = (file) => {
    const fileUrl = URL.createObjectURL(file);
    setSelectedFile(file);
    setSelectedFileUrl(fileUrl);
    setPreviewDialogOpen(true);
  };

  const handleClosePreview = () => {
    setPreviewDialogOpen(false);
    // Revoke the object URL to avoid memory leaks
    if (selectedFileUrl) {
      URL.revokeObjectURL(selectedFileUrl);
    }
    setSelectedFile(null);
    setSelectedFileUrl('');
  };

  const getFileIcon = (fileType) => {
    if (fileType.startsWith('image/')) return '🖼️';
    if (fileType === 'application/pdf') return '📄';
    if (fileType.includes('word')) return '📝';
    if (fileType.includes('excel') || fileType.includes('spreadsheet')) return '📊';
    return '📎';
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getTotalFilesSize = (files) => {
    return files.reduce((total, file) => total + file.size, 0);
  };

  const handleSubmitClick = (values, formikHelpers) => {
    if (values.files.length === 0) {
      setErrorMessage('Please upload at least one file');
      return;
    }
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
      
      if (values.issueName) {
        formData.append('issueName', values.issueName);
      }

      formData.append('sla_id', 1);
      
      // Append all files
      values.files.forEach((file) => {
        formData.append('files', file);
      });

      await dispatch(createTicket(formData)).unwrap();
      await dispatch(fetchTickets()).unwrap();

      resetForm();
      setSubmitting(false);
      setConfirmDialogOpen(false);
      setSubmitValues(null);
      setSuccessMessage('Ticket raised successfully!');
      
      // Clear any preview URLs
      if (selectedFileUrl) {
        URL.revokeObjectURL(selectedFileUrl);
      }
    } catch (err) {
      console.error('Error submitting ticket:', err);
      setErrorMessage(err?.message || 'Failed to raise ticket');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box>
      {/* Success Message */}
      {successMessage && (
        <Alert severity="success" sx={{ mb: 2 }} onClose={() => setSuccessMessage('')}>
          {successMessage}
        </Alert>
      )}

      {/* Error Message */}
      {errorMessage && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setErrorMessage('')}>
          {errorMessage}
        </Alert>
      )}

      <Formik 
        initialValues={initialValues} 
        validationSchema={validationSchema} 
        onSubmit={handleSubmitClick} 
        enableReinitialize
      >
        {({ isSubmitting, resetForm, values, handleSubmit, setFieldValue }) => (
          <>
            <Form>
              <Grid container spacing={2} alignItems="flex-start">
                {/* Your existing form fields remain the same */}
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
                    <MenuItem value="High">High</MenuItem>
                    <MenuItem value="Medium">Medium</MenuItem>
                    <MenuItem value="Low">Low</MenuItem>
                  </Field>
                  <ErrorMessage name="priority" component="div" style={errorMessageStyle} />
                </Grid>

                {/* Enhanced File Upload Section */}
                <Grid item xs={12}>
                  <CustomParagraphLight>
                    Screenshots/Documents <ValidationStar />
                  </CustomParagraphLight>
                  
                  <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', mb: 2 }}>
                    <Button
                      component="label"
                      variant="outlined"
                      startIcon={<CloudUploadIcon />}
                      size="small"
                    >
                      Add Files
                      <input 
                        type="file" 
                        hidden 
                        multiple 
                        accept=".pdf,.jpeg,.jpg,.png,.doc,.docx,.xls,.xlsx" 
                        onChange={(e) => handleFileChange(e, setFieldValue, values)}
                        ref={fileInputRef}
                      />
                    </Button>
                    
                    {values.files.length > 0 && (
                      <Button
                        variant="outlined"
                        color="error"
                        size="small"
                        onClick={() => handleRemoveAllFiles(setFieldValue)}
                      >
                        Remove All
                      </Button>
                    )}
                    
                    {values.files.length > 0 && (
                      <Typography variant="body2" color="textSecondary">
                        Total: {values.files.length} files ({formatFileSize(getTotalFilesSize(values.files))})
                      </Typography>
                    )}
                  </Box>
                  
                  {/* File Preview Section */}
                  {values.files.length > 0 && (
                    <Box sx={{ mt: 2 }}>
                      <Grid container spacing={2}>
                        {values.files.map((file, index) => (
                          <Grid item xs={12} sm={6} md={4} lg={3} key={index}>
                            <Card 
                              variant="outlined" 
                              sx={{ 
                                position: 'relative',
                                '&:hover': {
                                  boxShadow: 2,
                                  borderColor: 'primary.main'
                                }
                              }}
                            >
                              <CardContent sx={{ p: 1.5, '&:last-child': { pb: 1.5 } }}>
                                <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 1 }}>
                                  <Typography 
                                    variant="body2" 
                                    sx={{ 
                                      flexGrow: 1, 
                                      fontSize: '0.8rem',
                                      wordBreak: 'break-word'
                                    }}
                                  >
                                    {getFileIcon(file.type)} {file.name}
                                  </Typography>
                                  <IconButton 
                                    size="small" 
                                    onClick={() => handleRemoveFile(index, setFieldValue, values)}
                                    color="error"
                                    sx={{ ml: 0.5 }}
                                  >
                                    <DeleteIcon fontSize="small" />
                                  </IconButton>
                                </Box>
                                
                                <Typography variant="caption" color="textSecondary" display="block">
                                  {formatFileSize(file.size)} • {file.type.split('/')[1] || file.type}
                                </Typography>
                                
                                <Box sx={{ display: 'flex', gap: 0.5, mt: 1.5 }}>
                                  <Button
                                    size="small"
                                    startIcon={<VisibilityIcon />}
                                    onClick={() => handlePreviewFile(file)}
                                    variant="outlined"
                                    fullWidth
                                    sx={{ fontSize: '0.7rem' }}
                                  >
                                    Preview
                                  </Button>
                                </Box>
                              </CardContent>
                            </Card>
                          </Grid>
                        ))}
                      </Grid>
                    </Box>
                  )}
                  
                  <ErrorMessage name="files" component="div" style={errorMessageStyle} />
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
                <CustomRefreshBtn 
                  type="button" 
                  variant="outlined" 
                  onClick={() => {
                    resetForm();
                    // Clear any preview URLs
                    if (selectedFileUrl) {
                      URL.revokeObjectURL(selectedFileUrl);
                    }
                  }} 
                  disabled={isSubmitting}
                >
                  Reset
                </CustomRefreshBtn>
                <SubmitButton 
                  type="button" 
                  variant="contained" 
                  onClick={() => handleSubmit()} 
                  disabled={isSubmitting || values.files.length === 0}
                >
                  {isSubmitting ? 'Submitting...' : 'Submit Ticket'}
                </SubmitButton>
              </Box>
            </Form>

            {/* Confirm Submit Dialog */}
            <Dialog open={confirmDialogOpen} onClose={() => setConfirmDialogOpen(false)}>
              <DialogTitle>Confirm Raise Ticket</DialogTitle>
              <DialogContent>
                <DialogContentText>
                  Are you sure you want to raise this ticket? This action cannot be undone.
                  <br />
                  <strong>Files to upload: {values.files?.length || 0}</strong>
                </DialogContentText>
              </DialogContent>
              <DialogActions>
                <NoButton onClick={() => setConfirmDialogOpen(false)}>Cancel</NoButton>
                <YesButton onClick={handleConfirmSubmit} disabled={isLoading}>
                  {isLoading ? 'Submitting...' : 'Yes, Raise Ticket'}
                </YesButton>
              </DialogActions>
            </Dialog>

            {/* File Preview Dialog */}
            <FilePreviewDialog
              open={previewDialogOpen}
              onClose={handleClosePreview}
              file={selectedFile}
              fileUrl={selectedFileUrl}
            />
          </>
        )}
      </Formik>
    </Box>
  );
};

export default TicketForm;