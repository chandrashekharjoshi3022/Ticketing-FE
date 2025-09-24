// src/features/auth/AuthService.js
import API from '../../api/axios';

const login = async (data) => {
  // backend should set httpOnly cookie on this response
  const res = await API.post('/auth/login', data);
  // normalize: always return { user: ... }
  return { user: res.data.user ?? res.data };
};

const getMe = async () => {
  // IMPORTANT: use GET for idempotent “who am I” endpoint
  const res = await API.get('/auth/me');
  return { user: res.data.user ?? res.data };
};

const logout = async () => {
  const res = await API.post('/auth/logout');
  return res.data;
};

export default { login, getMe, logout };
