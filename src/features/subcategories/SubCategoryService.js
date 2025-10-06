
import API from '../../api/axios'; // your API helper (baseURL: /api)

const listSubCategories = async (categoryId = null) => {
  const q = categoryId ? `?categoryId=${encodeURIComponent(categoryId)}` : '';
  const res = await API.get(`/admin/subcategories/${q}`);
  // backend returns { subcategories: [...] }
  return res.data;
};

const getSubCategory = async (id) => {
  const res = await API.get(`/admin/subcategories/${encodeURIComponent(id)}`);
  return res.data;
};

const createSubCategory = async (payload) => {
  // payload: { category_id, name, description, is_active? }
  const res = await API.post('/admin/subcategories', payload);
  return res.data;
};

const updateSubCategory = async (id, payload) => {
  const res = await API.put(`/admin/subcategories/${encodeURIComponent(id)}`, payload);
  return res.data;
};

const deleteSubCategory = async (id) => {
  const res = await API.delete(`/admin/subcategories/${encodeURIComponent(id)}`);
  return res.data;
};

export default {
  listSubCategories,
  getSubCategory,
  createSubCategory,
  updateSubCategory,
  deleteSubCategory
};
