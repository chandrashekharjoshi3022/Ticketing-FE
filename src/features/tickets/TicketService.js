// src/features/tickets/TicketService.js
import API from "../../api/axios";
// NOTE: Adjust endpoints to match your backend if different.
// I used: GET /tickets, POST /tickets, GET /tickets/:id, POST /tickets/:id/reply

const getTickets = async () => {
  const res = await API.get('admin/tickets'); // returns array
  return res.data;
};

const getTicketDetails = async (ticketId) => {
  const res = await API.get(`/ticket/${ticketId}`); // returns ticket object with replies
  return res.data;
};

const raiseTicket = async (formData) => {
  // formData must be a FormData instance


  console.log('Raising ticket with formData here in api:', formData);


  const res = await API.post('/ticket/raise', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });
  return res.data;
};

const replyToTicket = async ({ ticketId, message }) => {
  // adapt payload key if your API expects different name
  const res = await API.post(`/ticket/${ticketId}/reply`, { message });
  return res.data;
};

export default {
  getTickets,
  getTicketDetails,
  raiseTicket,
  replyToTicket
};
