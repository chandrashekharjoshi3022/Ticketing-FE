// src/services/systemRegistrationService.js
import API from '../../api/axios'; // your API helper (baseURL: /api)


const systemRegistrationService = {
  getAllSystems: () => {
    return API.get('/system/all');
  },

  createSystem: (systemData) => {
    return API.post('/system/register', systemData);
  },

  updateSystem: (systemId, systemData) => {
    return API.put(`/system/${systemId}`, systemData);
  },

  updateSystemStatus: (systemId, statusData) => {
    return API.patch(`/system/${systemId}/status`, statusData);
  },

  // If you need to get a single system
  getSystemById: (systemId) => {
    return API.get(`/system/${systemId}`);
  },
};

export default systemRegistrationService;