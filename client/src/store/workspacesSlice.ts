import { IBoard } from "@/types/functionalites.types";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

interface IWorkspace {
  _id: string;
  name: string;
  admin: string[];
  boards: IBoard[];
  members: { role: string; _id: string }[];
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
  cover?: string;
}

interface IinitialState {
  workspaces: IWorkspace[]; 
  loading: boolean;
  error: string | null;
}

const initialState: IinitialState = {
  workspaces: [],
  error: null,
  loading: false,
};

export const getAllWorkspaces = createAsyncThunk(
  "allWorkspaces",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BASE_URL}/api/workspace/get-workspaces`,
        { withCredentials: true }
      );
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(
        error?.response?.data?.message || "Could not get workspaces"
      );
    }
  }
);

const allWorkspacesSlice = createSlice({
  name: "allWorkspaces",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getAllWorkspaces.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAllWorkspaces.fulfilled, (state, action) => {
        state.loading = false;
        state.workspaces = action.payload;
      })
      .addCase(getAllWorkspaces.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export default allWorkspacesSlice.reducer;
