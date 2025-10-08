import API from '../../api/axios';

// Admin list (backend: GET /api/ticket/admin/all)
const getTicketsForAdmin = async () => {
  const res = await API.get('/admin/tickets');
  return res.data;
};

// Executive list (backend: GET /api/ticket/executive/my)
const getTicketsForExecutive = async () => {
  const res = await API.get('/ticket/executive/my');
  return res.data;
};

// User list (backend: GET /api/ticket/my-tickets)
const getTicketsForUser = async () => {
  const res = await API.get('/ticket/my-tickets');
  return res.data;
};

const getTickets = async (userRole) => {
  if (userRole === 'admin') {
    return await getTicketsForAdmin();
  } else if (userRole === 'executive') {
    return await getTicketsForExecutive();
  } else {
    return await getTicketsForUser();
  }
};

const getTicketDetails = async (ticketId) => {
  const res = await API.get(`/ticket/${ticketId}`);
  return res.data;
};

const raiseTicket = async (formData) => {
  try {
    const res = await API.post('/ticket/raise', formData, {
      headers: { 
        'Content-Type': 'multipart/form-data',
      }
    });
    return res.data;
  } catch (error) {
    console.error('TicketService - raiseTicket error:', error);
    throw error;
  }
};

const replyToTicket = async ({ ticketId, formData }) => {
  const res = await API.post(`/ticket/${ticketId}/reply`, formData, {
    headers: { 
      'Content-Type': 'multipart/form-data' 
    }
  });
  return res.data;
};

// New: assign ticket (admin action) -> POST /api/ticket/:id/assign
const assignTicket = async ({ ticketId, assigned_to }) => {
  const res = await API.post(`/api/ticket/${ticketId}/assign`, { assigned_to });
  return res.data;
};

// ADD THIS: Update ticket priority (admin action)
const updateTicketPriority = async ({ ticketId, priority, priority_id }) => {
  const res = await API.put(`/ticket/${ticketId}/priority`, {
    priority,
    priority_id
  });
  return res.data;
};

export default {
  getTickets,
  getTicketsForAdmin,
  getTicketsForExecutive,
  getTicketsForUser,
  getTicketDetails,
  raiseTicket,
  replyToTicket,
  assignTicket,
  updateTicketPriority // ADD THIS: Export the new function
};