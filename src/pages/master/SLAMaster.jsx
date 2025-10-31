// src/pages/master/SLAMaster.jsx
import React, { useEffect, useState } from 'react';
import {
  Box,
  Grid,
  MenuItem,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Typography,
  Chip
} from '@mui/material';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import MainCard from 'components/MainCard';
import { DataGrid } from '@mui/x-data-grid';
import FieldPadding from 'components/FieldPadding';
import SelectFieldPadding from 'components/selectFieldPadding';
import SubmitButton from 'components/CustomSubmitBtn';
import CustomRefreshBtn from 'components/CustomRefreshBtn';
import PlusButton from 'components/CustomButton';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import LoaderLogo from 'components/LoaderLogo';
import { NoButton, YesButton } from 'components/DialogActionsButton';
import gridStyle from 'utils/gridStyle';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router';
import { errorMessageStyle } from 'components/StyleComponent';
import { toast } from 'react-toastify';
import CustomParagraphLight from 'components/CustomParagraphLight';
import ValidationStar from 'components/ValidationStar';

import {
  fetchSLAs,
  createSLA,
  updateSLA,
  deleteSLA,
  fetchUsers,
  fetchIssueTypes,
  clearSLAError,
  setEditing
} from 'features/sla/slaSlice';

export default function SLAMaster() {
  const dispatch = useDispatch();
  const { 
    items: slas = [], 
    users = [], 
    issueTypes = [], 
    loading,
    usersLoading,
    issueTypesLoading
  } = useSelector((s) => s.sla || {});
  
  const [editing, setEditing] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [toDelete, setToDelete] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(fetchSLAs());
    dispatch(fetchUsers());
    dispatch(fetchIssueTypes());
  }, [dispatch]);

  const rows = (slas || []).map((s, idx) => ({
    id: s.sla_id ?? s.id ?? idx + 1,
    sla_id: s.sla_id ?? s.id,
    user_id: s.user_id,
    user_name: s.user ? `${s.user.first_name} ${s.user.last_name}` : `User ${s.user_id}`,
    username: s.user?.username,
    issue_type_id: s.issue_type_id,
    issue_type_name: s.issue_type ? s.issue_type.name : 'Unknown',
    sla_name: s.name,
    response_target_minutes: s.response_target_minutes,
    resolve_target_minutes: s.resolve_target_minutes,
    response_time: `${s.response_target_minutes} hours`,
    resolve_time: `${s.resolve_target_minutes} hours`,
    created_on: new Date(s.created_on).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    }),
    status: s.is_active ? 'Active' : 'Inactive',
    created_by: s.created_by,
    updated_by: s.updated_by
  }));

  const columns = [
    { 
      field: 'user_name', 
      headerName: 'User', 
      width: 180,
      renderCell: (params) => (
        <Box>
          <Typography variant="body2" fontWeight="bold">
            {params.value}
          </Typography>
          <Typography variant="caption" color="textSecondary">
            {params.row.username}
          </Typography>
        </Box>
      )
    },
    { 
      field: 'issue_type_name', 
      headerName: 'Issue Type', 
      width: 160 
    },
    { 
      field: 'sla_name', 
      headerName: 'SLA Name', 
      width: 150 
    },
    { 
      field: 'response_time', 
      headerName: 'Response Time', 
      width: 130,
      renderCell: (params) => (
        <Typography variant="body2" fontWeight="medium">
          {params.value}
        </Typography>
      )
    },
    { 
      field: 'resolve_time', 
      headerName: 'Resolve Time', 
      width: 130,
      renderCell: (params) => (
        <Typography variant="body2" fontWeight="medium">
          {params.value}
        </Typography>
      )
    },
    { 
      field: 'created_on', 
      headerName: 'Created On', 
      width: 110 
    },
    { 
      field: 'status', 
      headerName: 'Status', 
      width: 90,
      renderCell: (params) => (
        <Chip 
          label={params.value} 
          size="small"
          color={params.value === 'Active' ? "success" : "error"}
          variant="filled"
        />
      )
    },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 110,
      renderCell: (params) => (
        <Box sx={{ display: 'flex', gap: 1 }}>
          <IconButton 
            color="primary" 
            size="small" 
            onClick={() => setEditing(params.row)}
            title="Edit SLA"
          >
            <EditIcon />
          </IconButton>
          <IconButton
            color="error"
            size="small"
            onClick={() => {
              setToDelete(params.row);
              setDeleteDialogOpen(true);
            }}
            title="Delete SLA"
          >
            <DeleteIcon />
          </IconButton>
        </Box>
      )
    }
  ];

  const initialValues = {
    user_id: editing ? editing.user_id : '',
    issue_type_id: editing ? editing.issue_type_id : '',
    name: editing ? editing.sla_name : '',
    response_target_minutes: editing ? editing.response_target_minutes : 2,
    resolve_target_minutes: editing ? editing.resolve_target_minutes : 8,
    status: editing ? (editing.status === 'Active' ? '1' : '0') : '1'
  };

  const validationSchema = Yup.object({
    user_id: Yup.number().required('User is required'),
    issue_type_id: Yup.number().required('Issue Type is required'),
    name: Yup.string()
      .required('SLA Name is required')
      .min(2, 'SLA Name must be at least 2 characters')
      .max(150, 'SLA Name must be less than 150 characters'),
    response_target_minutes: Yup.number()
      .required('Response Time is required')
      .min(1, 'Response Time must be at least 1 minute')
      .max(525600, 'Response Time must be less than 1 year'),
    resolve_target_minutes: Yup.number()
      .required('Resolve Time is required')
      .min(1, 'Resolve Time must be at least 1 minute')
      .max(525600, 'Resolve Time must be less than 1 year'),
    status: Yup.string().required('Status is required')
  });

  const handleSubmit = async (values, { resetForm }) => {
    const payload = {
      user_id: Number(values.user_id),
      issue_type_id: Number(values.issue_type_id),
      name: values.name.trim(),
      response_target_minutes: Number(values.response_target_minutes),
      resolve_target_minutes: Number(values.resolve_target_minutes),
      is_active: values.status === '1'
    };

    try {
      if (editing) {
        await dispatch(updateSLA({ 
          id: editing.sla_id, 
          payload 
        })).unwrap();
        toast.success('SLA updated successfully', { autoClose: 2000 });
      } else {
        await dispatch(createSLA(payload)).unwrap();
        toast.success('SLA created successfully', { autoClose: 2000 });
      }
      
      await dispatch(fetchSLAs());
      resetForm();
      setEditing(null);
    } catch (err) {
      console.error('Submit SLA error', err);
      const errorMsg = err.message || 'Failed to submit SLA';
      toast.error(errorMsg, { autoClose: 3000 });
    }
  };

  const handleDeleteConfirm = async () => {
    if (!toDelete) return;
    try {
      await dispatch(deleteSLA(toDelete.sla_id)).unwrap();
      setDeleteDialogOpen(false);
      setToDelete(null);
      await dispatch(fetchSLAs());
      toast.success('SLA deactivated successfully', { autoClose: 2000 });
    } catch (err) {
      console.error('Delete SLA error', err);
      const errorMsg = err.message || 'Failed to delete SLA';
      toast.error(errorMsg, { autoClose: 3000 });
    }
  };

  const handleBackClick = () => navigate('/mastertab');

  const handleRefresh = () => {
    dispatch(fetchSLAs());
    dispatch(fetchUsers());
    dispatch(fetchIssueTypes());
    dispatch(clearSLAError());
  };

  const isLoading = loading || usersLoading || issueTypesLoading;

  return (
    <MainCard
      title={
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontWeight: 600 }}>
          <span>SLA Master</span>
          <PlusButton label="Back" onClick={handleBackClick} />
        </Box>
      }
    >
      <Box sx={{ height: '80dvh', overflowY: 'auto' }}>
        {isLoading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 200 }}>
            <LoaderLogo />
          </Box>
        ) : (
          <>
            <Formik
              enableReinitialize
              initialValues={initialValues}
              validationSchema={validationSchema}
              onSubmit={handleSubmit}
              key={editing ? editing.sla_id : 'new'}
            >
              {({ resetForm, isSubmitting }) => (
                <Form>
                  <Grid container spacing={2} alignItems="flex-end" sx={{ mb: 2 }}>
                    <Grid item xs={12} sm={2}>
                      <CustomParagraphLight>
                        User<ValidationStar>*</ValidationStar>
                      </CustomParagraphLight>
                      <Field as={SelectFieldPadding} name="user_id" fullWidth disabled={isSubmitting}>
                        <MenuItem value="">Select User</MenuItem>
                        {users.map((user) => (
                          <MenuItem key={user.user_id} value={user.user_id}>
                            {user.first_name} {user.last_name} ({user.username})
                          </MenuItem>
                        ))}
                      </Field>
                      <ErrorMessage name="user_id" component="div" style={errorMessageStyle} />
                    </Grid>

                    <Grid item xs={12} sm={2}>
                      <CustomParagraphLight>
                        Issue Type<ValidationStar>*</ValidationStar>
                      </CustomParagraphLight>
                      <Field as={SelectFieldPadding} name="issue_type_id" fullWidth disabled={isSubmitting}>
                        <MenuItem value="">Select Issue Type</MenuItem>
                        {issueTypes.map((issueType) => (
                          <MenuItem key={issueType.issue_type_id} value={issueType.issue_type_id}>
                            {issueType.name}
                          </MenuItem>
                        ))}
                      </Field>
                      <ErrorMessage name="issue_type_id" component="div" style={errorMessageStyle} />
                    </Grid>

                    <Grid item xs={12} sm={2}>
                      <CustomParagraphLight>
                        SLA Name<ValidationStar>*</ValidationStar>
                      </CustomParagraphLight>
                      <Field 
                        as={FieldPadding} 
                        name="name" 
                        placeholder="SLA Name" 
                        fullWidth 
                        disabled={isSubmitting}
                      />
                      <ErrorMessage name="name" component="div" style={errorMessageStyle} />
                    </Grid>

                    <Grid item xs={12} sm={1.5}>
                      <CustomParagraphLight>
                        Response Time (hours)<ValidationStar>*</ValidationStar>
                      </CustomParagraphLight>
                      <Field 
                        as={FieldPadding} 
                        name="response_target_minutes" 
                        type="number"
                        placeholder="Response minutes" 
                        fullWidth 
                        disabled={isSubmitting}
                      />
                      <ErrorMessage name="response_target_minutes" component="div" style={errorMessageStyle} />
                    </Grid>

                    <Grid item xs={12} sm={1.5}>
                      <CustomParagraphLight>
                        Resolve Time (hours)<ValidationStar>*</ValidationStar>
                      </CustomParagraphLight>
                      <Field 
                        as={FieldPadding} 
                        name="resolve_target_minutes" 
                        type="number"
                        placeholder="Resolve minutes" 
                        fullWidth 
                        disabled={isSubmitting}
                      />
                      <ErrorMessage name="resolve_target_minutes" component="div" style={errorMessageStyle} />
                    </Grid>

                    <Grid item xs={12} sm={1}>
                      <CustomParagraphLight>
                        Status<ValidationStar>*</ValidationStar>
                      </CustomParagraphLight>
                      <Field as={SelectFieldPadding} name="status" fullWidth disabled={isSubmitting}>
                        <MenuItem value="1">Active</MenuItem>
                        <MenuItem value="0">Inactive</MenuItem>
                      </Field>
                      <ErrorMessage name="status" component="div" style={errorMessageStyle} />
                    </Grid>

                    <Grid item xs={12} sm={2} display="flex" gap={1}>
                      <SubmitButton 
                        type="submit" 
                        variant="contained" 
                        disabled={isSubmitting}
                        fullWidth
                      >
                        {editing ? 'Update' : 'Create'}
                      </SubmitButton>
                      <CustomRefreshBtn
                        onClick={() => {
                          resetForm();
                          setEditing(null);
                          handleRefresh();
                        }}
                        disabled={isSubmitting}
                        fullWidth
                      >
                        Refresh
                      </CustomRefreshBtn>
                    </Grid>
                  </Grid>

                  {editing && (
                    <Box sx={{ mb: 2, p: 1, bgcolor: 'info.light', borderRadius: 1 }}>
                      <Typography variant="body2" color="info.dark">
                        <strong>Editing:</strong> {editing.user_name} - {editing.issue_type_name} - {editing.sla_name}
                        <IconButton 
                          size="small" 
                          onClick={() => setEditing(null)}
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

            <DataGrid
              getRowHeight={() => 'auto'}
              sx={{ ...gridStyle, height: '60vh' }}
              rows={rows}
              columns={columns}
              pageSizeOptions={[10, 25, 50]}
              initialState={{ 
                pagination: { paginationModel: { pageSize: 10 } },
                sorting: { sortModel: [{ field: 'created_on', sort: 'desc' }] }
              }}
              loading={loading}
              disableRowSelectionOnClick
            />
          </>
        )}

        <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)} maxWidth="sm" fullWidth>
          <DialogTitle>Confirm Deactivate</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Are you sure you want to deactivate the SLA for "{toDelete?.user_name}" - "{toDelete?.issue_type_name}" - "{toDelete?.sla_name}"? 
              This will make it unavailable for new tickets.
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <NoButton onClick={() => setDeleteDialogOpen(false)}>
              Cancel
            </NoButton>
            <YesButton 
              onClick={handleDeleteConfirm}
              variant="contained"
              color="error"
            >
              Deactivate
            </YesButton>
          </DialogActions>
        </Dialog>
      </Box>
    </MainCard>
  );
}