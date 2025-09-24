// src/features/auth/authSlice.js (only the slice content)
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import AuthService from './AuthService';

export const login = createAsyncThunk('auth/login', async (data, thunkAPI) => {
  try { return await AuthService.login(data); }
  catch (err) { return thunkAPI.rejectWithValue(err.response?.data?.message || err.message); }
});

export const getMe = createAsyncThunk('auth/getMe', async (_, thunkAPI) => {
  try { return await AuthService.getMe(); }
  catch (err) { return thunkAPI.rejectWithValue(null); }
});

export const logout = createAsyncThunk('auth/logout', async () => {
  return await AuthService.logout();
});

const initialState = {
  user: null,
  isLoading: false,
  isError: false,
  message: '',
  isInitialized: false,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // login
      .addCase(login.pending, (s) => {
        s.isLoading = true;
        s.isError = false;
      })
      .addCase(login.fulfilled, (s, a) => {
        s.isLoading = false;
        // Support both { user } and user direct returns
        s.user = (a.payload && (a.payload.user ?? a.payload)) || null;
        s.isInitialized = true;
      })
      .addCase(login.rejected, (s, a) => {
        s.isLoading = false;
        s.isError = true;
        s.message = a.payload || a.error?.message;
        s.isInitialized = true; // make sure init completes even on login failure
      })

      // getMe
      .addCase(getMe.pending, (s) => {
        s.isInitialized = false;
      })
      .addCase(getMe.fulfilled, (s, a) => {
        s.user = (a.payload && (a.payload.user ?? a.payload)) || null;
        s.isInitialized = true;
      })
      .addCase(getMe.rejected, (s) => {
        s.user = null;
        s.isInitialized = true;
      })

      // logout
      .addCase(logout.fulfilled, (s) => {
        s.user = null;
      });
  }
});

export default authSlice.reducer;
