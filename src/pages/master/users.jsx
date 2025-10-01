import { Button, Box } from '@mui/material';
import MainCard from 'components/MainCard';
import { useState } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import Icon from '@mdi/react';
import { mdiTagEdit } from '@mdi/js';
import UserForm from './userForm';
import PlusButton from 'components/CustomButton';

export default function UsersPages() {
  const [showOprForm, setShowOprForm] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [formMode, setFormMode] = useState('create');

  // Hard-coded user data
  const userData = [
    {
      id: 1,
      userName: 'John Doe',
      email: 'john@example.com',
      phoneNo: '1234567890',
      currentAddress: '123 Street, City, State, Country, 12345',
      permanentAddress: '456 Street, City, State, Country, 67890',
      dob: '1990-01-01',
      designation: 'Manager',
      department: 'Sales',
      resigDate: '2025-01-01',
      role: 'Admin',
      status: 'Active',
      remark: 'No remarks'
    },
    {
      id: 2,
      userName: 'Jane Smith',
      email: 'jane@example.com',
      phoneNo: '0987654321',
      currentAddress: '789 Street, City, State, Country, 54321',
      permanentAddress: '321 Street, City, State, Country, 98765',
      dob: '1992-05-12',
      designation: 'Developer',
      department: 'IT',
      resigDate: '2025-02-15',
      role: 'User',
      status: 'Inactive',
      remark: 'On leave'
    }
    // Add more users as needed
  ];

  // Define columns
  const columns = [
    { field: 'id', headerName: 'ID', width: 80 },
    { field: 'userName', headerName: 'User Name', width: 150 },
    { field: 'resigDate', headerName: 'Resignation Date', width: 150 },
    { field: 'role', headerName: 'Role', width: 100 },
    { field: 'email', headerName: 'Email', width: 150 },
    { field: 'phoneNo', headerName: 'Phone Number', width: 150 },
    { field: 'dob', headerName: 'DOB', width: 150 },
    { field: 'designation', headerName: 'Designation', width: 150 },
    { field: 'department', headerName: 'Department', width: 150 },
    { field: 'currentAddress', headerName: 'Current Address', width: 150 },
    { field: 'permanentAddress', headerName: 'Permanent Address', width: 150 },
    { field: 'status', headerName: 'Status', width: 100 },
    { field: 'remark', headerName: 'Remark', width: 150 },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 120,
      renderCell: (params) => (
        <Button
          color="primary"
          onClick={() => handleEdit(params.row.id)}
          
        >
          Edit
        </Button>
      )
    }
  ];

  const handleCreateOpr = () => {
    setSelectedUser(null);
    setFormMode('create');
    setShowOprForm(true);
  };

  const handleEdit = (id) => {
    const user = userData.find((user) => user.id === id);
    setSelectedUser(user);
    setFormMode('edit');
    setShowOprForm(true);
  };

  const handleCloseForm = () => {
    setShowOprForm(false);
    setSelectedUser(null);
    setFormMode('create');
  };

  return (
    <MainCard
      title={
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          {!showOprForm ? <span>User List</span> : <span>Create User</span>}
          {!showOprForm ? (
            <PlusButton label=" + Create User" onClick={handleCreateOpr} />
          ) : (
            <PlusButton label="Back" onClick={handleCloseForm} />
          )}
        </Box>
      }
    >
      {showOprForm ? (
        <UserForm user={selectedUser} formMode={formMode} onClose={handleCloseForm} />
      ) : (
        <DataGrid rows={userData} columns={columns} pageSize={5} rowsPerPageOptions={[5]} />
      )}
    </MainCard>
  );
}
