
import API from '../../api/axios';

// Note: backend routes assumed mounted at /priority (based on your routes file)
const listPriorities = async () => {
  const res = await API.get('/admin/priorities');
  // backend returns { priorities: [...] } or [...]
  return res.data;
};

const getPriority = async (id) => {
  const res = await API.get(`/admin/priorities/${encodeURIComponent(id)}`);
  return res.data;
};

const createPriority = async (payload) => {
  // payload: { name, sort_order }
  const res = await API.post('/admin/priorities', payload);
  return res.data;
};

const updatePriority = async (id, payload) => {
  const res = await API.put(`/admin/priorities/${encodeURIComponent(id)}`, payload);
  return res.data;
};

const deletePriority = async (id) => {
  const res = await API.delete(`/admin/priorities/${encodeURIComponent(id)}`);
  return res.data;
};

export default {
  listPriorities,
  getPriority,
  createPriority,
  updatePriority,
  deletePriority
};
