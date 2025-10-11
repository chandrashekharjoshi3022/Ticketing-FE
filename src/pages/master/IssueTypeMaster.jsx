// src/pages/master/IssueTypeMaster.jsx
import {
  Box,
  Typography,
  Grid,
  MenuItem,
  IconButton,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle
} from '@mui/material';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { useEffect, useState } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { useDispatch, useSelector } from 'react-redux';

import MainCard from 'components/MainCard';
import ValidationStar from 'components/ValidationStar';
import FieldPadding from 'components/FieldPadding';
import SelectFieldPadding from 'components/selectFieldPadding';
import PlusButton from 'components/CustomButton';
import SubmitButton from 'components/CustomSubmitBtn';
import CustomRefreshBtn from 'components/CustomRefreshBtn';
import CustomParagraphLight from 'components/CustomParagraphLight';
import LoaderLogo from 'components/LoaderLogo';
import { YesButton, NoButton } from 'components/DialogActionsButton';
import gridStyle from 'utils/gridStyle';
import { useNavigate } from 'react-router-dom';
import { errorMessageStyle } from 'components/StyleComponent';
import { toast } from 'react-toastify';
import API from '../../api/axios'; // your API wrapper
import {
  fetchIssueTypes,
  createIssueType,
  updateIssueType,
  deleteIssueType,
  clearIssueTypeError
} from 'features/issueType/issueTypeSlice';

