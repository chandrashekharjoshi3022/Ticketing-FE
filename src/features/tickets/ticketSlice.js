// src/features/tickets/ticketSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import TicketService from './TicketService';

// helpers
// const normalizeTicket = (t, idx = 0) => ({
//   id: t.ticket_id ?? t.id ?? idx + 1,
//   ticket_no: t.ticket_no ?? `TCKT-${t.ticket_id ?? t.id ?? idx + 1}`,
//   module: t.module ?? t.modules ?? t.moduleName ?? 'N/A',
//   submodule: t.sub_module ?? t.submodule ?? t.subModule ?? '',
//   category: t.category ?? '',
//   comments: t.comment ?? t.comments ?? t.description ?? '',
//   created_on: t.created_at ?? t.registration_date ?? t.createdOn ?? '',
//   updated_by: t.updated_by ?? t.updatedBy ?? t.updated ?? '',
//   status: t.status ?? 'Open',
//   files: t.files ?? (t.screenshot_url ? [t.screenshot_url] : []),
//   // Add created_by field for filtering - using user_id from backend
//   created_by: t.user_id ?? t.created_by ?? t.user?.id ?? 'unknown',
//   // Add user info if available from backend
//   user: t.user
//     ? {
//         id: t.user.user_id,
//         username: t.user.username,
//         email: t.user.email
//       }
//     : null
// });



// Update the normalizeTicket function in ticketSlice.js
// const normalizeTicket = (t, idx = 0) => ({
//   id: t.ticket_id ?? t.id ?? idx + 1,
//   ticket_no: t.ticket_no ?? `TCKT-${t.ticket_id ?? t.id ?? idx + 1}`,
//   module: t.module ?? t.modules ?? t.moduleName ?? 'N/A',
//   submodule: t.sub_module ?? t.submodule ?? t.subModule ?? '',
//   category: t.category ?? '',
//   comments: t.comment ?? t.comments ?? t.description ?? '',
//   created_on: t.created_at ?? t.registration_date ?? t.createdOn ?? '',
//   updated_by: t.updated_by ?? t.updatedBy ?? t.updated ?? '',
//   status: t.status ?? 'Open',
//   files: t.files ?? (t.screenshot_url ? [t.screenshot_url] : []),
//   // Add created_by field for filtering - using user_id from backend
//   created_by: t.user_id ?? t.created_by ?? t.user?.id ?? 'unknown',
//   // Add user info if available from backend
//   user: t.user
//     ? {
//         id: t.user.user_id,
//         username: t.user.username,
//         email: t.user.email
//       }
//     : null,
//   // ADD THESE SLA PROPERTIES:
//   response_at: t.response_at,
//   response_time_seconds: t.response_time_seconds,
//   resolved_at: t.resolved_at,
//   resolve_time_seconds: t.resolve_time_seconds,
//   sla: t.sla, // Include the entire SLA object
//   response_sla_met: t.response_sla_met,
//   resolve_sla_met: t.resolve_sla_met
// });


// Update the normalizeTicket function in ticketSlice.js
// const normalizeTicket = (t, idx = 0) => ({
//   id: t.ticket_id ?? t.id ?? idx + 1,
//   ticket_no: t.ticket_no ?? `TCKT-${t.ticket_id ?? t.id ?? idx + 1}`,
//   module: t.module ?? t.modules ?? t.moduleName ?? 'N/A',
//   submodule: t.sub_module ?? t.submodule ?? t.subModule ?? '',
//   category: t.category ?? '',
//   comments: t.comment ?? t.comments ?? t.description ?? '',
//   created_on: t.created_at ?? t.registration_date ?? t.createdOn ?? '',
//   updated_by: t.updated_by ?? t.updatedBy ?? t.updated ?? '',
//   status: t.status ?? 'Open',
//   files: t.files ?? (t.screenshot_url ? [t.screenshot_url] : []),
//   // Use creator data from the API response
//   created_by: t.creator?.username ?? t.user?.username ?? t.created_by ?? 'unknown',
//   // Add user info from creator
//   user: t.creator
//     ? {
//         id: t.creator.user_id,
//         username: t.creator.username,
//         email: t.creator.email
//       }
//     : t.user
//     ? {
//         id: t.user.user_id,
//         username: t.user.username,
//         email: t.user.email
//       }
//     : null,
//   // SLA properties
//   response_at: t.response_at,
//   response_time_seconds: t.response_time_seconds,
//   resolved_at: t.resolved_at,
//   resolve_time_seconds: t.resolve_time_seconds,
//   sla: t.sla,
//   response_sla_met: t.response_sla_met,
//   resolve_sla_met: t.resolve_sla_met
// });


