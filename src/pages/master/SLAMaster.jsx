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
  clearSLAError
} from 'features/sla/slaSlice';

export default function SLAMaster() {
  const dispatch = useDispatch();
  const { items: slas = [], users = [], loading } = useSelector((s) => s.sla || {});
  const [editing, setEditing] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [toDelete, setToDelete] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(fetchSLAs());
    dispatch(fetchUsers());
  }, [dispatch]);

  const rows = (slas || []).map((s, idx) => ({
    id: s.sla_id ?? s.id ?? idx + 1,
    sla_id: s.sla_id ?? s.id,
    user_id: s.user_id,
    user_name: s.user ? `${s.user.first_name} ${s.user.last_name}` : `User ${s.user_id}`,
    username: s.user?.username,
    user_email: s.user?.email,
    issue_type: s.issue_type,
    response_target_minutes: s.response_target_minutes,
    resolve_target_minutes: s.resolve_target_minutes,
    response_time: `${s.response_target_minutes} minutes`,
    resolve_time: `${s.resolve_target_minutes} minutes`,
    created_on: new Date(s.created_on).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    }),
    status: s.is_active ? 'Active' : 'Inactive',
    created_by: s.created_by,
    updated_by: s.updated_by,
    issue_types: s.issue_types || [],
    issue_types_count: (s.issue_types || []).length
  }));

  const columns = [
    { 
      field: 'user_name', 
      headerName: 'User', 
      width: 200,
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
      field: 'issue_type', 
      headerName: 'Issue Type', 
      width: 180 
    },
    { 
      field: 'issue_types_count', 
      headerName: 'Linked Issues', 
      width: 120,
      renderCell: (params) => (
        <Chip 
          label={params.value} 
          size="small"
          color={params.value > 0 ? "primary" : "default"}
          variant={params.value > 0 ? "filled" : "outlined"}
        />
      )
    },
    { 
      field: 'response_time', 
      headerName: 'Response Time', 
      width: 140 
    },
    { 
      field: 'resolve_time', 
      headerName: 'Resolve Time', 
      width: 140 
    },
    { 
      field: 'created_on', 
      headerName: 'Created On', 
      width: 120 
    },
    { 
      field: 'status', 
      headerName: 'Status', 
      width: 100,
      renderCell: (params) => (
        <Box
          sx={{
            color: params.value === 'Active' ? 'green' : 'red',
            fontWeight: 'bold',
            fontSize: '0.875rem'
          }}
        >
          {params.value}
        </Box>
      )
    },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 120,
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
            disabled={params.row.issue_types_count > 0}
          >
            <DeleteIcon />
          </IconButton>
        </Box>
      )
    }
  ];

  const initialValues = {
    user_id: editing ? editing.user_id : '',
    issue_type: editing ? editing.issue_type : '',
    response_target_minutes: editing ? editing.response_target_minutes : 60,
    resolve_target_minutes: editing ? editing.resolve_target_minutes : 1440,
    status: editing ? (editing.status === 'Active' ? '1' : '0') : '1'
  };

  const validationSchema = Yup.object({
    user_id: Yup.number().required('User is required'),
    issue_type: Yup.string()
      .required('Issue Type is required')
      .min(2, 'Issue Type must be at least 2 characters')
      .max(150, 'Issue Type must be less than 150 characters'),
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
      issue_type: values.issue_type.trim(),
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
    dispatch(clearSLAError());
  };

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
        {loading ? (
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
                    <Grid item xs={12} sm={2.4}>
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

                    <Grid item xs={12} sm={2.4}>
                      <CustomParagraphLight>
                        Issue Type<ValidationStar>*</ValidationStar>
                      </CustomParagraphLight>
                      <Field 
                        as={FieldPadding} 
                        name="issue_type" 
                        placeholder="Enter issue type" 
                        fullWidth 
                        disabled={isSubmitting}
                      />
                      <ErrorMessage name="issue_type" component="div" style={errorMessageStyle} />
                    </Grid>

                    <Grid item xs={12} sm={1.8}>
                      <CustomParagraphLight>
                        Response Time (min)<ValidationStar>*</ValidationStar>
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

                    <Grid item xs={12} sm={1.8}>
                      <CustomParagraphLight>
                        Resolve Time (min)<ValidationStar>*</ValidationStar>
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

                    <Grid item xs={12} sm={1.2}>
                      <CustomParagraphLight>
                        Status<ValidationStar>*</ValidationStar>
                      </CustomParagraphLight>
                      <Field as={SelectFieldPadding} name="status" fullWidth disabled={isSubmitting}>
                        <MenuItem value="1">Active</MenuItem>
                        <MenuItem value="0">Inactive</MenuItem>
                      </Field>
                      <ErrorMessage name="status" component="div" style={errorMessageStyle} />
                    </Grid>

                    <Grid item xs={12} sm={1.2} display="flex" gap={1}>
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
                        <strong>Editing:</strong> {editing.user_name} - {editing.issue_type}
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
              {toDelete?.issue_types_count > 0 ? (
                <Box>
                  <Typography color="error" gutterBottom>
                    Cannot deactivate this SLA because it is linked to {toDelete.issue_types_count} active issue type(s).
                  </Typography>
                  <Typography variant="body2">
                    Please unlink the issue types before deactivating the SLA.
                  </Typography>
                </Box>
              ) : (
                `Are you sure you want to deactivate the SLA for "${toDelete?.user_name}" - "${toDelete?.issue_type}"? This will make it unavailable for new tickets.`
              )}
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <NoButton onClick={() => setDeleteDialogOpen(false)}>
              Cancel
            </NoButton>
            <YesButton 
              onClick={handleDeleteConfirm} 
              disabled={toDelete?.issue_types_count > 0}
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