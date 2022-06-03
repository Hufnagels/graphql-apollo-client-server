import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  board: null,
  creator: null,
  history: [],
};

const boardSlice = createSlice({
  name: "whiteboard",
  initialState,
  reducers: {
    loadBoard: (state, action) => {
      console.log('action.payload', action.payload)
      return {
        ...state,
        board: action.payload.board,
        creator: action.payload.creator,
      }
    },
    saveBoard: (state, action) => {

    },
    clearBoard: (state, action) => {
      return initialState
    },
    updateBoard: (state, action) => {
      console.log('updateBoard',action.payload)
      return state
      const newElement = action.payload
      
      return {
        ...state,
        history: [
          ...state.history,
          newElement
        ]
      }
    },
  },
});

export const { loadBoard, saveBoard, clearBoard, updateBoard } = boardSlice.actions;

export default boardSlice.reducer;