// Update the normalizeTicket function in ticketSlice.js
// const normalizeTicket = (t, idx = 0) => ({
//   id: t.ticket_id ?? t.id ?? idx + 1,
//   ticket_no: t.ticket_no ?? `TCKT-${t.ticket_id ?? t.id ?? idx + 1}`,
//   module: t.module ?? t.modules ?? t.moduleName ?? 'N/A',
//   submodule: t.sub_module ?? t.submodule ?? t.subModule ?? '',
//   category: t.category ?? '',
//   comments: t.comment ?? t.comments ?? t.description ?? '',
//   created_on: t.created_at ?? t.registration_date ?? t.createdOn ?? '',
//   updated_by: t.updated_by ?? t.updatedBy ?? t.updated ?? '',
//   status: t.status ?? 'Open',
//   files: t.files ?? (t.screenshot_url ? [t.screenshot_url] : []),
//   // Use creator data from the API response
//   created_by: t.creator?.username ?? t.user?.username ?? t.created_by ?? 'unknown',
//   // Add user_id for permission checks
//   user_id: t.user_id ?? t.creator?.user_id ?? t.user?.user_id,
//   // Add user info from creator
//   user: t.creator
//     ? {
//         id: t.creator.user_id,
//         username: t.creator.username,
//         email: t.creator.email
//       }
//     : t.user
//     ? {
//         id: t.user.user_id,
//         username: t.user.username,
//         email: t.user.email
//       }
//     : null,
//   // SLA properties
//   response_at: t.response_at,
//   response_time_seconds: t.response_time_seconds,
//   resolved_at: t.resolved_at,
//   resolve_time_seconds: t.resolve_time_seconds,
//   sla: t.sla,
//   response_sla_met: t.response_sla_met,
//   resolve_sla_met: t.resolve_sla_met
// });


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
  files: t.files ?? (t.screenshot_url ? [t.screenshot_url] : []),
  // Use username for display
  created_by: t.created_by_username ?? t.creator?.username ?? t.user?.username ?? t.created_by ?? 'Unknown',
  // Use user_id for permission checks
  user_id: t.user_id ?? t.creator?.user_id ?? t.user?.user_id,
  // Add user info from creator
  user: t.creator
    ? {
      id: t.creator.user_id,
      username: t.creator.username,
      email: t.creator.email
    }
    : t.user
      ? {
        id: t.user.user_id,
        username: t.user.username,
        email: t.user.email
      }
      : null,
  // SLA properties
  response_at: t.response_at,
  response_time_seconds: t.response_time_seconds,
  resolved_at: t.resolved_at,
  resolve_time_seconds: t.resolve_time_seconds,
  sla: t.sla,
  response_sla_met: t.response_sla_met,
  resolve_sla_met: t.resolve_sla_met
});



