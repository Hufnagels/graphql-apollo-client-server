import { createSlice } from "@reduxjs/toolkit";
import { PURGE } from "redux-persist";

let initialState = {
  user: null,
  isLoggedIn: false,
  tokens: null
}

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    login(state, action) {
      localStorage.setItem('token', action.payload.tokens.accessToken)

      return {
        ...state,
        user: action.payload.user,
        tokens: action.payload.tokens,
        isLoggedIn: true,
      }
    },
    logout(state, action) {
      localStorage.removeItem('token')
      return {
        ...state,
        user: null,
        tokens: null,
        isLoggedIn: false,
      }
    },
  },
  extraReducers: (builder) => {
    builder.addCase(PURGE, (state) => {
      login.removeAll(state);
    });
  }
})

export const { login, logout } = authSlice.actions;

export default authSlice.reducer;