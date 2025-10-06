// src/pages/master/SubCategoryMaster.jsx
import React, { useEffect, useState } from 'react';
import { Box, Grid, MenuItem, IconButton, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions } from '@mui/material';
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

import {
  fetchSubCategories,
  createSubCategory,
  updateSubCategory,
  deleteSubCategory,
  clearSubcategoryError
} from 'features/subcategories/subcategorySlice';

import { fetchCategories, createCategory, updateCategory, deleteCategory } from 'features/categories/categorySlice';

export default function SubCategoryMaster() {
  const dispatch = useDispatch();
  const { items: subcategories = [], loading: subLoading } = useSelector((s) => s.subcategories || {});
  const { items: categories = [], loading: catLoading } = useSelector((s) => s.categories || {});

  const [editing, setEditing] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [toDelete, setToDelete] = useState(null);

  useEffect(() => {
    dispatch(fetchCategories());
    dispatch(fetchSubCategories());
  }, [dispatch]);

  const rows = (subcategories || []).map((s, idx) => ({
    id: idx + 1,
    subcategory_id: s.subcategory_id ?? s.id,
    name: s.name,
    category_id: s.category_id,
    category_name: s.category?.name ?? categories.find((c) => (c.category_id ?? c.id) === s.category_id)?.name ?? '',
    description: s.description ?? '',
    status: s.is_active ? 'Active' : 'Inactive'
  }));

  const columns = [
    { field: 'name', headerName: 'Name', width: 220 },
    { field: 'category_name', headerName: 'Category', width: 200 },
    { field: 'description', headerName: 'Description', width: 220, flex: 1 },
    { field: 'status', headerName: 'Status', width: 120 },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 140,
      renderCell: (params) => (
        <Box sx={{ display: 'flex', gap: 1 }}>
          <IconButton onClick={() => setEditing(params.row)}>
            <EditIcon />
          </IconButton>
          <IconButton
            color="secondary"
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
    category_id: editing ? editing.category_id : categories[0]?.category_id ?? categories[0]?.id ?? '',
    description: editing ? editing.description : '',
    status: editing ? (editing.status === 'Active' ? '1' : '0') : '1'
  };

  const validationSchema = Yup.object({
    name: Yup.string().required('Name is required'),
    category_id: Yup.mixed().required('Category is required'),
    description: Yup.string().nullable(),
    status: Yup.string().required('Status is required')
  });

  const handleSubmit = async (values, { resetForm }) => {
    const payload = {
      category_id: Number(values.category_id),
      name: values.name,
      description: values.description ?? null,
      is_active: values.status === '1'
    };
    try {
      if (editing) {
        await dispatch(updateSubCategory({ id: editing.subcategory_id, payload })).unwrap();
      } else {
        await dispatch(createSubCategory(payload)).unwrap();
      }
      await dispatch(fetchSubCategories());
      resetForm();
      setEditing(null);
    } catch (err) {
      console.error('Submit subcategory error', err);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!toDelete) return;
    try {
      await dispatch(deleteSubCategory(toDelete.subcategory_id)).unwrap();
      setDeleteDialogOpen(false);
      setToDelete(null);
      await dispatch(fetchSubCategories());
    } catch (err) {
      console.error('Delete subcategory error', err);
    }
  };

  const isLoading = subLoading || catLoading;

  return (
    <MainCard
      title={
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <span>Sub Categories</span>
          <PlusButton label="New" onClick={() => setEditing(null)} />
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
              key={editing ? editing.subcategory_id : 'new'}
            >
              {({ resetForm }) => (
                <Form>
                  <Grid container spacing={2} alignItems="center" sx={{ mb: 1 }}>
                    <Grid item xs={12} sm={2}>
                      <Field as={FieldPadding} name="name" placeholder="Sub Category Name" />
                      <ErrorMessage name="name" component="div" style={{ color: 'red' }} />
                    </Grid>

                    <Grid item xs={12} sm={2}>
                      <Field as={SelectFieldPadding} name="category_id">
                        {categories.map((c) => (
                          <MenuItem key={c.category_id ?? c.id} value={c.category_id ?? c.id}>
                            {c.name ?? c.category_name}
                          </MenuItem>
                        ))}
                      </Field>
                      <ErrorMessage name="category_id" component="div" style={{ color: 'red' }} />
                    </Grid>

                    <Grid item xs={12} sm={2}>
                      <Field as={FieldPadding} name="description" placeholder="Description" />
                      <ErrorMessage name="description" component="div" style={{ color: 'red' }} />
                    </Grid>

                    <Grid item xs={12} sm={1}>
                      <Field as={SelectFieldPadding} name="status">
                        <MenuItem value="1">Active</MenuItem>
                        <MenuItem value="0">Inactive</MenuItem>
                      </Field>
                    </Grid>

                    <Grid item xs={12} sm={1} display={'flex'} alignSelf={'flex-end'} justifyContent={'end'}>
                      <SubmitButton type="submit" variant="contained">
                        {editing ? 'Update' : 'Create'}
                      </SubmitButton>
                    </Grid>

                    <Grid item xs={12} sm={1} display={'flex'} alignSelf={'flex-end'}>
                      <CustomRefreshBtn
                        onClick={() => {
                          resetForm();
                          setEditing(null);
                          dispatch(fetchSubCategories());
                          dispatch(fetchCategories());
                          dispatch(clearSubcategoryError());
                        }}
                      >
                        Refresh
                      </CustomRefreshBtn>
                    </Grid>

                    {/* <Grid item xs={12} sm={12} display="flex" gap={1} justifyContent="flex-end">
                      <SubmitButton type="submit">{editing ? 'Update' : 'Create'}</SubmitButton>
                      <CustomRefreshBtn
                        onClick={() => {
                          resetForm();
                          setEditing(null);
                          dispatch(fetchSubCategories());
                          dispatch(fetchCategories());
                          dispatch(clearSubcategoryError());
                        }}
                      >
                        Refresh
                      </CustomRefreshBtn>
                    </Grid> */}
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
            <DialogContentText>Are you sure you want to delete this subcategory?</DialogContentText>
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
