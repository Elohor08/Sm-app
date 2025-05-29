import { createSlice } from "@reduxjs/toolkit";

let savedTheme;
try {
  savedTheme = JSON.parse(localStorage.getItem("theme"));
} catch (e) {
  savedTheme = null;
}

const initialState = {
  themeModalIsOpen: false,
  editProfileModalOpen: false,
  editPostModalOpen: false,
  editPostId: "",
  theme: savedTheme || { primaryColor: "" },
};

const uiSlice = createSlice({
  name: "ui",
  initialState,
  reducers: {
    openThemeModal: (state) => {
      state.themeModalIsOpen = true;
    },
    closeThemeModal: (state) => {
      state.themeModalIsOpen = false;
    },
    changeTheme: (state, action) => {
      state.theme = action.payload;
    },
    openEditProfileModal: (state) => {
      state.editProfileModalOpen = true;
    },
    closeEditProfileModal: (state) => {
      state.editProfileModalOpen = false;
    },
    openEditPostModal: (state, action) => {
      state.editPostModalOpen = true;
      state.editPostId = action.payload;
    },
    closeEditPostModal: (state) => {
      state.editPostModalOpen = false;
    },
  },
});

export const uiSliceActions = uiSlice.actions;
export default uiSlice;
