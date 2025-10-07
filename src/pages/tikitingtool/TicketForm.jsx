// src/components/TicketFormFull.jsx
import React, { useState, useRef, useEffect } from 'react';
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
import { useDispatch } from 'react-redux';
import { toast } from 'react-toastify';

import SelectFieldPadding from 'components/selectFieldPadding';
import FieldPadding from 'components/FieldPadding';
import SubmitButton from 'components/CustomSubmitBtn';
import CustomRefreshBtn from 'components/CustomRefreshBtn';
import CustomParagraphLight from 'components/CustomParagraphLight';
import ValidationStar from 'components/ValidationStar';
import LoaderLogo from 'components/LoaderLogo';
import { NoButton, YesButton } from 'components/DialogActionsButton';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import DeleteIcon from '@mui/icons-material/Delete';
import VisibilityIcon from '@mui/icons-material/Visibility';
import MainCard from 'components/MainCard';
import { errorMessageStyle } from 'components/StyleComponent';
import API from '../../api/axios'; // your API wrapper
import { createTicket, fetchTickets } from '../../features/tickets/ticketSlice';

const FilePreviewDialog = ({ open, onClose, file, fileUrl }) => {
  if (!file) return null;
  const isImage = file.type && file.type.startsWith('image/');
  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        File Preview: {file.name}
        <IconButton aria-label="close" onClick={onClose} sx={{ position: 'absolute', right: 8, top: 8 }}>
          <DeleteIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent>
        {isImage ? (
          <Box sx={{ display: 'flex', justifyContent: 'center' }}>
            <img src={fileUrl} alt={file.name} style={{ maxWidth: '100%', maxHeight: '70vh', objectFit: 'contain' }} />
          </Box>
        ) : (
          <Box sx={{ textAlign: 'center', p: 3 }}>
            <Typography variant="h6" color="textSecondary">
              Preview not available for {file.type || 'unknown'}
            </Typography>
            <Typography variant="body2">
              File: {file.name} ({(file.size / 1024).toFixed(2)} KB)
            </Typography>
            <Button href={fileUrl} download={file.name} variant="contained" sx={{ mt: 2 }}>
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

  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [issueTypes, setIssueTypes] = useState([]);
  const [priorities, setPriorities] = useState([]);
  const [slas, setSlas] = useState([]);

  const [isLoading, setIsLoading] = useState(false);
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [submitValues, setSubmitValues] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const [previewDialogOpen, setPreviewDialogOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [selectedFileUrl, setSelectedFileUrl] = useState('');

  useEffect(() => {
    fetchCategories();
    fetchPriorities();
    fetchSLAs();
  }, []);

  const fetchCategories = async () => {
    try {
      const res = await API.get('/admin/categories');
      const list = Array.isArray(res.data) ? res.data : res.data.categories ?? [];
      setCategories(list);
    } catch (err) {
      console.error('fetchCategories error', err);
      setCategories([]);
    }
  };

  const fetchSubcategories = async (categoryId) => {
    if (!categoryId) {
      setSubcategories([]);
      return;
    }
    try {
      const res = await API.get(`/admin/subcategories?categoryId=${encodeURIComponent(categoryId)}`);
      const list = Array.isArray(res.data) ? res.data : res.data.subcategories ?? [];
      setSubcategories(list);
    } catch (err) {
      console.error('fetchSubcategories error', err);
      setSubcategories([]);
    }
  };

  const fetchIssueTypes = async (subcategoryId) => {
    if (!subcategoryId) {
      setIssueTypes([]);
      return;
    }
    try {
      const res = await API.get(`/admin/issuetypes?subcategoryId=${encodeURIComponent(subcategoryId)}`);
      const list = Array.isArray(res.data) ? res.data : res.data.issue_types ?? [];
      setIssueTypes(list);
    } catch (err) {
      console.error('fetchIssueTypes error', err);
      setIssueTypes([]);
    }
  };

  const fetchPriorities = async () => {
    try {
      const res = await API.get('/admin/priorities');
      const list = Array.isArray(res.data) ? res.data : res.data.priorities ?? [];
      setPriorities(list);
    } catch (err) {
      console.error('fetchPriorities error', err);
      setPriorities([]);
    }
  };

  const fetchSLAs = async () => {
    try {
      const res = await API.get('/admin/slas');
      const list = Array.isArray(res.data) ? res.data : res.data.slas ?? [];
      setSlas(list);
    } catch (err) {
      console.error('fetchSLAs error', err);
      setSlas([]);
    }
  };

  // file helpers
  const handleFileChange = (event, setFieldValue, values) => {
    const newFiles = Array.from(event.target.files || []);
    const existingFiles = values.files || [];
    const uniqueNewFiles = newFiles.filter(
      (nf) => !existingFiles.some((ef) => ef.name === nf.name && ef.size === nf.size && ef.lastModified === nf.lastModified)
    );
    if (uniqueNewFiles.length === 0) {
      setErrorMessage('Some files are already selected');
      return;
    }
    const updated = [...existingFiles, ...uniqueNewFiles];
    setFieldValue('files', updated);
    if (fileInputRef.current) fileInputRef.current.value = '';
    setErrorMessage('');
  };

  const handleRemoveFile = (index, setFieldValue, values) => {
    const updated = (values.files || []).filter((_, i) => i !== index);
    setFieldValue('files', updated);
  };

  const handleRemoveAllFiles = (setFieldValue) => {
    setFieldValue('files', []);
    if (selectedFileUrl) {
      URL.revokeObjectURL(selectedFileUrl);
    }
  };

  const handlePreviewFile = (file) => {
    const url = URL.createObjectURL(file);
    setSelectedFile(file);
    setSelectedFileUrl(url);
    setPreviewDialogOpen(true);
  };

  const handleClosePreview = () => {
    setPreviewDialogOpen(false);
    if (selectedFileUrl) {
      URL.revokeObjectURL(selectedFileUrl);
    }
    setSelectedFile(null);
    setSelectedFileUrl('');
  };

  const getFileIcon = (fileType) => {
    if (!fileType) return '📎';
    if (fileType.startsWith('image/')) return '🖼️';
    if (fileType === 'application/pdf') return '📄';
    if (fileType.includes('word')) return '📝';
    if (fileType.includes('excel') || fileType.includes('spreadsheet')) return '📊';
    return '📎';
  };

  const formatFileSize = (bytes) => {
    if (!bytes) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getTotalFilesSize = (files) => (files || []).reduce((s, f) => s + (f.size || 0), 0);

  // formik config
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
    category: Yup.string().required('Category required'),
    subCategory: Yup.string().required('Subcategory required'),
    issueType: Yup.string().required('Issue Type required'),
    priority: Yup.string().required('Priority required'),
    comments: Yup.string().required('Comments required'),
    // files optional - size checks only if present
    files: Yup.array()
      .test('fileSize', 'File too large (max 5MB each)', (value) => {
        if (!value || value.length === 0) return true;
        return value.every((f) => f.size <= 5 * 1024 * 1024);
      })
      .test('totalSize', 'Total files too large (max 50MB)', (value) => {
        if (!value || value.length === 0) return true;
        const total = (value || []).reduce((acc, f) => acc + (f.size || 0), 0);
        return total <= 50 * 1024 * 1024;
      })
  });

  const handleSubmitClick = (values, formikHelpers) => {
    // Files are optional
    setSubmitValues({ values, formikHelpers });
    setConfirmDialogOpen(true);
  };

  const handleConfirmSubmit = async () => {
    if (!submitValues) return;
    setIsLoading(true);
    try {
      const { values, formikHelpers } = submitValues;
      const { resetForm, setSubmitting } = formikHelpers;

      // Resolve selected objects
      const selCategory = categories.find((c) => String(c.category_id) === String(values.category));
      const selSub = subcategories.find((s) => String(s.subcategory_id) === String(values.subCategory));
      const selIssue = issueTypes.find((it) => String(it.issue_type_id ?? it.id) === String(values.issueType));
      const selPriority = priorities.find((p) => String(p.priority_id ?? p.id) === String(values.priority));

      const formData = new FormData();
      // send both ids and names where useful
      formData.append('category_id', values.category || '');
      formData.append('category', selCategory ? (selCategory.category_name ?? selCategory.name ?? '') : '');

      formData.append('subCategory_id', values.subCategory || '');
      formData.append('subCategory', selSub ? (selSub.subcategory_name ?? selSub.name ?? '') : '');

      // Issue Type handling:
      if (String(values.issueType) === 'Other' || String(values.issueType).toLowerCase() === 'other') {
        formData.append('issueType', 'Other');
        if (values.issueName) formData.append('issueName', values.issueName);
        // Priority chosen by user when Other
        formData.append('priority_id', values.priority || '');
        const pName = selPriority ? (selPriority.name || '') : '';
        formData.append('priority', pName);
        // **Important change**: when Issue Type is Other, send sla_id = 1
        formData.append('sla_id', String(1));
      } else {
        // IssueType from enum/list: send issue type id and name
        formData.append('issueType_id', values.issueType || '');
        formData.append('issueType', selIssue ? (selIssue.name ?? selIssue.issue_type ?? '') : '');
        // SLA id from issue if present
        const issueSlaId = selIssue?.sla_id ?? selIssue?.sla?.sla_id ?? '';
        if (issueSlaId) formData.append('sla_id', issueSlaId);
        // default priority from issue if present
        const defaultPriorityId = selIssue?.priority_id ?? selIssue?.default_priority?.priority_id ?? '';
        const priorityIdToSend = values.priority || defaultPriorityId || '';
        const priorityNameToSend = (priorities.find((p) => String(p.priority_id ?? p.id) === String(priorityIdToSend)) || {}).name || '';
        formData.append('priority_id', priorityIdToSend);
        formData.append('priority', priorityNameToSend);
      }

      formData.append('comment', values.comments || '');

      (values.files || []).forEach((f) => {
        formData.append('files', f);
      });

      // Dispatch createTicket (uses redux slice)
      await dispatch(createTicket(formData)).unwrap();
      await dispatch(fetchTickets()).unwrap();

      resetForm();
      setSubmitting(false);
      setConfirmDialogOpen(false);
      setSubmitValues(null);
      setSuccessMessage('Ticket raised successfully!');
      toast.success('Ticket raised successfully!', { autoClose: 2000 });

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

  // handlers that cascade selections
  const onCategoryChange = async (categoryId, setFieldValue) => {
    setFieldValue('subCategory', '');
    setFieldValue('issueType', '');
    setFieldValue('priority', '');
    setFieldValue('issueName', '');
    setSubcategories([]);
    setIssueTypes([]);
    if (categoryId) {
      await fetchSubcategories(categoryId);
    }
  };

  const onSubCategoryChange = async (subcategoryId, setFieldValue) => {
    setFieldValue('issueType', '');
    setFieldValue('priority', '');
    setFieldValue('issueName', '');
    setIssueTypes([]);
    if (subcategoryId) {
      await fetchIssueTypes(subcategoryId);
    }
  };

  // IMPORTANT: when selecting an issueType that is NOT "Other",
  // auto-set its default priority and disable the priority selector.
  const onIssueTypeChange = (issueTypeId, setFieldValue, values) => {
    setFieldValue('priority', '');
    setFieldValue('issueName', '');
    if (!issueTypeId) {
      return;
    }
    if (String(issueTypeId) === 'Other' || String(issueTypeId).toLowerCase() === 'other') {
      setFieldValue('priority', '');
      return;
    }
    const it = issueTypes.find((x) => String(x.issue_type_id ?? x.id) === String(issueTypeId));
    const defaultPri = it?.priority_id ?? it?.default_priority?.priority_id ?? '';
    if (defaultPri) {
      setFieldValue('priority', String(defaultPri));
    } else {
      setFieldValue('priority', '');
    }
  };

  return (
    <MainCard title={<Typography variant="h6">Raise Ticket</Typography>}>
      {successMessage && (
        <Alert severity="success" sx={{ mb: 2 }} onClose={() => setSuccessMessage('')}>
          {successMessage}
        </Alert>
      )}

      {errorMessage && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setErrorMessage('')}>
          {errorMessage}
        </Alert>
      )}

      <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={handleSubmitClick} enableReinitialize>
        {({ isSubmitting, resetForm, values, setFieldValue, handleSubmit }) => (
          <>
            <Form>
              <Grid container spacing={2} alignItems="flex-start" sx={{ p: 2 }}>
                <Grid item xs={12} sm={6} md={3}>
                  <CustomParagraphLight>
                    Category <ValidationStar />
                  </CustomParagraphLight>
                  <Field
                    as={SelectFieldPadding}
                    name="category"
                    fullWidth
                    size="small"
                    onChange={(e) => {
                      const val = e.target.value;
                      setFieldValue('category', val);
                      onCategoryChange(val, setFieldValue);
                    }}
                  >
                    <MenuItem value="">
                      <em>Select Category</em>
                    </MenuItem>
                    {categories.map((c) => (
                      <MenuItem key={c.category_id} value={c.category_id}>
                        {c.category_name ?? c.name}
                      </MenuItem>
                    ))}
                  </Field>
                  <ErrorMessage name="category" component="div" style={errorMessageStyle} />
                </Grid>

                <Grid item xs={12} sm={6} md={3}>
                  <CustomParagraphLight>
                    Sub Category <ValidationStar />
                  </CustomParagraphLight>
                  <Field
                    as={SelectFieldPadding}
                    name="subCategory"
                    fullWidth
                    size="small"
                    onChange={(e) => {
                      const val = e.target.value;
                      setFieldValue('subCategory', val);
                      onSubCategoryChange(val, setFieldValue);
                    }}
                  >
                    <MenuItem value="">
                      <em>Select Subcategory</em>
                    </MenuItem>
                    {subcategories.map((s) => (
                      <MenuItem key={s.subcategory_id} value={s.subcategory_id}>
                        {s.subcategory_name ?? s.name}
                      </MenuItem>
                    ))}
                  </Field>
                  <ErrorMessage name="subCategory" component="div" style={errorMessageStyle} />
                </Grid>

                <Grid item xs={12} sm={6} md={3}>
                  <CustomParagraphLight>
                    Issue Type <ValidationStar />
                  </CustomParagraphLight>
                  <Field
                    as={SelectFieldPadding}
                    name="issueType"
                    fullWidth
                    size="small"
                    onChange={(e) => {
                      const val = e.target.value;
                      setFieldValue('issueType', val);
                      onIssueTypeChange(val, setFieldValue, values);
                    }}
                  >
                    <MenuItem value="">
                      <em>Select Issue Type</em>
                    </MenuItem>
                    {issueTypes.map((it) => (
                      <MenuItem key={it.issue_type_id ?? it.id} value={it.issue_type_id ?? it.id}>
                        {it.name ?? it.issue_type ?? it.name}
                      </MenuItem>
                    ))}
                    <MenuItem key="other" value="Other">
                      Other
                    </MenuItem>
                  </Field>
                  <ErrorMessage name="issueType" component="div" style={errorMessageStyle} />
                </Grid>

                {values.issueType === 'Other' && (
                  <Grid item xs={12} sm={6} md={3}>
                    <Typography variant="body2">Issue Name</Typography>
                    <Field as={FieldPadding} name="issueName" fullWidth />
                    <ErrorMessage name="issueName" component="div" style={errorMessageStyle} />
                  </Grid>
                )}

                <Grid item xs={12} sm={6} md={3}>
                  <CustomParagraphLight>
                    Priority <ValidationStar />
                  </CustomParagraphLight>
                  {/* Priority is editable ONLY when Issue Type === 'Other' */}
                  <Field
                    as={SelectFieldPadding}
                    name="priority"
                    fullWidth
                    size="small"
                    disabled={String(values.issueType) !== 'Other'}
                  >
                    <MenuItem value="">
                      <em>Select priority</em>
                    </MenuItem>
                    {priorities.map((p) => (
                      <MenuItem key={p.priority_id ?? p.id} value={p.priority_id ?? p.id}>
                        {p.name}
                      </MenuItem>
                    ))}
                  </Field>
                  <Typography variant="caption" color="textSecondary" sx={{ display: 'block', mt: 0.5 }}>
                    {String(values.issueType) === 'Other'
                      ? 'You can choose priority for Other issue types.'
                      : 'Priority is set by Issue Type and cannot be changed.'}
                  </Typography>
                  <ErrorMessage name="priority" component="div" style={errorMessageStyle} />
                </Grid>

                <Grid item xs={12}>
                  <CustomParagraphLight>
                    Screenshots / Documents <ValidationStar />
                  </CustomParagraphLight>
                  <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', mb: 2 }}>
                    <Button component="label" variant="outlined" startIcon={<CloudUploadIcon />} size="small">
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
                    {values.files && values.files.length > 0 && (
                      <Button variant="outlined" color="error" size="small" onClick={() => handleRemoveAllFiles(setFieldValue)}>
                        Remove All
                      </Button>
                    )}
                    {values.files && values.files.length > 0 && (
                      <Typography variant="body2" color="textSecondary">
                        Total: {values.files.length} files ({formatFileSize(getTotalFilesSize(values.files))})
                      </Typography>
                    )}
                  </Box>

                  {values.files && values.files.length > 0 && (
                    <Box sx={{ mt: 2 }}>
                      <Grid container spacing={2}>
                        {values.files.map((file, idx) => (
                          <Grid item xs={12} sm={6} md={4} lg={3} key={idx}>
                            <Card variant="outlined" sx={{ position: 'relative' }}>
                              <CardContent sx={{ p: 1.5 }}>
                                <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 1 }}>
                                  <Typography variant="body2" sx={{ flexGrow: 1, fontSize: '0.8rem', wordBreak: 'break-word' }}>
                                    {getFileIcon(file.type)} {file.name}
                                  </Typography>
                                  <IconButton size="small" onClick={() => handleRemoveFile(idx, setFieldValue, values)} color="error" sx={{ ml: 0.5 }}>
                                    <DeleteIcon fontSize="small" />
                                  </IconButton>
                                </Box>
                                <Typography variant="caption" color="textSecondary" display="block">
                                  {formatFileSize(file.size)} • {file.type?.split('/')[1] || file.type}
                                </Typography>
                                <Box sx={{ display: 'flex', gap: 0.5, mt: 1.5 }}>
                                  <Button size="small" startIcon={<VisibilityIcon />} onClick={() => handlePreviewFile(file)} variant="outlined" fullWidth sx={{ fontSize: '0.7rem' }}>
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
                    onChange={(val) => setFieldValue('comments', val)}
                    modules={{
                      toolbar: [['bold', 'italic'], [{ list: 'ordered' }, { list: 'bullet' }], ['link'], ['clean']]
                    }}
                    style={{ height: '150px', marginBottom: '60px' }}
                  />
                  <ErrorMessage name="comments" component="div" style={errorMessageStyle} />
                </Grid>

                <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
                  <CustomRefreshBtn
                    type="button"
                    variant="contained"
                    onClick={() => {
                      resetForm();
                      if (selectedFileUrl) URL.revokeObjectURL(selectedFileUrl);
                    }}
                    disabled={isSubmitting}
                  >
                    Reset
                  </CustomRefreshBtn>

                  {/* Submit always enabled (files optional) */}
                  <SubmitButton type="button" variant="contained" onClick={() => handleSubmit()} disabled={isSubmitting}>
                    {isSubmitting ? 'Submitting...' : 'Submit Ticket'}
                  </SubmitButton>
                </Grid>
              </Grid>
            </Form>

            <Dialog open={confirmDialogOpen} onClose={() => setConfirmDialogOpen(false)}>
              <DialogTitle>Confirm Raise Ticket</DialogTitle>
              <DialogContent>
                <DialogContentText>
                  Are you sure you want to raise this ticket? This action cannot be undone.
                  <br />
                  <strong>Files to upload: {submitValues?.values?.files?.length ?? 0}</strong>
                </DialogContentText>
              </DialogContent>
              <DialogActions>
                <NoButton onClick={() => setConfirmDialogOpen(false)}>Cancel</NoButton>
                <YesButton onClick={handleConfirmSubmit} disabled={isLoading}>
                  {isLoading ? 'Submitting...' : 'Yes, Raise Ticket'}
                </YesButton>
              </DialogActions>
            </Dialog>

            <FilePreviewDialog open={previewDialogOpen} onClose={handleClosePreview} file={selectedFile} fileUrl={selectedFileUrl} />
          </>
        )}
      </Formik>
    </MainCard>
  );
};

export default TicketForm;
