import React from 'react'
import { Button, Box } from '@mui/material';
import MainCard from 'components/MainCard';
import { useEffect, useState } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import Icon from '@mdi/react';
import { mdiTagEdit } from '@mdi/js';
import axios from 'axios';
// import UserForm from './userForm';
// import UserForm2 from './userForm2';

import { BASE_URL } from 'AppConstants';

const rfqlist = () => {

  const [showOprForm, setShowOprForm] = useState(false);
  const [selectedOPR, setSelectedOPR] = useState(null);
  const [formMode, setFormMode] = useState('create');

  const [errors, setErrors] = useState({});

  const userData = [
    {
      id: 1,
      userName: 'John Doe',
      email: 'john.doe@example.com',
      phoneNo: '123-456-7890',
      currentAddress: '123 Main St, City',
      permanentAddress: '456 Elm St, City',
      pincode: '12345',
      dob: '1990-01-01',
      resigDate: '2024-05-01',
      role: 'Developer',
      status: 'Active',
      remark: 'None'
    },
    {
      id: 1,
      userName: 'John Doe',
      email: 'john.doe@example.com',
      phoneNo: '123-456-7890',
      currentAddress: '123 Main St, City',
      permanentAddress: '456 Elm St, City',
      pincode: '12345',
      dob: '1990-01-01',
      resigDate: '2024-05-01',
      role: 'Developer',
      status: 'Active',
      remark: 'None'
    },
    {
      id: 1,
      userName: 'John Doe',
      email: 'john.doe@example.com',
      phoneNo: '123-456-7890',
      currentAddress: '123 Main St, City',
      permanentAddress: '456 Elm St, City',
      pincode: '12345',
      dob: '1990-01-01',
      resigDate: '2024-05-01',
      role: 'Developer',
      status: 'Active',
      remark: 'None'
    }
  ];
  const [oprData, setOPRData] = useState(userData);

  const getTitleName = () => {
    return showOprForm ? (formMode === 'create' ? 'Add User' : 'Edit User') : 'User Data';
  };

  useEffect(() => {
    getOPRData();
  }, []);
  // Define columns
  const headingName = [
    { field: 'userName', headerName: 'User Name', width: 80 },
    { field: 'email', headerName: 'Email', width: 80 },
    { field: 'phoneNo', headerName: 'Phone Number', width: 120 },
    { field: 'currentAddress', headerName: 'Current Address', width: 100 },
    { field: 'permanentAddress', headerName: 'Permanent Address', width: 180 },
    { field: 'pincode', headerName: 'Pincode', width: 100 },
    { field: 'dob', headerName: 'DOB', width: 150 },
    { field: 'resigDate', headerName: 'Resignation date', width: 150 },
    { field: 'role', headerName: 'Role', width: 100 },
    { field: 'status', headerName: 'Status', width: 100 },
    { field: 'remark', headerName: 'Remark', width: 100 },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 150,
      renderCell: (params) => (
        <Button color="primary" onClick={() => handleEdit(params.row.id)}>
          <Icon path={mdiTagEdit} size={1} />
        </Button>
      )
    }
  ];

  const getOPRData = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/api/user/users`);
      // const response = await axios.get(`http://192.168.1.3:4000/api/user/users`);
      const mappedData = response.data.map((item, index) => ({
        id: index + 1,
        userName: item.First_Name + item.Last_Name,
        email: item.Email,
        phoneNo: item.Phone_Number,
        currentAddress: item.Address_Line1,
        permanentAddress: item.Address_Line2,
        pincode: item.Postal_Code,
        dob: item.Date_of_Birth,
        resigDate: item.Registration_Date,
        role: item.Role,
        status: item.status,
        remark: item.Notes
      }));

      setOPRData(mappedData);
    } catch (error) {
      console.error('Error fetching timeline:', error);
      // setErrors((prevErrors) => ({
      //   ...prevErrors,
      //   oprData: 'Failed to load timeline'
      // }));
    }
  };

  const handleCreateOpr = () => {
    setSelectedOPR(null);
    setFormMode('create');
    setShowOprForm(true);
  };
  const handleEdit = (id) => {
    const user = oprData.find((user) => user.id === id);
    setSelectedOPR(user);
    setFormMode('edit');
    setShowOprForm(true);
  };
  const handleCloseForm = () => {
    setShowOprForm(false);
    setSelectedOPR(null);
    setFormMode('create');
  };
  return (
    <>
      {showOprForm ? (
        <div className="row card my-3 p-2">
          <h1>Hello</h1>
        </div>
      ) : (
        <>
          <MainCard
            title={
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                RFQ List
                {/* <Button color="primary" className="plus-btn-color" onClick={handleCreateOpr}>
                  + Create User
                </Button> */}
              </Box>
            }
          >
            <div>
              <DataGrid rows={oprData} columns={headingName} pageSize={5} rowsPerPageOptions={[5]} />
            </div>
          </MainCard>
        </>
      )}
    </>
  );
}

export default rfqlist
