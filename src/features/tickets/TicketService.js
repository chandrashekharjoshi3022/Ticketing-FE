import API from "../../api/axios";

const getAll = async () => {
  const res = await API.get("/tickets");
  return res.data;
};

const create = async (ticketData) => {
  const res = await API.post("/tickets", ticketData);
  return res.data;
};

const reply = async ({ ticketId, message }) => {
  const res = await API.post(`/tickets/${ticketId}/reply`, { message });
  return res.data;
};

export default { getAll, create, reply };