export default function IssueTypeMaster() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { items: issueTypes = [], loading } = useSelector((s) => s.issueType || {});
  const [priorities, setPriorities] = useState([]);
  const [editingIssueType, setEditingIssueType] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [issueTypeToDelete, setIssueTypeToDelete] = useState(null);
  const [prioritiesLoading, setPrioritiesLoading] = useState(false);

  const handleBackClick = () => navigate('/mastertab');

  useEffect(() => {
    dispatch(fetchIssueTypes());
    fetchPriorities();
  }, [dispatch]);

  const fetchPriorities = async () => {
    setPrioritiesLoading(true);
    try {
      const response = await API.get('/admin/priorities');
      const list = Array.isArray(response.data) ? response.data : Array.isArray(response.data.priorities) ? response.data.priorities : [];
      setPriorities(list);
    } catch (err) {
      console.error('Error fetching priorities:', err);
      toast.error('Failed to fetch priorities', { autoClose: 2000 });
    } finally {
      setPrioritiesLoading(false);
    }
  };

  const handleEdit = (row) => {
    setEditingIssueType(row);
  };

  const handleDeleteClick = (row) => {
    setIssueTypeToDelete(row);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!issueTypeToDelete) return;
    try {
      await dispatch(deleteIssueType(issueTypeToDelete.issue_type_id)).unwrap();
      setDeleteDialogOpen(false);
      setIssueTypeToDelete(null);
      toast.success('Issue Type deleted successfully', { autoClose: 2000 });
    } catch (err) {
      console.error('Error deleting issue type:', err);
      const errorMsg = err.message || 'Failed to delete issue type';
      toast.error(errorMsg, { autoClose: 3000 });
    }
  };

  const handleDeleteCancel = () => {
    setDeleteDialogOpen(false);
    setIssueTypeToDelete(null);
  };

  const columns = [
    { field: 'name', headerName: 'Issue Type', width: 220 },
    { field: 'priority_name', headerName: 'Priority', width: 140 },
    {
      field: 'status',
      headerName: 'Status',
      width: 120,
      renderCell: (params) => (
        <Typography sx={{ 
          color: params.value === 'Active' ? 'green' : 'red', 
          fontWeight: 'bold' 
        }}>
          {params.value}
        </Typography>
      )
    },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 150,
      renderCell: (params) => (
        <Box sx={{ display: 'flex', gap: 1 }}>
          <IconButton color="primary" size="small" onClick={() => handleEdit(params.row)}>
            <EditIcon />
          </IconButton>
          <IconButton color="error" size="small" onClick={() => handleDeleteClick(params.row)}>
            <DeleteIcon />
          </IconButton>
        </Box>
      )
    }
  ];

  const rows = (issueTypes || []).map((it, idx) => ({
    id: it.issue_type_id ?? it.id ?? idx + 1,
    issue_type_id: it.issue_type_id ?? it.id,
    name: it.name,
    priority_id: it.priority_id,
    priority_name: it.default_priority?.name ?? '-',
    status: it.is_active ? 'Active' : 'Inactive',
    description: it.description
  }));

  const initialValues = {
    name: editingIssueType ? editingIssueType.name : '',
    priority_id: editingIssueType ? editingIssueType.priority_id : '',
    description: editingIssueType ? editingIssueType.description : '',
    status: editingIssueType ? (editingIssueType.status === 'Active' ? '1' : '0') : '1'
  };

  const validationSchema = Yup.object({
    name: Yup.string()
      .required('Issue Type name is required')
      .min(2, 'Issue Type must be at least 2 characters')
      .max(150, 'Issue Type must be less than 150 characters'),
    priority_id: Yup.number().required('Priority is required'),
    status: Yup.string().required('Status is required'),
    description: Yup.string().nullable()
  });

  const handleSubmit = async (values, { resetForm }) => {
    const payload = {
      name: values.name.trim(),
      priority_id: Number(values.priority_id),
      description: values.description || null,
      is_active: values.status === '1'
    };

    try {
      if (editingIssueType) {
        await dispatch(updateIssueType({ 
          id: editingIssueType.issue_type_id, 
          payload 
        })).unwrap();
        toast.success('Issue Type updated successfully', { autoClose: 2000 });
      } else {
        await dispatch(createIssueType(payload)).unwrap();
        toast.success('Issue Type created successfully', { autoClose: 2000 });
      }
      
      await dispatch(fetchIssueTypes());
      resetForm();
      setEditingIssueType(null);
    } catch (err) {
      console.error('Error saving issue type:', err);
      const errorMsg = err.message || 'Failed to save issue type';
      toast.error(errorMsg, { autoClose: 3000 });
    }
  };

  const isLoading = loading || prioritiesLoading;

  return (
    <>
      {isLoading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '50vh' }}>
          <LoaderLogo />
        </Box>
      ) : (
        <MainCard
          title={
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontWeight: 600 }}>
              <span>Issue Type Master</span>
              <PlusButton label="Back" onClick={handleBackClick} />
            </Box>
          }
        >
          <Formik 
            initialValues={initialValues} 
            validationSchema={validationSchema} 
            onSubmit={handleSubmit} 
            enableReinitialize
          >
            {({ resetForm, isSubmitting }) => (
              <Form>
                <Grid container spacing={2} alignItems="flex-end">
                  <Grid item xs={12} sm={3}>
                    <CustomParagraphLight>
                      Issue Type <ValidationStar>*</ValidationStar>
                    </CustomParagraphLight>
                    <Field as={FieldPadding} name="name" fullWidth disabled={isSubmitting} />
                    <ErrorMessage name="name" component="div" style={errorMessageStyle} />
                  </Grid>

                  <Grid item xs={12} sm={2}>
                    <CustomParagraphLight>
                      Priority <ValidationStar>*</ValidationStar>
                    </CustomParagraphLight>
                    <Field as={SelectFieldPadding} name="priority_id" fullWidth disabled={isSubmitting}>
                      <MenuItem value="">
                        <em>Select Priority</em>
                      </MenuItem>
                      {priorities.map((p) => {
                        const id = p.priority_id ?? p.id;
                        const label = p.name;
                        return (
                          <MenuItem key={id} value={id}>
                            {label}
                          </MenuItem>
                        );
                      })}
                    </Field>
                    <ErrorMessage name="priority_id" component="div" style={errorMessageStyle} />
                  </Grid>

                  <Grid item xs={12} sm={2}>
                    <CustomParagraphLight>
                      Status <ValidationStar>*</ValidationStar>
                    </CustomParagraphLight>
                    <Field as={SelectFieldPadding} name="status" fullWidth disabled={isSubmitting}>
                      <MenuItem value="1">Active</MenuItem>
                      <MenuItem value="0">Inactive</MenuItem>
                    </Field>
                    <ErrorMessage name="status" component="div" style={errorMessageStyle} />
                  </Grid>

                  <Grid item xs={12} sm={3}>
                    <CustomParagraphLight>
                      Description
                    </CustomParagraphLight>
                    <Field as={FieldPadding} name="description" fullWidth disabled={isSubmitting} />
                    <ErrorMessage name="description" component="div" style={errorMessageStyle} />
                  </Grid>

                  <Grid item xs={12} sm={2} display="flex" gap={1}>
                    <SubmitButton type="submit" disabled={isSubmitting}>
                      {editingIssueType ? 'Update' : 'Create'}
                    </SubmitButton>
                    <CustomRefreshBtn
                      onClick={() => {
                        resetForm();
                        setEditingIssueType(null);
                        dispatch(fetchIssueTypes());
                        dispatch(clearIssueTypeError());
                      }}
                      disabled={isSubmitting}
                    >
                      Refresh
                    </CustomRefreshBtn>
                  </Grid>
                </Grid>

                {editingIssueType && (
                  <Box sx={{ mt: 2, p: 1, bgcolor: 'info.light', borderRadius: 1 }}>
                    <Typography variant="body2" color="info.dark">
                      <strong>Editing:</strong> {editingIssueType.name}
                      <IconButton 
                        size="small" 
                        onClick={() => setEditingIssueType(null)}
                        sx={{ ml: 1 }}
                      >
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </Typography>
                  </Box>
                )}
              </Form>
            )}
          </Formik>

          <Box sx={{ mt: 3 }}>
            <DataGrid 
              rows={rows} 
              columns={columns} 
              sx={gridStyle} 
              autoHeight
              loading={loading}
              pageSizeOptions={[10, 25, 50]}
              initialState={{ 
                pagination: { paginationModel: { pageSize: 10 } },
                sorting: { sortModel: [{ field: 'name', sort: 'asc' }] }
              }}
            />
          </Box>

          <Dialog open={deleteDialogOpen} onClose={handleDeleteCancel}>
            <DialogTitle>Confirm Deactivation</DialogTitle>
            <DialogContent>
              <DialogContentText>
                Are you sure you want to deactivate this Issue Type? 
                {issueTypeToDelete?.sla_count > 0 && (
                  <Typography color="error" variant="body2" sx={{ mt: 1 }}>
                    Note: This issue type is used by {issueTypeToDelete.sla_count} active SLA(s).
                  </Typography>
                )}
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <NoButton onClick={handleDeleteCancel}>Cancel</NoButton>
              <YesButton onClick={handleDeleteConfirm}>Deactivate</YesButton>
            </DialogActions>
          </Dialog>
        </MainCard>
      )}
    </>
  );
}