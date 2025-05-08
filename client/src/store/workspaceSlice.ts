import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

export const fetchworkspace = createAsyncThunk(
  "getWorkspace",
  async (workspaceId: string, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        `http://localhost:3000/api/workspace/get-workspaces?workspaceId=${workspaceId}`,
        { withCredentials: true }
      );
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error?.response?.data?.message || "Could not get workspace"
      );
    }
  }
);

const initialState = {
  workspace: {},
  loading: false,
  error: null as string | null,
};
const workspaceSlice = createSlice({
  initialState,
  name: "workspace",
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchworkspace.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchworkspace.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchworkspace.fulfilled, (state, action) => {
        state.error = null;
        state.loading = false;
        state.workspace = action.payload.data;
      });
  },
});
export default workspaceSlice.reducer;
