// src/store/slices/systemRegistrationSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import systemRegistrationService from './systemRegistrationService';

// Async thunks
export const fetchSystems = createAsyncThunk(
  'systemRegistration/fetchSystems',
  async (_, { rejectWithValue }) => {
    try {
      const response = await systemRegistrationService.getAllSystems();
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch systems');
    }
  }
);

export const createSystem = createAsyncThunk(
  'systemRegistration/createSystem',
  async (systemData, { rejectWithValue }) => {
    try {
      const response = await systemRegistrationService.createSystem(systemData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create system');
    }
  }
);

export const updateSystem = createAsyncThunk(
  'systemRegistration/updateSystem',
  async ({ systemId, systemData }, { rejectWithValue }) => {
    try {
      const response = await systemRegistrationService.updateSystem(systemId, systemData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update system');
    }
  }
);

export const updateSystemStatus = createAsyncThunk(
  'systemRegistration/updateSystemStatus',
  async ({ systemId, is_active }, { rejectWithValue }) => {
    try {
      const response = await systemRegistrationService.updateSystemStatus(systemId, { is_active });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update system status');
    }
  }
);

const systemRegistrationSlice = createSlice({
  name: 'systemRegistration',
  initialState: {
    systems: [],
    currentSystem: null,
    loading: false,
    error: null,
    success: false,
    formMode: 'create', // 'create' or 'edit'
  },
  reducers: {
    setFormMode: (state, action) => {
      state.formMode = action.payload;
    },
    setCurrentSystem: (state, action) => {
      state.currentSystem = action.payload;
    },
    clearCurrentSystem: (state) => {
      state.currentSystem = null;
      state.formMode = 'create';
    },
    clearError: (state) => {
      state.error = null;
    },
    clearSuccess: (state) => {
      state.success = false;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch systems
      .addCase(fetchSystems.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSystems.fulfilled, (state, action) => {
        state.loading = false;
        state.systems = action.payload.systems;
      })
      .addCase(fetchSystems.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Create system
      .addCase(createSystem.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(createSystem.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.systems.push(action.payload.system);
        state.currentSystem = null;
        state.formMode = 'create';
      })
      .addCase(createSystem.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Update system
      .addCase(updateSystem.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(updateSystem.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        const updatedSystem = action.payload.system;
        const index = state.systems.findIndex(sys => sys.system_id === updatedSystem.system_id);
        if (index !== -1) {
          state.systems[index] = updatedSystem;
        }
        state.currentSystem = null;
        state.formMode = 'create';
      })
      .addCase(updateSystem.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Update system status
      .addCase(updateSystemStatus.fulfilled, (state, action) => {
        const updatedSystem = action.payload.system;
        const index = state.systems.findIndex(sys => sys.system_id === updatedSystem.system_id);
        if (index !== -1) {
          state.systems[index].is_active = updatedSystem.is_active;
          if (state.systems[index].system_user) {
            state.systems[index].system_user.is_active = updatedSystem.is_active;
          }
        }
      });
  },
});

export const {
  setFormMode,
  setCurrentSystem,
  clearCurrentSystem,
  clearError,
  clearSuccess,
} = systemRegistrationSlice.actions;

export default systemRegistrationSlice.reducer;