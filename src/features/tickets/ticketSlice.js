// src/features/tickets/ticketSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import TicketService from './TicketService';

// helpers
const normalizeTicket = (t, idx = 0) => ({
  id: t.ticket_id ?? t.id ?? idx + 1,
  ticket_no: t.ticket_no ?? `TCKT-${t.ticket_id ?? t.id ?? idx + 1}`,
  module: t.module ?? t.modules ?? t.moduleName ?? 'N/A',
  submodule: t.sub_module ?? t.submodule ?? t.subModule ?? '',
  category: t.category ?? '',
  comments: t.comment ?? t.comments ?? t.description ?? '',
  created_on: t.created_at ?? t.registration_date ?? t.createdOn ?? '',
  updated_by: t.updated_by ?? t.updatedBy ?? t.updated ?? '',
  status: t.status ?? 'Open',
  files: t.files ?? (t.screenshot_url ? [t.screenshot_url] : [])
});

export const fetchTickets = createAsyncThunk('tickets/fetchAll', async (_, thunkAPI) => {
  try {
    const res = await TicketService.getTickets();
    // backend may return { tickets: [...] } or [...]
    const payload = res?.tickets ?? res?.data ?? res;
    return payload;
  } catch (err) {
    return thunkAPI.rejectWithValue(err.response?.data?.message || err.message);
  }
});

export const fetchTicketDetails = createAsyncThunk('tickets/fetchDetails', async (ticketId, thunkAPI) => {
  try {
    const res = await TicketService.getTicketDetails(ticketId);
    const data = res?.ticket ?? res?.data ?? res;
    return data;
  } catch (err) {
    return thunkAPI.rejectWithValue(err.response?.data?.message || err.message);
  }
});

export const createTicket = createAsyncThunk('tickets/create', async (formData, thunkAPI) => {
  try {
    const res = await TicketService.raiseTicket(formData);
    return res;
  } catch (err) {
    return thunkAPI.rejectWithValue(err.response?.data?.message || err.message);
  }
});

export const replyToTicket = createAsyncThunk('tickets/reply', async ({ ticketId, message }, thunkAPI) => {
  try {
    const res = await TicketService.replyToTicket({ ticketId, message });
    return { ticketId, reply: res };
  } catch (err) {
    return thunkAPI.rejectWithValue(err.response?.data?.message || err.message);
  }
});

const initialState = {
  tickets: [],
  ticketDetails: null, // currently open ticket details
  isLoading: false,
  isError: false,
  message: ''
};

const ticketSlice = createSlice({
  name: 'tickets',
  initialState,
  reducers: {
    clearTicketDetails: (state) => {
      state.ticketDetails = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // fetchTickets
      .addCase(fetchTickets.pending, (s) => {
        s.isLoading = true;
        s.isError = false;
        s.message = '';
      })
      .addCase(fetchTickets.fulfilled, (s, a) => {
        s.isLoading = false;
        const payload = a.payload ?? [];
        s.tickets = Array.isArray(payload) ? payload.map(normalizeTicket) : [];
      })
      .addCase(fetchTickets.rejected, (s, a) => {
        s.isLoading = false;
        s.isError = true;
        s.message = a.payload || a.error?.message;
      })

      // fetchTicketDetails
      .addCase(fetchTicketDetails.pending, (s) => {
        s.isLoading = true;
        s.isError = false;
        s.message = '';
      })
      .addCase(fetchTicketDetails.fulfilled, (s, a) => {
        s.isLoading = false;
        // normalize into expected shape (keep replies as-is)
        const d = a.payload ?? {};
        s.ticketDetails = {
          ticket_id: d.ticket_id ?? d.id,
          ticket_no: d.ticket_no ?? `TCKT-${d.ticket_id ?? d.id}`,
          module: d.module,
          submodule: d.sub_module ?? d.submodule,
          category: d.category,
          comment: d.comment ?? d.comments,
          status: d.status,
          created_on: d.created_at ?? d.created_on,
          updated_by: d.updated_by ?? d.updatedBy,
          files: d.files ?? (d.screenshot_url ? [d.screenshot_url] : []),
          replies: d.replies ?? d.replies_list ?? d.comments_list ?? []
        };
      })
      .addCase(fetchTicketDetails.rejected, (s, a) => {
        s.isLoading = false;
        s.ticketDetails = null;
        s.isError = true;
        s.message = a.payload || a.error?.message;
      })

      // createTicket
      .addCase(createTicket.pending, (s) => {
        s.isLoading = true;
        s.isError = false;
      })
      .addCase(createTicket.fulfilled, (s, a) => {
        s.isLoading = false;
        // if backend returns created ticket, add to list (normalize)
        const created = a.payload?.ticket ?? a.payload ?? null;
        if (created) {
          s.tickets = [normalizeTicket(created), ...s.tickets];
        }
      })
      .addCase(createTicket.rejected, (s, a) => {
        s.isLoading = false;
        s.isError = true;
        s.message = a.payload || a.error?.message;
      })

      // replyToTicket
      .addCase(replyToTicket.pending, (s) => {
        s.isLoading = true;
        s.isError = false;
      })
      .addCase(replyToTicket.fulfilled, (s, a) => {
        s.isLoading = false;
        // a.payload contains { ticketId, reply } or reply directly
        const ticketId = a.payload?.ticketId ?? a.meta?.arg?.ticketId;
        const reply = a.payload?.reply ?? a.payload;
        if (s.ticketDetails && s.ticketDetails.ticket_id == ticketId) {
          s.ticketDetails.replies = [...(s.ticketDetails.replies || []), reply];
        }
      })
      .addCase(replyToTicket.rejected, (s, a) => {
        s.isLoading = false;
        s.isError = true;
        s.message = a.payload || a.error?.message;
      });
  }
});

export const { clearTicketDetails } = ticketSlice.actions;
export default ticketSlice.reducer;
