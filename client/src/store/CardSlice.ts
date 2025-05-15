import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { ICard } from "../types/functionalites.types";
import axios from "axios";

interface IState {
  card: ICard | null;
  loading: boolean;
  error: null | string;
}
const initialState: IState = {
  card: null,
  error: null,
  loading: false,
};
export const fetchSingleCard = createAsyncThunk<ICard, string>(
  "fetchCard",
  async (cardId: string, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        `http://localhost:3000/api/card/single-card/${cardId}`,
        { withCredentials: true }
      );
      console.log("WE DID IT", response.data.data)
      return response.data.data;
    } catch (error:any) {
        console.log('we couldnt',error.message)
      return rejectWithValue("Error finding card");
    }
  }
);

const cardSlice = createSlice({
  initialState,
  name: "card",
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchSingleCard.pending, (state) => {
      state.loading = true;
      state.error = null;
      state.card = null;
    });
    builder.addCase(fetchSingleCard.fulfilled, (state, action) => {
      state.loading = false;
      state.error = null;
      state.card = action.payload;
    });
    builder.addCase(fetchSingleCard.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
      state.card = null;
    });
  },
});
export default cardSlice.reducer;
