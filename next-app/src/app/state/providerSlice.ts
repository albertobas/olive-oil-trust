import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { providers } from 'ethers';

export interface IProviderState {
  error: boolean | null;
  data: providers.Web3Provider | null;
}

// initial state
const initialState: IProviderState = {
  error: null,
  data: null
};

// slice
const providerSlice = createSlice({
  name: 'provider',
  initialState,
  reducers: {
    setProvider(state, { payload: { error, data } }: PayloadAction<IProviderState>) {
      state.error = error;
      state.data = data ? data : null;
    }
  }
});

export const { setProvider } = providerSlice.actions;
export default providerSlice.reducer;
