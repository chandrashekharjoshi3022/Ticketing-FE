import API from '../../api/axios';

const listUsers = async () => {
  const res = await API.get('/admin/users');
  return res.data;
};

const getUser = async (id) => {
  const res = await API.get(`/admin/users/${encodeURIComponent(id)}`);
  return res.data;
};

const createUser = async (payload) => {
  const res = await API.post('/admin/users', payload);
  return res.data;
};

const updateUser = async (id, payload) => {
  const res = await API.put(`/admin/users/${encodeURIComponent(id)}`, payload);
  return res.data;
};

const deleteUser = async (id) => {
  const res = await API.delete(`/admin/users/${encodeURIComponent(id)}`);
  return res.data;
};

// Remove these API calls since they don't exist yet
// const fetchRoles = async () => { ... };
// const fetchDepartments = async () => { ... };
// const fetchDesignations = async () => { ... };

export default {
  listUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser,
  // Remove these from exports
  // fetchRoles,
  // fetchDepartments,
  // fetchDesignations
};