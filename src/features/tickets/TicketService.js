// src/features/tickets/TicketService.js
import API from '../../api/axios';

// Get tickets based on user role
const getTicketsForAdmin = async () => {
  const res = await API.get('admin/tickets');
  return res.data;
};

const getTicketsForUser = async () => {
  const res = await API.get('ticket/my-tickets'); // Using your new endpoint

  
  return res.data;
};

const getTickets = async (userRole) => {
  if (userRole === 'admin') {
    return await getTicketsForAdmin();
  } else {
    return await getTicketsForUser();
  }
};

const getTicketDetails = async (ticketId) => {
  const res = await API.get(`/ticket/${ticketId}`);
  return res.data;
};

const raiseTicket = async (formData) => {
  const res = await API.post('/ticket/raise', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });
  return res.data;
};

// const replyToTicket = async ({ ticketId, message }) => {
//   const res = await API.post(`/ticket/${ticketId}/reply`, { message });
//   return res.data;
// };

const replyToTicket = async ({ ticketId, formData }) => {
  const res = await API.post(`/ticket/${ticketId}/reply`, formData, {
    headers: { 
      'Content-Type': 'multipart/form-data' 
    }
  });
  return res.data;
};

export default {
  getTickets,
  getTicketsForAdmin,
  getTicketsForUser,
  getTicketDetails,
  raiseTicket,
  replyToTicket
};
