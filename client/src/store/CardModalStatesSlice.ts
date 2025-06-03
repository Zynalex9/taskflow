import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  openMembers: false,
  openLabels: false,
  openChecklist: false,
  openDates: false,
  openCover: false,
  openAttachments: false,
};

const CardModalSlice = createSlice({
  name: "cardModalSlice",
  initialState,
  reducers: {
    closeAllDropDown: (state) => {
      state.openAttachments = false;
      state.openChecklist = false;
      state.openCover = false;
      state.openDates = false;
      state.openLabels = false;
      state.openMembers = false;
    },
    openChecklistDropDown: (state) => {
      state.openAttachments = false;
      state.openChecklist = true;
      state.openCover = false;
      state.openDates = false;
      state.openLabels = false;
      state.openMembers = false;
    },
    openAttachmentsDropDown: (state) => {
      state.openAttachments = true;
      state.openChecklist = false;
      state.openCover = false;
      state.openDates = false;
      state.openLabels = false;
      state.openMembers = false;
    },
    openMembersDropDown: (state) => {
      state.openAttachments = false;
      state.openChecklist = false;
      state.openCover = false;
      state.openDates = false;
      state.openLabels = false;
      state.openMembers = true;
    },
    openLabelsDropDown: (state) => {
      state.openAttachments = false;
      state.openChecklist = false;
      state.openCover = false;
      state.openDates = false;
      state.openLabels = true;
      state.openMembers = false;
    },
    openDatesDropDown: (state) => {
      state.openAttachments = false;
      state.openChecklist = false;
      state.openCover = false;
      state.openDates = true;
      state.openLabels = false;
      state.openMembers = false;
    },
    openCoverDropDown: (state) => {
      state.openAttachments = false;
      state.openChecklist = false;
      state.openCover = true;
      state.openDates = false;
      state.openLabels = false;
      state.openMembers = false;
    },
  },
});

export const {
  closeAllDropDown,
  openChecklistDropDown,
  openAttachmentsDropDown,
  openMembersDropDown,
  openLabelsDropDown,
  openDatesDropDown,
  openCoverDropDown,
} = CardModalSlice.actions;

export default CardModalSlice.reducer;
