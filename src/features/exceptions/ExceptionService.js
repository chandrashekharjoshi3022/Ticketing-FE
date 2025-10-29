// src/features/exceptions/ExceptionService.js
import API from '../../api/axios';

const fetchExceptions = async () => {
  const res = await API.get('/admin/exceptions');
  return res.data;
};

const fetchException = async (id) => {
  const res = await API.get(`/admin/exceptions/${encodeURIComponent(id)}`);
  return res.data;
};

const createException = async (payload) => {
  const res = await API.post('/admin/exceptions', payload);
  return res.data;
};

const updateException = async (id, payload) => {
  const res = await API.put(`/admin/exceptions/${encodeURIComponent(id)}`, payload);
  return res.data;
};

const deleteException = async (id) => {
  const res = await API.delete(`/admin/exceptions/${encodeURIComponent(id)}`);
  return res.data;
};

export default {
  fetchExceptions,
  fetchException,
  createException,
  updateException,
  deleteException
};