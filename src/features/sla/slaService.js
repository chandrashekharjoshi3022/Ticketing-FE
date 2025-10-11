// features/sla/slaService.js
import API from '../../api/axios';

const fetchSLAs = async (includeInactive = false) => {
  const q = includeInactive ? '?includeInactive=true' : '';
  const res = await API.get(`/admin/slas${q}`);
  return res.data;
};

const fetchSLA = async (id) => {
  const res = await API.get(`/admin/slas/${encodeURIComponent(id)}`);
  return res.data;
};

const createSLA = async (payload) => {
  const res = await API.post('/admin/slas', payload);
  return res.data;
};

const updateSLA = async (id, payload) => {
  const res = await API.put(`/admin/slas/${encodeURIComponent(id)}`, payload);
  return res.data;
};

const deleteSLA = async (id) => {
  const res = await API.delete(`/admin/slas/${encodeURIComponent(id)}`);
  return res.data;
};

const fetchSLAsByUser = async (userId) => {
  const res = await API.get(`/admin/slas/user/${encodeURIComponent(userId)}`);
  return res.data;
};

const fetchSLAsByIssueType = async (issueTypeId) => {
  const res = await API.get(`/admin/slas/issue-type/${encodeURIComponent(issueTypeId)}`);
  return res.data;
};

const fetchUsers = async () => {
  const res = await API.get('/admin/slas/users');
  return res.data;
};

const fetchIssueTypes = async () => {
  const res = await API.get('/admin/slas/issue-types');
  return res.data;
};

export default {
  fetchSLAs,
  fetchSLA,
  createSLA,
  updateSLA,
  deleteSLA,
  fetchSLAsByUser,
  fetchSLAsByIssueType,
  fetchUsers,
  fetchIssueTypes
};