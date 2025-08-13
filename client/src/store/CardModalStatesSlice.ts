import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  openMembers: false,
  openLabels: false,
  openChecklist: false,
  openDates: false,
  openCover: false,
  openAttachments: false,
  openSettings: false,
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
      state.openSettings = false;
    },
    openChecklistDropDown: (state) => {
      state.openAttachments = false;
      state.openChecklist = true;
      state.openCover = false;
      state.openDates = false;
      state.openLabels = false;
      state.openMembers = false;
      state.openSettings = false;
    },
    openAttachmentsDropDown: (state) => {
      state.openAttachments = true;
      state.openChecklist = false;
      state.openCover = false;
      state.openDates = false;
      state.openLabels = false;
      state.openMembers = false;
      state.openSettings = false;
    },
    openMembersDropDown: (state) => {
      state.openAttachments = false;
      state.openChecklist = false;
      state.openCover = false;
      state.openDates = false;
      state.openLabels = false;
      state.openMembers = true;
      state.openSettings = false;
    },
    openLabelsDropDown: (state) => {
      state.openAttachments = false;
      state.openChecklist = false;
      state.openCover = false;
      state.openDates = false;
      state.openLabels = true;
      state.openMembers = false;
      state.openSettings = false;
    },
    openDatesDropDown: (state) => {
      state.openAttachments = false;
      state.openChecklist = false;
      state.openCover = false;
      state.openDates = true;
      state.openLabels = false;
      state.openMembers = false;
      state.openSettings = false;
    },
    openCoverDropDown: (state) => {
      state.openAttachments = false;
      state.openChecklist = false;
      state.openCover = true;
      state.openDates = false;
      state.openLabels = false;
      state.openMembers = false;
      state.openSettings = false;
    },
    openSettingsDropDown: (state) => {
      state.openAttachments = false;
      state.openChecklist = false;
      state.openCover = false;
      state.openDates = false;
      state.openLabels = false;
      state.openMembers = false;
      state.openMembers = false;
      state.openSettings = true;
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
  openSettingsDropDown
} = CardModalSlice.actions;

export default CardModalSlice.reducer;
