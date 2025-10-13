import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  Table,
  Card,
  Button,
  Space,
  Tag,
  Modal,
  message,
  Popconfirm,
  Tooltip,
  Switch,
  Form,
  Input,
  Select,
  TimePicker,
  Checkbox,
  Row,
  Col,
  Divider,
  Alert
} from 'antd';
import {
  EditOutlined,
  DeleteOutlined,
  PlusOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  SaveOutlined,
  CloseOutlined
} from '@ant-design/icons';
import moment from 'moment';
import {
  fetchWorkingHours,
  createWorkingHours,
  updateWorkingHours,
  deleteWorkingHours,
  setDefaultWorkingHours,
  clearError,
  clearSuccess
} from '../../features/services/workingHoursSlice';

const { Option } = Select;

const WorkingHoursManagement = () => {
  const dispatch = useDispatch();
  const { items, loading, error, success } = useSelector(state => state.workingHours);
  
  // State for modal and form
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [selectedDays, setSelectedDays] = useState([]);
  const [form] = Form.useForm();

  const daysOptions = [
    { label: 'Sunday', value: 1 },
    { label: 'Monday', value: 2 },
    { label: 'Tuesday', value: 4 },
    { label: 'Wednesday', value: 8 },
    { label: 'Thursday', value: 16 },
    { label: 'Friday', value: 32 },
    { label: 'Saturday', value: 64 }
  ];

  const timezones = [
    'UTC',
    'America/New_York',
    'America/Chicago',
    'America/Denver',
    'America/Los_Angeles',
    'Europe/London',
    'Europe/Paris',
    'Asia/Kolkata',
    'Asia/Tokyo',
    'Australia/Sydney'
  ];

  // Load working hours on component mount
  useEffect(() => {
    dispatch(fetchWorkingHours());
  }, [dispatch]);

  // Handle errors
  useEffect(() => {
    if (error) {
      message.error(error);
      dispatch(clearError());
    }
  }, [error, dispatch]);

  // Handle success messages
  useEffect(() => {
    if (success) {
      message.success('Operation completed successfully');
      dispatch(clearSuccess());
    }
  }, [success, dispatch]);

  // Reset form when editing item changes
  useEffect(() => {
    if (editingItem) {
      form.setFieldsValue({
        name: editingItem.name,
        timezone: editingItem.timezone,
        start_time: editingItem.start_time ? moment(editingItem.start_time, 'HH:mm:ss') : null,
        end_time: editingItem.end_time ? moment(editingItem.end_time, 'HH:mm:ss') : null,
        is_default: editingItem.is_default,
        is_active: editingItem.is_active
      });

      // Convert bitmask to array of selected days
      const days = [];
      daysOptions.forEach(day => {
        if (editingItem.working_days & day.value) {
          days.push(day.value);
        }
      });
      setSelectedDays(days);
    } else {
      // Default to Monday-Friday for new entries
      setSelectedDays([2, 4, 8, 16, 32]);
    }
  }, [editingItem, form]);

  // Handler functions
  const handleCreate = () => {
    setEditingItem(null);
    setIsModalVisible(true);
    form.resetFields();
    setSelectedDays([2, 4, 8, 16, 32]); // Default to Mon-Fri
  };

  const handleEdit = (record) => {
    setEditingItem(record);
    setIsModalVisible(true);
  };

  const handleDelete = async (id) => {
    try {
      await dispatch(deleteWorkingHours(id)).unwrap();
      message.success('Working hours deleted successfully');
    } catch (error) {
      message.error('Failed to delete working hours');
    }
  };

  const handleSetDefault = async (id) => {
    try {
      await dispatch(setDefaultWorkingHours(id)).unwrap();
      message.success('Default working hours updated successfully');
    } catch (error) {
      message.error('Failed to set default working hours');
    }
  };

  const handleModalClose = () => {
    setIsModalVisible(false);
    setEditingItem(null);
    form.resetFields();
  };

  const handleDayChange = (checkedValues) => {
    setSelectedDays(checkedValues);
  };

  const calculateWorkingDaysBitmask = (daysArray) => {
    return daysArray.reduce((sum, day) => sum + day, 0);
  };

  const onFormFinish = async (values) => {
    try {
      const workingHoursData = {
        name: values.name,
        timezone: values.timezone,
        working_days: calculateWorkingDaysBitmask(selectedDays),
        start_time: values.start_time.format('HH:mm:ss'),
        end_time: values.end_time.format('HH:mm:ss'),
        is_default: values.is_default || false,
        is_active: values.is_active !== undefined ? values.is_active : true
      };

      if (editingItem) {
        await dispatch(updateWorkingHours({
          id: editingItem.working_hours_id,
          data: workingHoursData
        })).unwrap();
        message.success('Working hours updated successfully');
      } else {
        await dispatch(createWorkingHours(workingHoursData)).unwrap();
        message.success('Working hours created successfully');
      }

      handleModalClose();
    } catch (error) {
      // Error handled by slice and useEffect above
    }
  };

  // Helper functions for display
  const getDaysText = (workingDays) => {
    const daysMap = {
      1: 'Sun', 2: 'Mon', 4: 'Tue', 8: 'Wed', 16: 'Thu', 32: 'Fri', 64: 'Sat'
    };
    
    const selectedDays = Object.keys(daysMap)
      .filter(bit => (workingDays & parseInt(bit)) !== 0)
      .map(bit => daysMap[bit]);
    
    return selectedDays.join(', ');
  };

  const getStatusTag = (record) => {
    if (record.is_default) {
      return <Tag color="green" icon={<CheckCircleOutlined />}>Default</Tag>;
    }
    if (record.is_active) {
      return <Tag color="blue">Active</Tag>;
    }
    return <Tag color="red">Inactive</Tag>;
  };

  // Table columns
  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      render: (text, record) => (
        <Space>
          <span>{text}</span>
          {getStatusTag(record)}
        </Space>
      )
    },
    {
      title: 'Working Days',
      dataIndex: 'working_days',
      key: 'working_days',
      render: (days) => getDaysText(days)
    },
    {
      title: 'Working Hours',
      key: 'hours',
      render: (_, record) => (
        <span>{record.start_time} - {record.end_time}</span>
      )
    },
    {
      title: 'Timezone',
      dataIndex: 'timezone',
      key: 'timezone'
    },
    {
      title: 'Default',
      dataIndex: 'is_default',
      key: 'is_default',
      render: (isDefault, record) => (
        <Switch
          checked={isDefault}
          onChange={() => !isDefault && handleSetDefault(record.working_hours_id)}
          disabled={isDefault}
        />
      )
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Space size="middle">
          <Tooltip title="Edit">
            <Button
              type="link"
              icon={<EditOutlined />}
              onClick={() => handleEdit(record)}
            />
          </Tooltip>
          {!record.is_default && (
            <Popconfirm
              title="Are you sure to delete these working hours?"
              description="This action cannot be undone."
              onConfirm={() => handleDelete(record.working_hours_id)}
              okText="Yes"
              cancelText="No"
              okType="danger"
            >
              <Tooltip title="Delete">
                <Button type="link" danger icon={<DeleteOutlined />} />
              </Tooltip>
            </Popconfirm>
          )}
        </Space>
      )
    }
  ];

  return (
    <div>
      {/* Main List Card */}
      <Card
        title={
          <Space>
            <ClockCircleOutlined />
            Working Hours Management
          </Space>
        }
        extra={
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={handleCreate}
          >
            Add Working Hours
          </Button>
        }
      >
        <Table
          columns={columns}
          dataSource={items}
          rowKey="working_hours_id"
          loading={loading}
          pagination={{ 
            pageSize: 10,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) => 
              `${range[0]}-${range[1]} of ${total} items`
          }}
        />
      </Card>

      {/* Create/Edit Modal */}
      <Modal
        title={editingItem ? 'Edit Working Hours' : 'Add Working Hours'}
        open={isModalVisible}
        onCancel={handleModalClose}
        footer={null}
        width={600}
        destroyOnClose
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={onFormFinish}
          initialValues={{
            timezone: 'UTC',
            is_default: false,
            is_active: true
          }}
        >
          <Form.Item
            label="Name"
            name="name"
            rules={[{ required: true, message: 'Please enter a name for these working hours' }]}
          >
            <Input 
              placeholder="e.g., Standard Business Hours, 24/7 Support, etc." 
              maxLength={150}
            />
          </Form.Item>

          <Form.Item
            label="Timezone"
            name="timezone"
            rules={[{ required: true, message: 'Please select a timezone' }]}
          >
            <Select placeholder="Select timezone" showSearch>
              {timezones.map(tz => (
                <Option key={tz} value={tz}>{tz}</Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item label="Working Days" required>
            <Checkbox.Group
              value={selectedDays}
              onChange={handleDayChange}
              style={{ width: '100%' }}
            >
              <Row gutter={[16, 8]}>
                {daysOptions.map(day => (
                  <Col span={8} key={day.value}>
                    <Checkbox value={day.value}>{day.label}</Checkbox>
                  </Col>
                ))}
              </Row>
            </Checkbox.Group>
            {selectedDays.length === 0 && (
              <Alert
                message="Please select at least one working day"
                type="error"
                showIcon
                style={{ marginTop: 8 }}
              />
            )}
          </Form.Item>

          <Divider>Working Hours</Divider>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                label="Start Time"
                name="start_time"
                rules={[{ required: true, message: 'Please select start time' }]}
              >
                <TimePicker
                  format="HH:mm"
                  style={{ width: '100%' }}
                  placeholder="Start time"
                  minuteStep={15}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="End Time"
                name="end_time"
                rules={[{ 
                  required: true, 
                  message: 'Please select end time' 
                }]}
              >
                <TimePicker
                  format="HH:mm"
                  style={{ width: '100%' }}
                  placeholder="End time"
                  minuteStep={15}
                />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                label="Set as Default"
                name="is_default"
                valuePropName="checked"
                tooltip="Setting this as default will automatically use it for new SLAs"
              >
                <Switch />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="Active"
                name="is_active"
                valuePropName="checked"
                tooltip="Inactive working hours cannot be assigned to new SLAs"
              >
                <Switch />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item>
            <Space style={{ float: 'right' }}>
              <Button onClick={handleModalClose} disabled={loading}>
                <CloseOutlined /> Cancel
              </Button>
              <Button
                type="primary"
                htmlType="submit"
                loading={loading}
                icon={<SaveOutlined />}
                disabled={selectedDays.length === 0}
              >
                {editingItem ? 'Update' : 'Create'} Working Hours
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default WorkingHoursManagement;