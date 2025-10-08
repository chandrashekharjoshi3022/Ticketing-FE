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
import API from '../../api/axios';
import { errorMessageStyle } from 'components/StyleComponent';
import { toast } from 'react-toastify';

export default function IssueTypeMaster() {
  const navigate = useNavigate();

  const [issueTypes, setIssueTypes] = useState([]);
  // REMOVED: subcategories state
  const [slaList, setSlaList] = useState([]);
  const [priorities, setPriorities] = useState([]);
  const [editingIssueType, setEditingIssueType] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [issueTypeToDelete, setIssueTypeToDelete] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleBackClick = () => navigate('/mastertab');

  useEffect(() => {
    fetchIssueTypes();
    // REMOVED: fetchSubCategories call
    fetchSLAs();
    fetchPriorities();
  }, []);

  // fetch issue types and normalize for grid
  const fetchIssueTypes = async () => {
    setLoading(true);
    try {
      const res = await API.get('/admin/issuetypes');
      // backend likely returns { issue_types: [...] } or [...]
      const listRaw = Array.isArray(res.data) ? res.data : Array.isArray(res.data.issue_types) ? res.data.issue_types : [];

      console.log(listRaw)
      const list = listRaw.map((it, index) => ({
        id: index + 1,
        issue_type_id: it.issue_type_id ?? it.id,
        name: it.name,
        // REMOVED: subcategory-related fields
        sla_id: it.sla?.sla_id ?? it.sla_id,
        sla: it.sla?.issue_type ?? '-',
        response_time: it.sla?.response_target_minutes ?? '-',
        resolve_time: it.sla?.resolve_target_minutes ?? '-',
        priority_id: it.default_priority?.priority_id ?? it.priority_id ?? null,
        priority_name: it.default_priority?.name ?? (it.priority ? it.priority.name : null) ?? '-',
        status: it.is_active ? 'Active' : 'Inactive'
      }));
      setIssueTypes(list);
    } catch (err) {
      console.error('Error fetching issue types:', err);
      setIssueTypes([]);
    } finally {
      setLoading(false);
    }
  };

  // REMOVED: fetchSubCategories function

  // fetch SLAs
  const fetchSLAs = async () => {
    try {
      const res = await API.get('/admin/slas');
      const list = Array.isArray(res.data) ? res.data : Array.isArray(res.data.slas) ? res.data.slas : [];
      setSlaList(list);
    } catch (err) {
      console.error('Error fetching SLAs:', err);
      setSlaList([]);
    }
  };

  // fetch priorities for the new dropdown
  const fetchPriorities = async () => {
    try {
      const res = await API.get('/admin/priorities');
      // backend might respond { priorities: [...] } or [...]
      const list = Array.isArray(res.data) ? res.data : Array.isArray(res.data.priorities) ? res.data.priorities : [];
      setPriorities(list);
    } catch (err) {
      console.error('Error fetching priorities:', err);
      setPriorities([]);
    }
  };

  const handleEdit = (row) => {
    // we want full object to populate form
    setEditingIssueType(row);
    // ensure form reinitializes because we use enableReinitialize
  };

  const handleDeleteClick = (row) => {
    setIssueTypeToDelete(row);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!issueTypeToDelete) return;
    setLoading(true);
    try {
      await API.delete(`/admin/issuetypes/${issueTypeToDelete.issue_type_id}`);
      await fetchIssueTypes();
      toast.success('Issue Type Deleted Successfully', { autoClose: 2000 });
    } catch (err) {
      console.error('Error deleting issue type:', err);
      toast.error('Failed to delete Issue Type', { autoClose: 2000 });
    } finally {
      setLoading(false);
      setDeleteDialogOpen(false);
      setIssueTypeToDelete(null);
    }
  };

  const handleDeleteCancel = () => {
    setDeleteDialogOpen(false);
    setIssueTypeToDelete(null);
  };

  const columns = [
    { field: 'name', headerName: 'Issue Type', width: 220 },
    // REMOVED: subcategory column
    { field: 'priority_name', headerName: 'Priority', width: 140 },
    { field: 'sla', headerName: 'SLA Type', width: 220 },
    { field: 'response_time', headerName: 'Response (min)', width: 140 },
    { field: 'resolve_time', headerName: 'Resolve (min)', width: 140 },
    {
      field: 'status',
      headerName: 'Status',
      width: 120,
      renderCell: (params) => (
        <Typography sx={{ color: params.value === 'Active' ? 'green' : 'red', fontWeight: 'bold' }}>{params.value}</Typography>
      )
    },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 150,
      renderCell: (params) => (
        <Box sx={{ display: 'flex', gap: 1 }}>
          <IconButton color="primary" onClick={() => handleEdit(params.row)}>
            <EditIcon />
          </IconButton>
          <IconButton color="secondary" onClick={() => handleDeleteClick(params.row)}>
            <DeleteIcon />
          </IconButton>
        </Box>
      )
    }
  ];

  // initial values consider editingIssueType (enableReinitialize)
  const initialValues = {
    // REMOVED: subcategory_id
    name: editingIssueType ? editingIssueType.name : '',
    sla_id: editingIssueType ? editingIssueType.sla_id : '',
    priority_id: editingIssueType ? editingIssueType.priority_id : '',
    status: editingIssueType ? (editingIssueType.status === 'Active' ? '1' : '0') : '1'
  };

  const validationSchema = Yup.object({
    // REMOVED: subcategory_id validation
    name: Yup.string().required('Issue Type name is required'),
    sla_id: Yup.string().required('SLA is required'),
    priority_id: Yup.string().required('Priority is required'),
    status: Yup.string().required('Status is required')
  });

  const handleSubmit = async (values, { resetForm }) => {
    setLoading(true);
    try {
      const payload = {
        // REMOVED: subcategory_id
        name: values.name,
        sla_id: values.sla_id || null,
        priority_id: values.priority_id || null,
        is_active: values.status === '1'
      };

      if (editingIssueType) {
        await API.put(`/admin/issuetypes/${editingIssueType.issue_type_id}`, payload);
        toast.success('Issue Type Updated Successfully', { autoClose: 2000 });
      } else {
        await API.post('/admin/issuetypes', payload);
        toast.success('Issue Type Created Successfully', { autoClose: 2000 });
      }

      await fetchIssueTypes();
      resetForm();
      setEditingIssueType(null);
    } catch (err) {
      console.error('Error saving issue type:', err);
      toast.error('Failed to save Issue Type', { autoClose: 2000 });
    } finally {
      setLoading(false);
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
              <span>Issue Type Master</span>
              <PlusButton label="Back" onClick={handleBackClick} />
            </Box>
          }
        >
          <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={handleSubmit} enableReinitialize>
            {({ resetForm }) => (
              <Form>
                <Grid container spacing={2}>
                  {/* REMOVED: Sub Category field */}

                  <Grid item xs={12} sm={2}>
                    <CustomParagraphLight>
                      Issue Type <ValidationStar>*</ValidationStar>
                    </CustomParagraphLight>
                    <Field as={FieldPadding} name="name" fullWidth />
                    <ErrorMessage name="name" component="div" style={errorMessageStyle} />
                  </Grid>

                  <Grid item xs={12} sm={2}>
                    <CustomParagraphLight>
                      SLA <ValidationStar>*</ValidationStar>
                    </CustomParagraphLight>
                    <Field as={SelectFieldPadding} name="sla_id" fullWidth>
                      <MenuItem value="">
                        <em>Select SLA</em>
                      </MenuItem>
                      {slaList.map((sla) => {
                        const id = sla.sla_id ?? sla.id;
                        const label = `${sla.issue_type} (Response Time - ${sla.response_target_minutes}(min) / Resolve Time - ${sla.resolve_target_minutes}(min))`;
                        return (
                          <MenuItem key={id} value={id}>
                            {label}
                          </MenuItem>
                        );
                      })}
                    </Field>
                    <ErrorMessage name="sla_id" component="div" style={errorMessageStyle} />
                  </Grid>

                  <Grid item xs={12} sm={2}>
                    <CustomParagraphLight>
                      Priority <ValidationStar>*</ValidationStar>
                    </CustomParagraphLight>
                    <Field as={SelectFieldPadding} name="priority_id" fullWidth>
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
                    <Field as={SelectFieldPadding} name="status" fullWidth>
                      <MenuItem value="1">Active</MenuItem>
                      <MenuItem value="0">Inactive</MenuItem>
                    </Field>
                    <ErrorMessage name="status" component="div" style={errorMessageStyle} />
                  </Grid>

                  <Grid item xs={12} sm={2} display="flex" alignItems="flex-end" gap={1}>
                    <SubmitButton type="submit">{editingIssueType ? 'Update' : 'Submit'}</SubmitButton>
                    <CustomRefreshBtn
                      onClick={() => {
                        resetForm();
                        setEditingIssueType(null);
                      }}
                    >
                      Refresh
                    </CustomRefreshBtn>
                  </Grid>
                </Grid>
              </Form>
            )}
          </Formik>

          <Box sx={{ mt: 3 }}>
            <DataGrid rows={issueTypes} columns={columns} sx={gridStyle} autoHeight />
          </Box>

          <Dialog open={deleteDialogOpen} onClose={handleDeleteCancel}>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogContent>
              <DialogContentText>Are you sure you want to delete this Issue Type?</DialogContentText>
            </DialogContent>
            <DialogActions>
              <NoButton onClick={handleDeleteCancel}>No</NoButton>
              <YesButton onClick={handleDeleteConfirm}>Yes</YesButton>
            </DialogActions>
          </Dialog>
        </MainCard>
      )}
    </>
  );
}