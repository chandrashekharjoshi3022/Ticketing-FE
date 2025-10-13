import API from '../../api/axios';

export const workingHoursService = {
  // Get all working hours
  getAll: async () => {
    const response = await API.get('/working-hours');
    return response.data;
  },

  // Get working hours by ID
  getById: async (id) => {
    const response = await API.get(`/working-hours/${id}`);
    return response.data;
  },

  // Create new working hours
  create: async (data) => {
    const response = await API.post('/working-hours', data);
    return response.data;
  },

  // Update working hours
  update: async (id, data) => {
    const response = await API.put(`/working-hours/${id}`, data);
    return response.data;
  },

  // Delete working hours
  delete: async (id) => {
    const response = await API.delete(`/working-hours/${id}`);
    return response.data;
  },

  // Set as default working hours
  setDefault: async (id) => {
    const response = await API.patch(`/working-hours/${id}/set-default`);
    return response.data;
  }
};

export default workingHoursService;