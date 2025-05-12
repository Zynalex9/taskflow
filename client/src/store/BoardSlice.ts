import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { IBoard, IBoardResponse } from "../types/functionalites.types";
import axios from "axios";
interface initialState {
  boards: {
    yourBoards: IBoard[];
    otherBoards: IBoard[];
  } | null;
  loading: Boolean;
  error: string | null;
}
interface SingleBoardState {
  board: IBoard[] | null;
  loading: Boolean;
  error: string | null;
}
const initialState: initialState = {
  boards: null,
  loading: false,
  error: null,
};
const boardSliceState: SingleBoardState = {
  board: null,
  loading: false,
  error: null,
};
export const fetchAllBoards = createAsyncThunk(
  "fetchAllBoards",
  async (workspaceId: string, { rejectWithValue }) => {
    try {
      const response = await axios.get<IBoardResponse>(
        `http://localhost:3000/api/board/${workspaceId}/get-boards`,
        { withCredentials: true }
      );

      return {
        yourBoards: response.data.data.yourBoards,
        otherBoards: response.data.data.otherBoards,
      };
    } catch (error: any) {
      return rejectWithValue(
        error?.response?.data?.message || "Could not get workspace"
      );
    }
  }
);
export const fetchSingleBoard = createAsyncThunk(
  "fetchSingleBoard",
  async (boardId: string, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        `http://localhost:3000/api/board/single/${boardId}`,
        { withCredentials: true }
      );
      return response.data.data;
    } catch (error:any) {
      return rejectWithValue(
        error?.response?.data?.message || "Could not get workspace"
      );
    }
  }
);

export const boardsSlice = createSlice({
  initialState,
  name: "boards",
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllBoards.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        state.boards = null;
      })
      .addCase(fetchAllBoards.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.boards = null;
      })
      .addCase(fetchAllBoards.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.boards = action.payload;
      });
  },
});
export const boardSlice = createSlice({
  initialState: boardSliceState,
  name: "board",
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchSingleBoard.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        state.board = null;
      })
      .addCase(fetchSingleBoard.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.board = null;
      })
      .addCase(fetchSingleBoard.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.board = action.payload;
      });
  },
});
export const boardsReducer = boardsSlice.reducer;
export const boardReducer = boardSlice.reducer;
