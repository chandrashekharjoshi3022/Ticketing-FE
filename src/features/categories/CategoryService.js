
import API from '../../api/axios';

// RESTful endpoints based on your backend routes
const fetchCategories = async (includeInactive = false) => {
  const q = includeInactive ? '?includeInactive=true' : '';
  const res = await API.get(`/admin/categories/${q}`);
  // controller returns { categories }
  return res.data;
};

const fetchCategory = async (id) => {
  const res = await API.get(`/admin/categories/${encodeURIComponent(id)}`);
  return res.data;
};

const createCategory = async (payload) => {
  // payload: { name, description, is_active? }
  const res = await API.post('/admin/categories', payload);
  return res.data;
};

const updateCategory = async (id, payload) => {
  // payload: { name, description, is_active? }
  const res = await API.put(`/admin/categories/${encodeURIComponent(id)}`, payload);
  return res.data;
};

const deleteCategory = async (id) => {
  const res = await API.delete(`/admin/categories/${encodeURIComponent(id)}`);
  return res.data;
};

export default {
  fetchCategories,
  fetchCategory,
  createCategory,
  updateCategory,
  deleteCategory
};
