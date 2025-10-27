// src/components/SystemRegistration/SystemRegistration.js
import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Card, Row, Col, Button, Form, Input, Switch, Table, Space, Modal, message, Tag, Divider, Alert, Spin } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, ReloadOutlined, EyeOutlined } from '@ant-design/icons';
import {
  fetchSystems,
  createSystem,
  updateSystem,
  updateSystemStatus,
  setCurrentSystem,
  clearCurrentSystem,
  clearError,
  clearSuccess
} from '../../features/SystemRegistration/systemRegistrationSlice';
import MainCard from 'components/MainCard';
import { DataGrid } from '@mui/x-data-grid';
import { Box, Chip, Grid, IconButton } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import VisibilityIcon from '@mui/icons-material/Visibility';
import RefreshIcon from '@mui/icons-material/Refresh';
import gridStyle from 'utils/gridStyle';
import * as Yup from 'yup';
import { ErrorMessage, Field, Formik } from 'formik';
import CustomParagraphDark from 'components/CustomParagraphDark';
import ValidationStar from 'components/ValidationStar';
import FieldPadding from 'components/FieldPadding';
import { errorMessageStyle } from 'components/StyleComponent';
const validationSchema = Yup.object({
  system_name: Yup.string().required('Please enter system name').min(3, 'System name must be at least 3 characters'),
  contact_email: Yup.string().email('Please enter valid email').required('Please enter contact email'),
  description: Yup.string().required('Please enter description').min(10, 'Description must be at least 10 characters')
});
const SystemRegistration = () => {
  const dispatch = useDispatch();
  const { systems, currentSystem, loading, error, success, formMode } = useSelector((state) => state.systemRegistration);

  const [form] = Form.useForm();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [passwordVisible, setPasswordVisible] = useState(false);

  useEffect(() => {
    dispatch(fetchSystems());
  }, [dispatch]);

  useEffect(() => {
    if (error) {
      message.error(error);
      dispatch(clearError());
    }
  }, [error, dispatch]);

  useEffect(() => {
    if (success) {
      message.success(formMode === 'create' ? 'System registered successfully!' : 'System updated successfully!');
      dispatch(clearSuccess());
      handleCloseModal();
    }
  }, [success, formMode, dispatch]);

  const handleCreateNew = () => {
    dispatch(clearCurrentSystem());
    form.resetFields();
    setIsModalVisible(true);
  };

  const handleEdit = (system) => {
    dispatch(setCurrentSystem(system));
    form.setFieldsValue({
      system_name: system.system_name,
      description: system.description
    });
    setIsModalVisible(true);
  };

  const handleCloseModal = () => {
    setIsModalVisible(false);
    setPasswordVisible(false);
    dispatch(clearCurrentSystem());
    form.resetFields();
  };

  const handleSubmit = async (values) => {
    try {
      if (formMode === 'create' || !currentSystem) {
        await dispatch(createSystem(values)).unwrap();
      } else {
        await dispatch(
          updateSystem({
            systemId: currentSystem.system_id,
            systemData: values
          })
        ).unwrap();
      }
    } catch (error) {
      // Error handled by slice
    }
  };

  const handleStatusChange = async (systemId, is_active) => {
    try {
      await dispatch(updateSystemStatus({ systemId, is_active })).unwrap();
      message.success(`System ${is_active ? 'activated' : 'deactivated'} successfully`);
    } catch (error) {
      message.error('Failed to update system status');
    }
  };

  const columns = [
    {
      field: 'system_name',
      headerName: 'System Name',
      flex: 1,
      renderCell: (params) => (
        <Box>
          <strong>{params.value}</strong>
          <div style={{ fontSize: '12px', color: '#666' }}>ID: {params.row.system_id}</div>
        </Box>
      )
    },
    {
      field: 'description',
      headerName: 'Description',
      flex: 1,
      renderCell: (params) => (
        <Box title={params.value} style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
          {params.value}
        </Box>
      )
    },
    {
      field: 'system_user',
      headerName: 'System User',
      flex: 1.2,
      renderCell: (params) => {
        const user = params.value;
        return user ? (
          <Box>
            <div>
              Username: <strong>{user.username}</strong>
            </div>
            <div>Email: {user.email}</div>
            {/* <Chip label={user.is_active ? 'Active' : 'Inactive'} color={user.is_active ? 'success' : 'error'} size="small" /> */}
          </Box>
        ) : (
          'N/A'
        );
      }
    },
    {
      field: 'is_active',
      headerName: 'Status',
      width: 130,
      renderCell: (params) => <Switch checked={params.value} onChange={(e) => handleStatusChange(params.row.system_id, e.target.checked)} />
    },
    {
      field: 'admin_creator',
      headerName: 'Created By',
      width: 140,
      valueGetter: (params) => params.value?.username || 'N/A'
    },
    {
      field: 'created_on',
      headerName: 'Created On',
      width: 130,
      valueGetter: (params) => new Date(params.value).toLocaleDateString()
    },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 120,
      renderCell: (params) => (
        <Box sx={{ display: 'flex', gap: 1 }}>
          <IconButton color="primary" size="small" onClick={() => handleEdit(params.row)}>
            <EditIcon fontSize="small" />
          </IconButton>

          <IconButton color="navy" size="small" onClick={() => handleViewDetails(params.row)}>
            <VisibilityIcon fontSize="small" />
          </IconButton>
        </Box>
      )
    }
    // {
    //   field: 'actions',
    //   headerName: 'Actions',
    //   width: 140,
    //   sortable: false,
    //   renderCell: (params) => (
    //     <>
    //       <Button size="small" onClick={() => handleEdit(params.row)}>
    //         <EditIcon fontSize="small" />
    //       </Button>
    //       <Button size="small" onClick={() => handleViewDetails(params.row)}>
    //         <VisibilityIcon fontSize="small" />
    //       </Button>
    //     </>
    //   )
    // }
  ];
  const handleViewDetails = (system) => {
    Modal.info({
      title: `System Details - ${system.system_name}`,
      width: 600,
      content: (
        <div>
          <Row gutter={[16, 16]}>
            <Col span={12}>
              <strong>System ID:</strong>
              <div>{system.system_id}</div>
            </Col>
            <Col span={12}>
              <strong>Status:</strong>
              <div>
                <Tag color={system.is_active ? 'green' : 'red'}>{system.is_active ? 'Active' : 'Inactive'}</Tag>
              </div>
            </Col>
            <Col span={24}>
              <strong>Description:</strong>
              <div>{system.description || 'No description'}</div>
            </Col>
            <Col span={24}>
              <Divider orientation="left">System User Account</Divider>
            </Col>
            {system.system_user && (
              <>
                <Col span={12}>
                  <strong>Username:</strong>
                  <div>{system.system_user.username}</div>
                </Col>
                <Col span={12}>
                  <strong>Email:</strong>
                  <div>{system.system_user.email}</div>
                </Col>
                <Col span={12}>
                  <strong>User ID:</strong>
                  <div>{system.system_user.user_id}</div>
                </Col>
                <Col span={12}>
                  <strong>Role:</strong>
                  <div>{system.system_user.role_name}</div>
                </Col>
              </>
            )}
            <Col span={24}>
              <Divider orientation="left">Registration Info</Divider>
            </Col>
            <Col span={12}>
              <strong>Created By:</strong>
              <div>{system.admin_creator?.username || 'N/A'}</div>
            </Col>
            <Col span={12}>
              <strong>Created On:</strong>
              <div>{new Date(system.created_on).toLocaleString()}</div>
            </Col>
          </Row>
        </div>
      ),
      onOk() {}
    });
  };

  const getModalTitle = () => {
    return formMode === 'create' ? 'Register New System' : `Edit System - ${currentSystem?.system_name}`;
  };

  return (
    <div>
      <MainCard
        title="System Registration Management"
        extra={
          <Button type="primary" icon={<PlusOutlined />} onClick={handleCreateNew} loading={loading}>
            Register New System
          </Button>
        }
      >
        <Box>
          <Alert
            message="System Registration Information"
            description="Register external systems that can create and manage tickets. Each system gets a dedicated user account for authentication."
            type="info"
            showIcon
            style={{ marginBottom: 16 }}
          />
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
            <h3>Registered Systems</h3>
            <Button startIcon={<RefreshIcon />} onClick={() => dispatch(fetchSystems())} disabled={loading}>
              Refresh
            </Button>
          </Box>

          <DataGrid
            getRowHeight={() => 'auto'}
            stickyHeader={true}
            autoHeight={false}
            rows={systems}
            columns={columns}
            getRowId={(row) => row.system_id}
            loading={loading}
            pageSizeOptions={[10, 20, 50]}
            pagination
            disableRowSelectionOnClick
            sx={{
              ...gridStyle,
              height: '80vh'
            }}
          />
        </Box>
      </MainCard>
      <Modal title={getModalTitle()} open={isModalVisible} onCancel={handleCloseModal} footer={null} width={600}>
        <Formik
          initialValues={{
            system_name: currentSystem?.system_name || '',
            contact_email: currentSystem?.system_user?.email || '',
            description: currentSystem?.description || ''
          }}
          validationSchema={validationSchema}
          enableReinitialize
          onSubmit={(values) => handleSubmit(values)}
        >
          {({ handleSubmit, handleChange }) => (
            <Form>
              <Box padding={1}>
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <CustomParagraphDark >
                      System Name <ValidationStar />
                    </CustomParagraphDark>

                    <Field as={FieldPadding} name="system_name" variant="outlined" fullWidth />
                    <ErrorMessage name="system_name" component="div" style={errorMessageStyle} />
                  </Grid>

                  {/* Contact Email */}
                  <Grid item xs={12}>
                    <CustomParagraphDark >
                      Contact Email <ValidationStar />
                    </CustomParagraphDark>

                    <Field as={FieldPadding} name="contact_email" variant="outlined" fullWidth />
                    <ErrorMessage name="contact_email" component="div" style={errorMessageStyle} />
                  </Grid>

                  {/* Description */}
                  <Grid item xs={12}>
                    <CustomParagraphDark >
                      Description <ValidationStar />
                    </CustomParagraphDark>

                    <Field as={FieldPadding} name="description" multiline rows={4} variant="outlined" fullWidth />
                    <ErrorMessage name="description" component="div" style={errorMessageStyle} />
                  </Grid>

                  {/* Show only if system exists */}
                  {currentSystem?.system_user && (
                    <Grid item xs={12}>
                      <Alert
                        message="System User Account"
                        description={
                          <div>
                            <p>
                              <strong>Username:</strong> {currentSystem.system_user.username}
                            </p>
                            <p>
                              <strong>Email:</strong> {currentSystem.system_user.email}
                            </p>
                            <p>
                              <strong>User ID:</strong> {currentSystem.system_user.user_id}
                            </p>
                          </div>
                        }
                        type="info"
                        style={{ marginBottom: 16 }}
                      />
                    </Grid>
                  )}
                </Grid>
              </Box>

              <Box display="flex" justifyContent="flex-end" gap={2}>
                <Button onClick={handleCloseModal} disabled={loading}>
                  Cancel
                </Button>
                <Button type="primary" htmlType="submit" loading={loading}>
                  {formMode === 'create' ? 'Register System' : 'Update System'}
                </Button>
              </Box>
            </Form>
          )}
        </Formik>
      </Modal>
    </div>
  );
};

export default SystemRegistration;