export const fetchTickets = createAsyncThunk('tickets/fetchAll', async (_, thunkAPI) => {
  try {
    const state = thunkAPI.getState();
    const userRole = state.auth.user?.role || 'user';

    console.log(`Fetching tickets for role: ${userRole}`);
    const res = await TicketService.getTickets(userRole);

    // Backend may return { tickets: [...] } or [...]
    const payload = res?.tickets ?? res?.data ?? res;

    // Log for debugging
    console.log(`Received ${Array.isArray(payload) ? payload.length : 0} tickets for ${userRole}`);

    return payload;
  } catch (err) {
    console.error('Error fetching tickets:', err);
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
  ticketDetails: null,
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
    },
    // Add reducer to filter tickets by user
    filterTicketsByUser: (state, action) => {
      const userId = action.payload;
      if (userId) {
        state.tickets = state.tickets.filter((ticket) => ticket.created_by === userId);
      }
    },
    // Reset tickets state
    resetTickets: (state) => {
      state.tickets = [];
      state.ticketDetails = null;
      state.isLoading = false;
      state.isError = false;
      state.message = '';
    }
  },
  extraReducers: (builder) => {
    builder
      // fetchTickets
      .addCase(fetchTickets.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
        state.message = '';
      })
      .addCase(fetchTickets.fulfilled, (state, action) => {
        state.isLoading = false;
        const payload = action.payload ?? [];
        state.tickets = Array.isArray(payload) ? payload.map(normalizeTicket) : [];
        console.log(`Tickets loaded: ${state.tickets.length} tickets`);
      })
      .addCase(fetchTickets.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload || action.error?.message;
        console.error('Failed to fetch tickets:', action.payload);
      })

      // fetchTicketDetails
      .addCase(fetchTicketDetails.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
        state.message = '';
      })
      // .addCase(fetchTicketDetails.fulfilled, (state, action) => {
      //   state.isLoading = false;
      //   const d = action.payload ?? {};
      //   state.ticketDetails = {
      //     ticket_id: d.ticket_id ?? d.id,
      //     ticket_no: d.ticket_no ?? `TCKT-${d.ticket_id ?? d.id}`,
      //     module: d.module,
      //     submodule: d.sub_module ?? d.submodule,
      //     category: d.category,
      //     comment: d.comment ?? d.comments,
      //     status: d.status,
      //     created_on: d.created_at ?? d.created_on,
      //     updated_by: d.updated_by ?? d.updatedBy,
      //     files: d.files ?? (d.screenshot_url ? [d.screenshot_url] : []),
      //     replies: d.replies ?? d.replies_list ?? d.comments_list ?? [],
      //     created_by: d.user_id ?? d.created_by ?? d.user?.id ?? 'unknown',
      //     user: d.user
      //       ? {
      //           id: d.user.user_id,
      //           username: d.user.username,
      //           email: d.user.email
      //         }
      //       : null
      //   };
      // })

      // Update the fetchTicketDetails.fulfilled case in ticketSlice.js
      // .addCase(fetchTicketDetails.fulfilled, (state, action) => {
      //   state.isLoading = false;
      //   const d = action.payload ?? {};
      //   state.ticketDetails = {
      //     ticket_id: d.ticket_id ?? d.id,
      //     ticket_no: d.ticket_no ?? `TCKT-${d.ticket_id ?? d.id}`,
      //     module: d.module,
      //     submodule: d.sub_module ?? d.submodule,
      //     category: d.category,
      //     comment: d.comment ?? d.comments,
      //     status: d.status,
      //     created_on: d.created_at ?? d.created_on,
      //     updated_by: d.updated_by ?? d.updatedBy,
      //     files: d.files ?? (d.screenshot_url ? [d.screenshot_url] : []),
      //     replies: d.replies ?? d.replies_list ?? d.comments_list ?? [],
      //     created_by: d.user_id ?? d.created_by ?? d.user?.id ?? 'unknown',
      //     user: d.user
      //       ? {
      //           id: d.user.user_id,
      //           username: d.user.username,
      //           email: d.user.email
      //         }
      //       : null,
      //     // ADD THESE SLA PROPERTIES:
      //     response_at: d.response_at,
      //     response_time_seconds: d.response_time_seconds,
      //     resolved_at: d.resolved_at,
      //     resolve_time_seconds: d.resolve_time_seconds,
      //     sla: d.sla,
      //     response_sla_met: d.response_sla_met,
      //     resolve_sla_met: d.resolve_sla_met
      //   };
      // })


      // Update the fetchTicketDetails.fulfilled case in ticketSlice.js
      // .addCase(fetchTicketDetails.fulfilled, (state, action) => {
      //   state.isLoading = false;
      //   const d = action.payload ?? {};
      //   state.ticketDetails = {
      //     ticket_id: d.ticket_id ?? d.id,
      //     ticket_no: d.ticket_no ?? `TCKT-${d.ticket_id ?? d.id}`,
      //     module: d.module,
      //     submodule: d.sub_module ?? d.submodule,
      //     category: d.category,
      //     comment: d.comment ?? d.comments,
      //     status: d.status,
      //     created_on: d.created_at ?? d.created_on,
      //     updated_by: d.updated_by ?? d.updatedBy,
      //     files: d.files ?? (d.screenshot_url ? [d.screenshot_url] : []),
      //     replies: d.replies ?? d.replies_list ?? d.comments_list ?? [],
      //     // Use creator data from the API response
      //     created_by: d.creator?.username ?? d.user?.username ?? d.created_by ?? 'unknown',
      //     user: d.creator
      //       ? {
      //           id: d.creator.user_id,
      //           username: d.creator.username,
      //           email: d.creator.email
      //         }
      //       : d.user
      //       ? {
      //           id: d.user.user_id,
      //           username: d.user.username,
      //           email: d.user.email
      //         }
      //       : null,
      //     // SLA properties
      //     response_at: d.response_at,
      //     response_time_seconds: d.response_time_seconds,
      //     resolved_at: d.resolved_at,
      //     resolve_time_seconds: d.resolve_time_seconds,
      //     sla: d.sla,
      //     response_sla_met: d.response_sla_met,
      //     resolve_sla_met: d.resolve_sla_met
      //   };
      // })


      // Update the fetchTicketDetails.fulfilled case in ticketSlice.js
      // .addCase(fetchTicketDetails.fulfilled, (state, action) => {
      //   state.isLoading = false;
      //   const d = action.payload ?? {};
      //   state.ticketDetails = {
      //     ticket_id: d.ticket_id ?? d.id,
      //     ticket_no: d.ticket_no ?? `TCKT-${d.ticket_id ?? d.id}`,
      //     module: d.module,
      //     submodule: d.sub_module ?? d.submodule,
      //     category: d.category,
      //     comment: d.comment ?? d.comments,
      //     status: d.status,
      //     created_on: d.created_at ?? d.created_on,
      //     updated_by: d.updated_by ?? d.updatedBy,
      //     files: d.files ?? (d.screenshot_url ? [d.screenshot_url] : []),
      //     replies: d.replies ?? d.replies_list ?? d.comments_list ?? [],
      //     // Use creator data from the API response
      //     created_by: d.creator?.username ?? d.user?.username ?? d.created_by ?? 'unknown',
      //     // Add user_id for permission checks
      //     user_id: d.user_id ?? d.creator?.user_id ?? d.user?.user_id,
      //     user: d.creator
      //       ? {
      //           id: d.creator.user_id,
      //           username: d.creator.username,
      //           email: d.creator.email
      //         }
      //       : d.user
      //       ? {
      //           id: d.user.user_id,
      //           username: d.user.username,
      //           email: d.user.email
      //         }
      //       : null,
      //     // SLA properties
      //     response_at: d.response_at,
      //     response_time_seconds: d.response_time_seconds,
      //     resolved_at: d.resolved_at,
      //     resolve_time_seconds: d.resolve_time_seconds,
      //     sla: d.sla,
      //     response_sla_met: d.response_sla_met,
      //     resolve_sla_met: d.resolve_sla_met
      //   };
      // })


      .addCase(fetchTicketDetails.fulfilled, (state, action) => {
        state.isLoading = false;
        const d = action.payload ?? {};
        state.ticketDetails = {
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
          replies: d.replies ?? d.replies_list ?? d.comments_list ?? [],
          // Use username for display
          created_by: d.created_by_username ?? d.creator?.username ?? d.user?.username ?? d.created_by ?? 'Unknown',
          // Use user_id for permission checks
          user_id: d.user_id ?? d.creator?.user_id ?? d.user?.user_id,
          user: d.creator
            ? {
              id: d.creator.user_id,
              username: d.creator.username,
              email: d.creator.email
            }
            : d.user
              ? {
                id: d.user.user_id,
                username: d.user.username,
                email: d.user.email
              }
              : null,
          // SLA properties
          response_at: d.response_at,
          response_time_seconds: d.response_time_seconds,
          resolved_at: d.resolved_at,
          resolve_time_seconds: d.resolve_time_seconds,
          sla: d.sla,
          response_sla_met: d.response_sla_met,
          resolve_sla_met: d.resolve_sla_met
        };
      })

      .addCase(fetchTicketDetails.rejected, (state, action) => {
        state.isLoading = false;
        state.ticketDetails = null;
        state.isError = true;
        state.message = action.payload || action.error?.message;
      })

      // createTicket
      .addCase(createTicket.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
      })
      .addCase(createTicket.fulfilled, (state, action) => {
        state.isLoading = false;
        const created = action.payload?.ticket ?? action.payload ?? null;
        if (created) {
          state.tickets = [normalizeTicket(created), ...state.tickets];
        }
      })
      .addCase(createTicket.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload || action.error?.message;
      })

      // replyToTicket
      .addCase(replyToTicket.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
      })
      // .addCase(replyToTicket.fulfilled, (state, action) => {
      //   state.isLoading = false;
      //   const ticketId = action.payload?.ticketId ?? action.meta?.arg?.ticketId;
      //   const reply = action.payload?.reply ?? action.payload;
      //   if (state.ticketDetails && state.ticketDetails.ticket_id == ticketId) {
      //     state.ticketDetails.replies = [...(state.ticketDetails.replies || []), reply];
      //   }
      // })


      // Update the replyToTicket.fulfilled case in ticketSlice.js
      .addCase(replyToTicket.fulfilled, (state, action) => {
        state.isLoading = false;
        const ticketId = action.payload?.ticketId ?? action.meta?.arg?.ticketId;
        const reply = action.payload?.reply ?? action.payload;

        if (state.ticketDetails && state.ticketDetails.ticket_id == ticketId) {
          // Make sure the reply has the proper structure with sender
          const replyWithSender = {
            ...reply,
            // Ensure sender object is properly structured
            sender: reply.sender ? {
              user_id: reply.sender.user_id,
              username: reply.sender.username,
              email: reply.sender.email
            } : null
          };

          state.ticketDetails.replies = [...(state.ticketDetails.replies || []), replyWithSender];
        }
      })
      .addCase(replyToTicket.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload || action.error?.message;
      });
  }
});

export const { clearTicketDetails, filterTicketsByUser, resetTickets } = ticketSlice.actions;
export default ticketSlice.reducer;
