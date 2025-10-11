// features/issueType/issueTypeService.js
import API from '../../api/axios';

const fetchIssueTypes = async () => {
  const res = await API.get('/admin/issuetypes');
  return res.data;
};

const fetchIssueType = async (id) => {
  const res = await API.get(`/admin/issuetypes/${encodeURIComponent(id)}`);
  return res.data;
};

const createIssueType = async (payload) => {
  const res = await API.post('/admin/issuetypes', payload);
  return res.data;
};

const updateIssueType = async (id, payload) => {
  const res = await API.put(`/admin/issuetypes/${encodeURIComponent(id)}`, payload);
  return res.data;
};

const deleteIssueType = async (id) => {
  const res = await API.delete(`/admin/issuetypes/${encodeURIComponent(id)}`);
  return res.data;
};

const fetchUserIssueTypes = async (userId) => {
  const res = await API.get(`/admin/issuetypes/user/${encodeURIComponent(userId)}/all`);
  return res.data;
};

const fetchUserSLAsForIssueType = async (userId, issueTypeId) => {
  const res = await API.get(`/admin/issuetypes/user/${encodeURIComponent(userId)}/issue-type/${encodeURIComponent(issueTypeId)}/slas`);
  return res.data;
};

export default {
  fetchIssueTypes,
  fetchIssueType,
  createIssueType,
  updateIssueType,
  deleteIssueType,
  fetchUserIssueTypes,
  fetchUserSLAsForIssueType
};