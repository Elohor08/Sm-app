import { createSlice } from "@reduxjs/toolkit";

const userSlice = createSlice({
  name: "user",
  initialState: {
    currentUser: JSON.parse(localStorage.getItem("currentUser")) || null,
    socket: null,
    onlineUser: [],
  },
  reducers: {
    changeCurrentUser: (state, action) => {
      state.currentUser = action.payload;
    },
    setOnlineUsers: (state, action) => {
      state.onlineUser = action.payload;
    },
  },
});

export const userActions = userSlice.actions;
export default userSlice;
