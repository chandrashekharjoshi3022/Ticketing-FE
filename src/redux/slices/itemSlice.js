import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../api/axios";

export const fetchItems = createAsyncThunk("items/fetch", async () => {
  const res = await api.get("/items");
  return res.data;
});

export const addItem = createAsyncThunk("items/add", async (name) => {
  const res = await api.post("/items", { name });
  return res.data;
});

export const deleteItem = createAsyncThunk("items/delete", async (id) => {
  await api.delete(`/items/${id}`);
  return id;
});

// Add async thunk
export const updateItem = createAsyncThunk("items/update", async ({ id, name }) => {
  const res = await api.put(`/items/${id}`, { name });
  return res.data;
});

const itemSlice = createSlice({
  name: "items",
  initialState: { list: [], status: "idle" },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchItems.fulfilled, (state, action) => {
        state.list = action.payload;
      })
      .addCase(addItem.fulfilled, (state, action) => {
        state.list.push(action.payload);
      })
      .addCase(deleteItem.fulfilled, (state, action) => {
        state.list = state.list.filter((item) => item.id !== action.payload);
      })
      .addCase(updateItem.fulfilled, (state, action) => {
        const index = state.list.findIndex((i) => i.id === action.payload.id);
        if (index !== -1) state.list[index] = action.payload;
      });
  },
});

export default itemSlice.reducer;
