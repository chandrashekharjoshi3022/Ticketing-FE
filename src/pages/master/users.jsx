import { Button, Box } from '@mui/material';
import MainCard from 'components/MainCard';
import { useEffect, useState } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import Icon from '@mdi/react';
import { mdiTagEdit } from '@mdi/js';
import axios from 'axios';
import UserForm from './userForm';
import { BASE_URL } from 'AppConstants';

export default function UsersPages() {
  const [showOprForm, setShowOprForm] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [formMode, setFormMode] = useState('create');
  const [userData, setUserData] = useState([]);

  useEffect(() => {
    getUserData();
  }, []);

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
        <Button color="primary" onClick={() => handleEdit(params.row.id)} startIcon={<Icon path={mdiTagEdit} size={1} />}>
          Edit
        </Button>
      )
    }
  ];
  const getUserData = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/api/user/users`);
      const userData = response.data.users.map((user) => ({
        id: user.id,
        userName: `${user.first_name} ${user.last_name}`,
        email: user.email,
        phoneNo: user.phone_number,
        currentAddress: `${user.address_line11} ${user.address_line12} ${user.city}${user.state}${user.country}${user.postal_code}`,
        permanentAddress: `${user.address_line21} ${user.address_line22} ${user.city1}${user.state1}${user.country1}${user.postal_code1}`,
        dob: user.date_of_birth,
        designation: user.designation,
        department: user.department,
        resigDate: user.registration_date,
        role: user.role,
        status: user.is_active ? 'Active' : 'Inactive',
        remark: user.notes
      }));

      setUserData(userData);
    } catch (error) {
      console.error('Error fetching user data:', error);
      // Handle error state
    }
  };

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
            <Button color="primary" className="plus-btn-color" onClick={handleCreateOpr}>
              + Create User
            </Button>
          ) : (
            <Button color="primary" className="plus-btn-color" onClick={handleCloseForm}>
              Back
            </Button>
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
