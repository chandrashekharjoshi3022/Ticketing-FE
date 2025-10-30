// src/pages/master/ExceptionMaster.jsx
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
import { fetchExceptions, createException, updateException, deleteException, clearExceptionError } from 'features/exceptions/exceptionSlice';
import { toast } from 'react-toastify';

export default function Exceptions() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { items: exceptionItems = [], loading = false, error = null } = useSelector((s) => s.exceptions || {});

  const [editingException, setEditingException] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [exceptionToDelete, setExceptionToDelete] = useState(null);

  useEffect(() => {
    dispatch(fetchExceptions());
  }, [dispatch]);

  useEffect(() => {
    if (error) console.error('Exception error:', error);
  }, [error]);

  const handleBackClick = () => navigate('/mastertab');

  const handleEdit = (row) => {
    setEditingException(row);
  };

  const handleDeleteClick = (row) => {
    setExceptionToDelete(row);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!exceptionToDelete) return;
    await dispatch(deleteException(exceptionToDelete.exception_id ?? exceptionToDelete.id)).unwrap();
    setDeleteDialogOpen(false);
    setExceptionToDelete(null);
    await dispatch(fetchExceptions());
  };

  const handleDeleteCancel = () => {
    setDeleteDialogOpen(false);
    setExceptionToDelete(null);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-GB');
  };

  const formatTime = (timeString) => {
    if (!timeString) return '-';
    return new Date(`1970-01-01T${timeString}`).toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: true 
    });
  };

  const columns = [
    { 
      field: 'date', 
      headerName: 'Date', 
      width: 120,
      valueFormatter: (params) => (params.value)
    },
    { 
      field: 'type', 
      headerName: 'Type', 
      width: 120,
      renderCell: (params) => {
        const type = params.value;
        const color = type === 'holiday' ? 'red' : 'orange';
        return (
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Typography sx={{ color, fontWeight: 'bold', textTransform: 'capitalize' }}>{type}</Typography>
          </Box>
        );
      }
    },
    { 
      field: 'open_time', 
      headerName: 'Open Time', 
      width: 120,
      renderCell: (params) => (params?.value) || '-'
    },
    { 
      field: 'close_time', 
      headerName: 'Close Time', 
      width: 120,
      renderCell: (params) => (params?.value) || '-'
    },
    { 
      field: 'working_hour', 
      headerName: 'Working Hours', 
      width: 130,
      renderCell: (params) => params?.value || '0 hrs'
    },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 120,
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

  const rows = (exceptionItems || []).map((e, idx) => ({
    id: idx + 1,
    exception_id: e.exception_id ?? e.id,
    date: e.date,
    open_time: e.open_time,
    close_time: e.close_time,
    type: e.type,
    working_hour: e.working_hour,
    created_by: e.created_by ?? '-',
    updated_by: e.updated_by ?? '-'
  }));


  console.log(rows , "here is the full rows")

  const initialValues = {
    date: editingException ? editingException.date : '',
    type: editingException ? editingException.type : 'half day',
    open_time: editingException ? editingException.open_time : '',
    close_time: editingException ? editingException.close_time : ''
  };

  const validationSchema = Yup.object({
    date: Yup.date().required('Date is required'),
    type: Yup.string().required('Type is required'),
    open_time: Yup.string().when('type', {
      is: 'half day',
      then: (schema) => schema.required('Open time is required for half day'),
      otherwise: (schema) => schema.nullable()
    }),
    close_time: Yup.string().when('type', {
      is: 'half day',
      then: (schema) => schema.required('Close time is required for half day'),
      otherwise: (schema) => schema.nullable()
    })
  });

  const handleSubmit = async (values, { resetForm }) => {
    const payload = {
      date: values.date,
      type: values.type,
      open_time: values.type === 'half day' ? values.open_time : null,
      close_time: values.type === 'half day' ? values.close_time : null
    };

    try {
      if (editingException) {
        await dispatch(updateException({ exception_id: editingException.exception_id, payload })).unwrap();
      } else {
        await dispatch(createException(payload)).unwrap();
      }
      await dispatch(fetchExceptions()).unwrap();
      resetForm();
      setEditingException(null);
      toast.success('Exception Submit Successfully', { autoClose: 2000 });
    } catch (err) {
      console.error('Error submitting exception:', err);
      if (err.message) {
        toast.error(err.message);
      }
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
              <span>Exception Management</span>
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
              key={editingException ? editingException.exception_id : 'new'}
            >
              {({ resetForm, values, setFieldValue }) => (
                <Form>
                  <Box p={1}>
                    <Grid container spacing={2} alignItems="center">
                      <Grid item xs={12} sm={2}>
                        <CustomParagraphLight>
                          Date<ValidationStar>*</ValidationStar>
                        </CustomParagraphLight>
                        <Field as={FieldPadding} name="date" type="date" fullWidth size="small" />
                        <ErrorMessage name="date" component="div" style={errorMessageStyle} />
                      </Grid>

                      <Grid item xs={12} sm={2}>
                        <CustomParagraphLight>
                          Type<ValidationStar>*</ValidationStar>
                        </CustomParagraphLight>
                        <Field as={SelectFieldPadding} name="type" fullWidth onChange={(e) => {
                          setFieldValue('type', e.target.value);
                          if (e.target.value === 'holiday') {
                            setFieldValue('open_time', '');
                            setFieldValue('close_time', '');
                          }
                        }}>
                          <MenuItem value="half day">Half Day</MenuItem>
                          <MenuItem value="holiday">Holiday</MenuItem>
                        </Field>
                        <ErrorMessage name="type" component="div" style={errorMessageStyle} />
                      </Grid>

                      {values.type === 'half day' && (
                        <>
                          <Grid item xs={12} sm={2}>
                            <CustomParagraphLight>
                              Open Time<ValidationStar>*</ValidationStar>
                            </CustomParagraphLight>
                            <Field as={FieldPadding} name="open_time" type="time" fullWidth size="small" />
                            <ErrorMessage name="open_time" component="div" style={errorMessageStyle} />
                          </Grid>

                          <Grid item xs={12} sm={2}>
                            <CustomParagraphLight>
                              Close Time<ValidationStar>*</ValidationStar>
                            </CustomParagraphLight>
                            <Field as={FieldPadding} name="close_time" type="time" fullWidth size="small" />
                            <ErrorMessage name="close_time" component="div" style={errorMessageStyle} />
                          </Grid>
                        </>
                      )}

                      <Grid item xs={12} sm={1} display={'flex'} alignSelf={'flex-end'} justifyContent={'end'}>
                        <SubmitButton type="submit" variant="contained">
                          {editingException ? 'Update' : 'Submit'}
                        </SubmitButton>
                      </Grid>

                      <Grid item xs={12} sm={1} display={'flex'} alignSelf={'flex-end'}>
                        <CustomRefreshBtn
                          onClick={() => {
                            resetForm();
                            setEditingException(null);
                            dispatch(fetchExceptions());
                            dispatch(clearExceptionError());
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
                <DialogContentText>Are you sure you want to delete this exception?</DialogContentText>
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