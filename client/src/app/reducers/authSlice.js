import { createSlice } from "@reduxjs/toolkit";
import { PURGE } from "redux-persist";
import { REACT_APP_LS_TOKEN_NAME } from '../config/config'

let initialState = {
  user: null,
  isLoggedIn: false,
  tokens: null
}

// console.log('REACT_APP_LS_TOKEN_NAME', REACT_APP_LS_TOKEN_NAME)
export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    login: (state, action) => {
      localStorage.setItem(REACT_APP_LS_TOKEN_NAME, action.payload.tokens.accessToken)

      return {
        ...state,
        user: action.payload.user,
        tokens: action.payload.tokens,
        isLoggedIn: true,
      }
    },
    logout: (state, action) => {
      localStorage.removeItem(REACT_APP_LS_TOKEN_NAME)
      return {
        ...state,
        user: null,
        isLoggedIn: false,
        tokens: null
      }
    },
    refreshtoken: (state, action) => {
      localStorage.setItem(REACT_APP_LS_TOKEN_NAME, action.payload.tokens.accessToken)
      return {
        ...state,
        tokens: action.payload.tokens,
      }
    },
  },
  extraReducers: (builder) => {
    builder.addCase(PURGE, (state) => {
      logout.removeAll(state);
    });
  }
})

export const { login, logout, refreshtoken } = authSlice.actions;

export default authSlice.reducer;