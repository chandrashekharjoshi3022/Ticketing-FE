import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import TicketService from "./TicketService";

export const fetchTickets = createAsyncThunk("tickets/fetch", TicketService.getAll);
export const createTicket = createAsyncThunk("tickets/create", TicketService.create);
export const replyToTicket = createAsyncThunk("tickets/reply", TicketService.reply);

const ticketSlice = createSlice({
  name: "tickets",
  initialState: { list: [], isLoading: false, error: null },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchTickets.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchTickets.fulfilled, (state, action) => {
        state.isLoading = false;
        state.list = action.payload;
      })
      .addCase(fetchTickets.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message;
      });
  },
});

export default ticketSlice.reducer;
