import { createSlice } from "@reduxjs/toolkit";
interface IinitialState {
  selectedImg: string | null;
  selectedColor: string | null;
  showBoardModal: boolean;
  showMore: boolean;
  showMoreColors: boolean;
  showMoreImgs: boolean;
}
const initialState: IinitialState = {
  selectedImg:
    "https://trello-backgrounds.s3.amazonaws.com/SharedBackground/2560x1707/c176ec219cc71b83695da82802ab31a7/photo-1742156345582-b857d994c84e.webp",
  selectedColor: null,
  showBoardModal: false,
  showMore: false,
  showMoreColors: false,
  showMoreImgs: false,
};

const BoardBackGroundSlice = createSlice({
  initialState,
  name: "BoardBackground",
  reducers: {
    openModal: (state) => {
      state.showBoardModal = true;
    },
    closeModal: (state) => {
      state.showBoardModal = false;
      state.showMore = false;
      state.showMoreColors = false;
      state.showMoreImgs = false;
    },
    openMore: (state) => {
      state.showMore = true;
    },
    closeMore: (state) => {
      state.showMore = false;
      state.showMoreColors = false;
      state.showMoreImgs = false;
    },
    openMoreColors: (state) => {
      state.showMoreColors = true;
      state.showMoreImgs = false;
    },
    closeMoreColors: (state) => {
      state.showMoreColors = false;
    },
    openMoreImgs: (state) => {
      state.showMoreImgs = true;
      state.showMoreColors = false;
    },
    closeMoreImgs: (state) => {
      state.showMoreImgs = false;
    },
    changeSelectedImg: (state, action) => {
      state.selectedImg = action.payload;
      state.selectedColor = null;
    },
    changeSelectedColor: (state, action) => {
      state.selectedColor = action.payload;
      state.selectedImg = null;
    },
  },
});
export const {
  openModal,
  closeModal,
  openMore,
  closeMore,
  openMoreColors,
  closeMoreColors,
  openMoreImgs,
  closeMoreImgs,
  changeSelectedImg,
  changeSelectedColor
} = BoardBackGroundSlice.actions;
export default BoardBackGroundSlice.reducer;
