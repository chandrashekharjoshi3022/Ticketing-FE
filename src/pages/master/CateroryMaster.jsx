// src/pages/master/CateroryMaster.jsx
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
  IconButton
} from '@mui/material';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import MainCard from 'components/MainCard';
import { DataGrid } from '@mui/x-data-grid';
import { errorMessageStyle } from 'components/StyleComponent';
import ValidationStar from 'components/ValidationStar';
import FieldPadding from 'components/FieldPadding';
import SelectFieldPadding from 'components/selectFieldPadding';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { useNavigate } from 'react-router-dom';
import PlusButton from 'components/CustomButton';
import { useEffect, useState } from 'react';
import { NoButton, YesButton } from 'components/DialogActionsButton';
import SubmitButton from 'components/CustomSubmitBtn';
import CustomRefreshBtn from 'components/CustomRefreshBtn';
import CustomParagraphLight from 'components/CustomParagraphLight';
import LoaderLogo from 'components/LoaderLogo';
import gridStyle from 'utils/gridStyle';

import { useDispatch, useSelector } from 'react-redux';
import { fetchCategories, createCategory, updateCategory, deleteCategory, clearCategoryError } from 'features/categories/categorySlice';
import { toast } from 'react-toastify';

export default function CateroryMaster() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { items: categoryItems = [], loading = false, error = null } = useSelector((s) => s.categories || {});

  const [editingCategory, setEditingCategory] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState(null);

  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  useEffect(() => {
    if (error) console.error('Category error:', error);
  }, [error]);

  const handleBackClick = () => navigate('/mastertab');

  const handleEdit = (row) => {
    setEditingCategory(row);
  };

  const handleDeleteClick = (row) => {
    setCategoryToDelete(row);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!categoryToDelete) return;
    await dispatch(deleteCategory(categoryToDelete.category_id ?? categoryToDelete.id)).unwrap();
    setDeleteDialogOpen(false);
    setCategoryToDelete(null);
    await dispatch(fetchCategories());
  };

  const handleDeleteCancel = () => {
    setDeleteDialogOpen(false);
    setCategoryToDelete(null);
  };

  const columns = [
    { field: 'name', headerName: 'Name', width: 250 },
    { field: 'description', headerName: 'Description', width: 250 },
    {
      field: 'status',
      headerName: 'Status',
      width: 120,
      renderCell: (params) => {
        const status = params.value;
        const color = status === 'Active' ? 'green' : 'red';
        return (
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Typography sx={{ color, fontWeight: 'bold' }}>{status}</Typography>
          </Box>
        );
      }
    },
    // { field: 'createdby', headerName: 'Created By', width: 160 },
    // { field: 'updatedby', headerName: 'Updated By', width: 160 },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 160,
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

  const rows = (categoryItems || []).map((c, idx) => ({
    id: idx + 1,
    category_id: c.category_id ?? c.id,
    name: c.name ?? c.category_name ?? 'Unnamed',
    status: c.is_active ? 'Active' : 'Inactive',
    description: c.description ?? '',
    createdby: c.created_by ?? '-',
    updatedby: c.updated_by ?? '-'
  }));

  const initialValues = {
    categoryName: editingCategory ? editingCategory.name : '',
    description: editingCategory ? editingCategory.description : '',
    status: editingCategory ? (editingCategory.status === 'Active' ? '1' : '0') : '1'
  };

  const validationSchema = Yup.object({
    categoryName: Yup.string().required('Category name is required'),
    status: Yup.string().required('Status is required'),
    description: Yup.string().nullable()
  });

  const handleSubmit = async (values, { resetForm }) => {
    const payload = {
      name: values.categoryName,
      description: values.description || null,
      is_active: values.status === '1'
    };

    try {
      if (editingCategory) {
        await dispatch(updateCategory({ category_id: editingCategory.category_id, payload })).unwrap();
      } else {
        await dispatch(createCategory(payload)).unwrap();
      }
      await dispatch(fetchCategories()).unwrap();
      resetForm();
      setEditingCategory(null);
      toast.success('Category Submit Successfully', { autoClose: 2000 });
    } catch (err) {
      console.error('Error submitting category:', err);
    }
  };

  return (
    <>
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '50vh' }}>
          <LoaderLogo />
        </Box>
      ) : (
        <MainCard
          title={
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontWeight: 600 }}>
              <span>Category</span>
              <PlusButton label="Back" onClick={handleBackClick} />
            </Box>
          }
        >
          <Box sx={{ height: '85dvh', overflowY: 'scroll' }}>
            <Formik
              enableReinitialize
              initialValues={initialValues}
              validationSchema={validationSchema}
              onSubmit={handleSubmit}
              key={editingCategory ? editingCategory.category_id : 'new'}
            >
              {({ resetForm }) => (
                <Form>
                  <Box p={1}>
                    <Grid container spacing={2} alignItems="center">
                      <Grid item xs={12} sm={2}>
                        <CustomParagraphLight>
                          Category Name<ValidationStar>*</ValidationStar>
                        </CustomParagraphLight>
                        <Field as={FieldPadding} name="categoryName" fullWidth size="small" />
                        <ErrorMessage name="categoryName" component="div" style={errorMessageStyle} />
                      </Grid>

                      <Grid item xs={12} sm={2}>
                        <CustomParagraphLight>Description</CustomParagraphLight>
                        <Field as={FieldPadding} name="description" fullWidth size="small" />
                        <ErrorMessage name="description" component="div" style={errorMessageStyle} />
                      </Grid>

                      <Grid item xs={12} sm={2}>
                        <CustomParagraphLight>
                          Status<ValidationStar>*</ValidationStar>
                        </CustomParagraphLight>
                        <Field as={SelectFieldPadding} name="status" fullWidth>
                          <MenuItem value="1">Active</MenuItem>
                          <MenuItem value="0">Inactive</MenuItem>
                        </Field>
                        <ErrorMessage name="status" component="div" style={errorMessageStyle} />
                      </Grid>

                      <Grid item xs={12} sm={1} display={'flex'} alignSelf={'flex-end'} justifyContent={'end'}>
                        <SubmitButton type="submit" variant="contained">
                          {editingCategory ? 'Update' : 'Submit'}
                        </SubmitButton>
                      </Grid>

                      <Grid item xs={12} sm={1} display={'flex'} alignSelf={'flex-end'}>
                        <CustomRefreshBtn
                          onClick={() => {
                            resetForm();
                            setEditingCategory(null);
                            dispatch(fetchCategories());
                            dispatch(clearCategoryError());
                          }}
                        >
                          Refresh
                        </CustomRefreshBtn>
                      </Grid>
                    </Grid>
                  </Box>
                </Form>
              )}
            </Formik>

            <DataGrid
              getRowHeight={() => 'auto'}
              sx={{ ...gridStyle, height: '72vh', mt: 2 }}
              rows={rows}
              columns={columns}
              loading={loading}
              pageSizeOptions={[10, 25, 50]}
              initialState={{ pagination: { paginationModel: { pageSize: 10 } } }}
            />

            <Dialog open={deleteDialogOpen} onClose={handleDeleteCancel}>
              <DialogTitle>Confirm Deletion</DialogTitle>
              <DialogContent>
                <DialogContentText>Are you sure you want to delete this category?</DialogContentText>
              </DialogContent>
              <DialogActions>
                <NoButton onClick={handleDeleteCancel}>
                  <span>No</span>
                </NoButton>
                <YesButton onClick={handleDeleteConfirm}>
                  <span>Yes</span>
                </YesButton>
              </DialogActions>
            </Dialog>
          </Box>
        </MainCard>
      )}
    </>
  );
}
