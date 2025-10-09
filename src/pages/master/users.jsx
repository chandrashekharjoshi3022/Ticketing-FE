import { Button, Box, Snackbar, Alert, Typography, IconButton } from '@mui/material';
import MainCard from 'components/MainCard';
import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { DataGrid } from '@mui/x-data-grid';
import UserForm from './userForm';
import PlusButton from 'components/CustomButton';
import gridStyle from 'utils/gridStyle';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
// Redux imports
import { fetchUsers, deleteUser, clearCurrentUser, clearOperationStatus, clearUserError } from '../../features/users/usersSlice';
import { toast } from 'react-toastify';

export default function UsersPages() {
  const dispatch = useDispatch();
  const { items: users, loading, error, operationLoading, operationError } = useSelector((state) => state.users);

  const [showOprForm, setShowOprForm] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [formMode, setFormMode] = useState('create');
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);

  // Fetch users on component mount and when form closes
  useEffect(() => {
    if (!showOprForm) {
      dispatch(fetchUsers());
    }
  }, [dispatch, showOprForm]);

  // Handle errors and operation status
  useEffect(() => {
    if (error) {
      toast.error(error.message || 'Failed to fetch users');
      dispatch(clearUserError());
    }

    if (operationError) {
      toast.error(operationError.message || 'Operation failed');
      dispatch(clearOperationStatus());
    }
  }, [error, operationError, dispatch]);

  // Define columns with direct field access (no value getters needed)
  const columns = [
    {
      field: 'user_id',
      headerName: 'ID',
      width: 80
    },
    {
      field: 'username',
      headerName: 'Username',
      width: 150
    },
    {
      field: 'email',
      headerName: 'Email',
      width: 200
    },
    {
      field: 'first_name',
      headerName: 'First Name',
      width: 150
    },
    {
      field: 'last_name',
      headerName: 'Last Name',
      width: 150
    },
    {
      field: 'phone_no',
      headerName: 'Phone',
      width: 150
    },
    {
      field: 'role_name',
      headerName: 'Role',
      width: 120
    },
    {
      field: 'department',
      headerName: 'Department',
      width: 150
    },
    {
      field: 'designation',
      headerName: 'Designation',
      width: 150
    },
    // {
    //   field: 'registration_date',
    //   headerName: 'Registered',
    //   width: 120,
    //   valueFormatter: (params) => {
    //     if (!params.value) return 'N/A';
    //     try {
    //       return new Date(params.value).toLocaleDateString();
    //     } catch (error) {
    //       return 'Invalid Date';
    //     }
    //   }
    // },

    {
      field: 'registration_date',
      headerName: 'Registered',
      width: 120,
      valueFormatter: (params) => {
        // Safe check for params and value
        if (!params || params.value == null) return 'N/A';
        try {
          return new Date(params.value).toLocaleDateString();
        } catch {
          return 'Invalid Date';
        }
      }
    },
    {
      field: 'is_active',
      headerName: 'Status',
      width: 100,
      renderCell: (params) => {
        const isActive = params.row.is_active;
        return (
          <span
            style={{
              color: isActive ? 'green' : 'red',
              fontWeight: 'bold'
            }}
          >
            {isActive ? 'Active' : 'Inactive'}
          </span>
        );
      }
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

          <IconButton color="error" size="small" onClick={() => handleDeleteClick(params.row)} disabled={operationLoading}>
            <DeleteIcon fontSize="small" />
          </IconButton>
        </Box>
      )
    }
  ];

  const handleCreateOpr = () => {
    setSelectedUser(null);
    setFormMode('create');
    setShowOprForm(true);
    dispatch(clearCurrentUser());
  };

  const handleEdit = (user) => {
    if (!user) return;
    setSelectedUser(user);
    setFormMode('edit');
    setShowOprForm(true);
  };

  const handleDeleteClick = (user) => {
    if (!user) return;
    setUserToDelete(user);
    setDeleteConfirmOpen(true);
  };

  const handleDeleteConfirm = async () => {
    try {
      const userId = userToDelete?.user_id;
      if (!userId) throw new Error('User ID not found');

      await dispatch(deleteUser(userId)).unwrap();
      toast.success('User deleted successfully!');
      dispatch(fetchUsers());
    } catch (error) {
      toast.error(error.message || 'Failed to delete user');
    }
    setDeleteConfirmOpen(false);
    setUserToDelete(null);
  };

  const handleDeleteCancel = () => {
    setDeleteConfirmOpen(false);
    setUserToDelete(null);
  };

  const handleCloseForm = () => {
    setShowOprForm(false);
    setSelectedUser(null);
    setFormMode('create');
    dispatch(clearCurrentUser());
  };

  const handleNavigate = () => {
    window.history.back();
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  // Transform users data for DataGrid with proper IDs
  const gridUsers = Array.isArray(users)
    ? users.map((user) => ({
        ...user,
        id: user.user_id // Use user_id as the id for DataGrid
      }))
    : [];

  // Debug: Log the users data to see what we're getting
  useEffect(() => {
    if (users.length > 0) {
      console.log('Users data:', users);
      console.log('First user:', users[0]);
    }
  }, [users]);

  return (
    <>
      <Snackbar open={snackbarOpen} autoHideDuration={6000} onClose={handleSnackbarClose}>
        <Alert onClose={handleSnackbarClose} severity={snackbarSeverity} sx={{ width: '100%' }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>

      {/* Delete Confirmation Dialog */}
      {deleteConfirmOpen && (
        <Box
          sx={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            backgroundColor: 'rgba(0,0,0,0.5)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 1300
          }}
        >
          <Box
            sx={{
              backgroundColor: 'white',
              padding: 3,
              borderRadius: 2,
              minWidth: 400,
              boxShadow: 3
            }}
          >
            <Typography variant="h6" gutterBottom>
              Confirm Delete
            </Typography>
            <Typography variant="body1" sx={{ mb: 3 }}>
              Are you sure you want to delete user "{userToDelete?.first_name} {userToDelete?.last_name}"? This action cannot be undone.
            </Typography>
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
              <Button onClick={handleDeleteCancel} disabled={operationLoading}>
                Cancel
              </Button>
              <Button variant="contained" color="error" onClick={handleDeleteConfirm} disabled={operationLoading}>
                {operationLoading ? 'Deleting...' : 'Delete'}
              </Button>
            </Box>
          </Box>
        </Box>
      )}

      <MainCard
        title={
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontWeight: 600 }}>
            <Box>
              {!showOprForm ? (
                <span>User Management ({gridUsers.length} users)</span>
              ) : (
                <span>
                  {formMode === 'create'
                    ? 'Create New User'
                    : `Edit User - ${selectedUser?.first_name || ''} ${selectedUser?.last_name || ''}`}
                </span>
              )}
            </Box>
            <Box sx={{ display: 'flex', gap: 1 }}>
              {!showOprForm ? (
                <>
                  <PlusButton label=" + Create User" onClick={handleCreateOpr} disabled={loading} />
                  <PlusButton label="Refresh" onClick={() => dispatch(fetchUsers())} disabled={loading} />
                  <PlusButton label="Back" onClick={handleNavigate} />
                </>
              ) : (
                <PlusButton label="Back" onClick={handleCloseForm} />
              )}
            </Box>
          </Box>
        }
      >
        {showOprForm ? (
          <UserForm user={selectedUser} formMode={formMode} onClose={handleCloseForm} />
        ) : (
          <DataGrid
            getRowHeight={() => 'auto'}
            sx={{
              ...gridStyle,
              height: '80vh'
            }}
            stickyHeader={true}
            rows={gridUsers}
            columns={columns}
            loading={loading}
            pageSize={10}
            rowsPerPageOptions={[10, 25, 50]}
            disableSelectionOnClick
            autoHeight={false}
            getRowId={(row) => row.user_id || row.id}
            components={{
              NoRowsOverlay: () => (
                <Box
                  sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    height: '100%',
                    p: 2
                  }}
                >
                  <Typography variant="h6" color="textSecondary">
                    {loading ? 'Loading users...' : 'No users found'}
                  </Typography>
                  <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
                    {loading ? 'Please wait while we load users' : 'Click "Create User" to add your first user'}
                  </Typography>
                </Box>
              )
            }}
            initialState={{
              sorting: {
                sortModel: [{ field: 'user_id', sort: 'desc' }]
              }
            }}
          />
        )}
      </MainCard>
    </>
  );
}
