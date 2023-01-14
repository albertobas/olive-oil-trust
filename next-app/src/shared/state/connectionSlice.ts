import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface IConnectionState {
  isConnected: boolean;
  isConnecting: boolean;
}

// initial state
const initialState = { isConnected: false, isConnecting: false };

// slice
const connectionSlice = createSlice({
  name: 'connection',
  initialState,
  reducers: {
    setConnection: (_, { payload: { isConnected, isConnecting } }: PayloadAction<IConnectionState>) => {
      return { isConnected, isConnecting };
    }
  }
});

export const { setConnection } = connectionSlice.actions;
export default connectionSlice.reducer;
