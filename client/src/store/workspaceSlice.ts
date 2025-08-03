import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

export interface Member {
  _id: string;
  role: string;
}

export interface Workspace {
  _id: string;
  name: string;
  admin: string[];
  boards: string[];
  members: {
    user: string;
    role: "admin" | "member";
  }[];
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
  cover: string;
}

export interface WorkspaceResponse {
  statusCode: number;
  data: Workspace;
  message: string;
  success: boolean;
}
interface WorkspaceState {
  workspace: Workspace | null;
  loading: boolean;
  error: string | null;
}

export const fetchworkspace = createAsyncThunk<
  WorkspaceResponse,
  string,
  { rejectValue: string }
>("getWorkspace", async (workspaceId: string, { rejectWithValue }) => {
  try {
    const response = await axios.get(
      `${
        import.meta.env.VITE_BASE_URL
      }/api/workspace/get-workspace?workspaceId=${workspaceId}`,
      { withCredentials: true }
    );
    return response.data;
  } catch (error: any) {
    return rejectWithValue(
      error?.response?.data?.message || "Could not get workspace"
    );
  }
});

const initialState: WorkspaceState = {
  workspace: null,
  loading: false,
  error: null,
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
