import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  isOpen: false,
  messages: [],
};

const chatSlice = createSlice({
  name: 'chat',
  initialState,
  reducers: {
    toggleChat: (state) => {
      state.isOpen = !state.isOpen;
    },
    addMessage: (state, action) => {
      state.messages.push(action.payload);
    },
    clearMessages: (state) => {
      state.messages = [];
    },
  },
});

export const { toggleChat, addMessage, clearMessages } = chatSlice.actions;

export default chatSlice.reducer;