// src/features/auth/AuthService.js
import API from '../../api/axios';

const login = async (data) => {
  const res = await API.post('/auth/login', data);
  return res.data; // Your backend returns { user: { ... } }
};

const getMe = async () => {
  const res = await API.get('/auth/me');
  return res.data; // Your backend returns { user: { id, username, email, role } }
};

const logout = async () => {
  const res = await API.post('/auth/logout');
  return res.data;
};

export default { login, getMe, logout };