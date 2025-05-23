import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  showFeature: false,
  showSolutions: false,
  showPlans: false,
  showFurtherMenu: false,
  showDropDown: false,
};

const NavBarSlice = createSlice({
  name: "navbar",
  initialState,
  reducers: {
    openShowFeatures: (state) => {
      state.showFeature = true;
      state.showSolutions = false;
      state.showPlans = false;
      state.showFurtherMenu = true;
    },
    openShowSolutions: (state) => {
      state.showFeature = false;
      state.showSolutions = true;
      state.showPlans = false;
      state.showFurtherMenu = true;
    },
    openShowPlans: (state) => {
      state.showFeature = false;
      state.showSolutions = false;
      state.showPlans = true;
      state.showFurtherMenu = true;
    },
    closeAllMenus: (state) => {
      state.showFeature = false;
      state.showSolutions = false;
      state.showPlans = false;
      state.showFurtherMenu = false;
    },
    closeOverAllMenus: (state) => {
      state.showFeature = false;
      state.showSolutions = false;
      state.showPlans = false;
      state.showFurtherMenu = false;
      state.showDropDown = false;
    },
    openDropDown: (state) => {
      state.showDropDown = true;
    },
    closeDropDown: (state) => {
      state.showDropDown = false;
    },
  },
});

export const {
  openShowPlans,
  openShowSolutions,
  openShowFeatures,
  closeAllMenus,
  closeOverAllMenus,
  openDropDown,
  closeDropDown
} = NavBarSlice.actions;

export default NavBarSlice.reducer;
