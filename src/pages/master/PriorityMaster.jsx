// src/pages/master/PriorityMaster.jsx
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
  Typography
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

import { fetchPriorities, createPriority, updatePriority, deletePriority } from 'features/priorities/prioritySlice';
import { useNavigate } from 'react-router';
import { errorMessageStyle } from 'components/StyleComponent';

export default function PriorityMaster() {
  const dispatch = useDispatch();
  const { items: priorities = [], loading } = useSelector((s) => s.priorities || {});

  const [editing, setEditing] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [toDelete, setToDelete] = useState(null);

  useEffect(() => {
    dispatch(fetchPriorities());
  }, [dispatch]);

  const rows = (priorities || []).map((p, idx) => ({
    id: idx + 1,
    priority_id: p.priority_id ?? p.id,
    name: p.name,
    sort_order: p.sort_order ?? 100
  }));

  const columns = [
    { field: 'name', headerName: 'Priority', width: 220 },
    { field: 'sort_order', headerName: 'Sort Order', width: 120 },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 140,
      renderCell: (params) => (
        <Box sx={{ display: 'flex', gap: 1 }}>
          <IconButton  color="primary" size="small" onClick={() => setEditing(params.row)}>
            <EditIcon />
          </IconButton>
          <IconButton
            color="error" size="small"
            onClick={() => {
              setToDelete(params.row);
              setDeleteDialogOpen(true);
            }}
          >
            <DeleteIcon />
          </IconButton>
        </Box>
      )
    }
  ];

  const initialValues = {
    name: editing ? editing.name : '',
    sort_order: editing ? editing.sort_order : ''
  };

  const validationSchema = Yup.object({
    name: Yup.string().required('Name is required'),
    sort_order: Yup.number().min(0, 'Must be >=0').required('Sort order is required')
  });

  const handleSubmit = async (values, { resetForm }) => {
    const payload = { name: values.name, sort_order: Number(values.sort_order) };
    try {
      if (editing) {
        await dispatch(updatePriority({ id: editing.priority_id, payload })).unwrap();
      } else {
        await dispatch(createPriority(payload)).unwrap();
      }
      await dispatch(fetchPriorities());
      resetForm();
      setEditing(null);
    } catch (err) {
      console.error('Priority submit error', err);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!toDelete) return;
    try {
      await dispatch(deletePriority(toDelete.priority_id)).unwrap();
      setDeleteDialogOpen(false);
      setToDelete(null);
      await dispatch(fetchPriorities());
    } catch (err) {
      console.error('Delete priority error', err);
    }
  };
  const navigate = useNavigate();
  const handleBackClick = () => navigate('/mastertab');
  return (
    <MainCard
      title={
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontWeight: 600 }}>
          <span>Priority</span>
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
              key={editing ? editing.priority_id : 'new'}
            >
              {({ resetForm }) => (
                <Form>
                  <Grid container spacing={2} alignItems="center" sx={{ mb: 1 }}>
                    <Grid item xs={12} sm={2}>
                      <Field as={FieldPadding} name="name" placeholder="Priority name (e.g. High)" fullWidth sx={{ width: '100%' }} />
                      <ErrorMessage name="name" component="div" style={errorMessageStyle} />
                    </Grid>

                    <Grid item xs={12} sm={2}>
                      <Field
                        as={FieldPadding}
                        type="number"
                        name="sort_order"
                        placeholder="Sort order (lower = higher priority)"
                        fullWidth
                        sx={{ width: '100%' }}
                      />
                      <ErrorMessage name="sort_order" component="div" style={errorMessageStyle} />
                    </Grid>

                    <Grid item xs={12} sm={2} display="flex" gap={1} justifyContent="flex-end">
                      <SubmitButton type="submit">{editing ? 'Update' : 'Create'}</SubmitButton>
                      <CustomRefreshBtn
                        onClick={() => {
                          resetForm();
                          setEditing(null);
                          dispatch(fetchPriorities());
                        }}
                      >
                        Refresh
                      </CustomRefreshBtn>
                    </Grid>
                  </Grid>
                </Form>
              )}
            </Formik>

            <DataGrid
              getRowHeight={() => 'auto'}
              sx={{ ...gridStyle, height: '60vh' }}
              rows={rows}
              columns={columns}
              pageSizeOptions={[10, 25]}
            />
          </>
        )}

        <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
          <DialogTitle>Confirm Delete</DialogTitle>
          <DialogContent>
            <DialogContentText>Are you sure you want to delete this priority?</DialogContentText>
          </DialogContent>
          <DialogActions>
            <NoButton onClick={() => setDeleteDialogOpen(false)}>No</NoButton>
            <YesButton onClick={handleDeleteConfirm}>Yes</YesButton>
          </DialogActions>
        </Dialog>
      </Box>
    </MainCard>
  );
}
