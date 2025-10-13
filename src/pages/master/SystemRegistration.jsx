// src/components/SystemRegistration/SystemRegistration.js
import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Card,
  Row,
  Col,
  Button,
  Form,
  Input,
  Switch,
  Table,
  Space,
  Modal,
  message,
  Tag,
  Divider,
  Alert,
  Spin,
} from 'antd';
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  ReloadOutlined,
  EyeOutlined,
} from '@ant-design/icons';
import {
  fetchSystems,
  createSystem,
  updateSystem,
  updateSystemStatus,
  setCurrentSystem,
  clearCurrentSystem,
  clearError,
  clearSuccess,
} from '../../features/SystemRegistration/systemRegistrationSlice';




const SystemRegistration = () => {
  const dispatch = useDispatch();
  const {
    systems,
    currentSystem,
    loading,
    error,
    success,
    formMode,
  } = useSelector((state) => state.systemRegistration);

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
      message.success(
        formMode === 'create'
          ? 'System registered successfully!'
          : 'System updated successfully!'
      );
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
      description: system.description,
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
        await dispatch(updateSystem({
          systemId: currentSystem.system_id,
          systemData: values
        })).unwrap();
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
      title: 'System Name',
      dataIndex: 'system_name',
      key: 'system_name',
      render: (text, record) => (
        <Space direction="vertical" size={0}>
          <strong>{text}</strong>
          <div style={{ fontSize: '12px', color: '#666' }}>
            ID: {record.system_id}
          </div>
        </Space>
      ),
    },
    {
      title: 'Description',
      dataIndex: 'description',
      key: 'description',
      ellipsis: true,
    },
    {
      title: 'System User',
      dataIndex: 'system_user',
      key: 'system_user',
      render: (user) => (
        user ? (
          <Space direction="vertical" size={0}>
            <div>Username: <strong>{user.username}</strong></div>
            <div>Email: {user.email}</div>
            <div>
              <Tag color={user.is_active ? 'green' : 'red'}>
                {user.is_active ? 'Active' : 'Inactive'}
              </Tag>
            </div>
          </Space>
        ) : 'N/A'
      ),
    },
    {
      title: 'Status',
      dataIndex: 'is_active',
      key: 'is_active',
      render: (is_active, record) => (
        <Switch
          checked={is_active}
          onChange={(checked) => handleStatusChange(record.system_id, checked)}
          checkedChildren="Active"
          unCheckedChildren="Inactive"
        />
      ),
    },
    {
      title: 'Created By',
      dataIndex: 'admin_creator',
      key: 'admin_creator',
      render: (admin) => admin?.username || 'N/A',
    },
    {
      title: 'Created On',
      dataIndex: 'created_on',
      key: 'created_on',
      render: (date) => new Date(date).toLocaleDateString(),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Space size="middle">
          <Button
            type="link"
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
            size="small"
          >
            Edit
          </Button>
          <Button
            type="link"
            icon={<EyeOutlined />}
            onClick={() => handleViewDetails(record)}
            size="small"
          >
            View
          </Button>
        </Space>
      ),
    },
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
                <Tag color={system.is_active ? 'green' : 'red'}>
                  {system.is_active ? 'Active' : 'Inactive'}
                </Tag>
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
      onOk() { },
    });
  };

  const getModalTitle = () => {
    return formMode === 'create' ? 'Register New System' : `Edit System - ${currentSystem?.system_name}`;
  };

  return (
    <div>
      <Card
        title="System Registration Management"
        extra={
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={handleCreateNew}
            loading={loading}
          >
            Register New System
          </Button>
        }
      >
        <Row gutter={[16, 16]}>
          <Col span={24}>
            <Alert
              message="System Registration Information"
              description="Register external systems that can create and manage tickets. Each system gets a dedicated user account for authentication."
              type="info"
              showIcon
              style={{ marginBottom: 16 }}
            />
          </Col>
          <Col span={24}>
            <Card
              title="Registered Systems"
              extra={
                <Button
                  icon={<ReloadOutlined />}
                  onClick={() => dispatch(fetchSystems())}
                  loading={loading}
                >
                  Refresh
                </Button>
              }
            >
              <Table
                columns={columns}
                dataSource={systems}
                rowKey="system_id"
                loading={loading}
                pagination={{
                  pageSize: 10,
                  showSizeChanger: true,
                  showQuickJumper: true,
                }}
              />
            </Card>
          </Col>
        </Row>
      </Card>

      {/* Create/Edit Modal */}
      <Modal
        title={getModalTitle()}
        open={isModalVisible}
        onCancel={handleCloseModal}
        footer={null}
        width={600}
        destroyOnClose
      >
        <Spin spinning={loading}>


        </Spin><Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          initialValues={{
            system_name: '',
            description: '',
            contact_email: ''
          }}
        >
          <Row gutter={16}>
            <Col span={24}>
              <Form.Item
                label="System Name"
                name="system_name"
                rules={[
                  { required: true, message: 'Please enter system name' },
                  { min: 3, message: 'System name must be at least 3 characters' },
                ]}
              >
                <Input placeholder="Enter system name (e.g., HR-System, CRM-System)" />
              </Form.Item>
            </Col>

            <Col span={24}>
              <Form.Item
                label="Contact Email"
                name="contact_email"
                rules={[
                  { required: true, message: 'Please enter contact email' },
                  { type: 'email', message: 'Please enter a valid email' },
                ]}
              >
                <Input
                  placeholder="Enter email to send credentials (e.g., admin@external-company.com)"
                  type="email"
                />
              </Form.Item>
            </Col>

            <Col span={24}>
              <Form.Item
                label="Description"
                name="description"
                rules={[
                  { required: true, message: 'Please enter system description' },
                  { min: 10, message: 'Description must be at least 10 characters' },
                ]}
              >
                <Input.TextArea
                  rows={4}
                  placeholder="Enter system description and purpose..."
                  showCount
                  maxLength={500}
                />
              </Form.Item>
            </Col>
          </Row>


          {currentSystem?.system_user && (
            <Alert
              message="System User Account"
              description={
                <div>
                  <p><strong>Username:</strong> {currentSystem.system_user.username}</p>
                  <p><strong>Email:</strong> {currentSystem.system_user.email}</p>
                  <p><strong>User ID:</strong> {currentSystem.system_user.user_id}</p>
                  <p><em>Use these credentials for system authentication</em></p>
                </div>
              }
              type="info"
              style={{ marginBottom: 16 }}
            />
          )}

          <Divider />

          <Form.Item style={{ marginBottom: 0, textAlign: 'right' }}>
            <Space>
              <Button onClick={handleCloseModal} disabled={loading}>
                Cancel
              </Button>
              <Button type="primary" htmlType="submit" loading={loading}>
                {formMode === 'create' ? 'Register System' : 'Update System'}
              </Button>
            </Space>
          </Form.Item>

        </Form>
      </Modal>
    </div>
  );
};

export default SystemRegistration;