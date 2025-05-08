import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

export const fetchworkspace = createAsyncThunk(
  "getWorkspace",
  async (workspaceId: string, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        "http://localhost:3000/api/workspace/get-workspaces",
        { params: workspaceId }
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
};
const workspaceSlice = createSlice({
  initialState,
  name: "workspace",
  reducers: {},
});
export default workspaceSlice.reducer;
