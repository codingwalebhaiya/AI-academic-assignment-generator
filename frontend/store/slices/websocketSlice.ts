// web socket state 

import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { IWebSocketMessage } from '../../types';

interface WebSocketState {
  isConnected: boolean;
  lastMessage: IWebSocketMessage | null;
  error: string | null;
}

const initialState: WebSocketState = {
  isConnected: false,
  lastMessage: null,
  error: null,
};

const websocketSlice = createSlice({
  name: 'websocket',
  initialState,
  reducers: {
    setConnected: (state, action: PayloadAction<boolean>) => {
      state.isConnected = action.payload;
    },
    setLastMessage: (state, action: PayloadAction<IWebSocketMessage>) => {
      state.lastMessage = action.payload;
    },
    setWebSocketError: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
    },
    clearWebSocketError: (state) => {
      state.error = null;
    },
  },
});

export const { setConnected, setLastMessage, setWebSocketError, clearWebSocketError } = websocketSlice.actions;
export default websocketSlice.reducer;