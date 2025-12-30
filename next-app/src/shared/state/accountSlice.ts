import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { IContract } from '@features/shared/utils/interfaces';

export interface IAccountStateData {
  account: string;
  chainId: string;
  contract: IContract | null;
}

export interface IAccountState {
  data: IAccountStateData | null;
}

// initial state
const initialState: IAccountState = {
  data: null
};

// slice
const accountSlice = createSlice({
  name: 'account',
  initialState,
  reducers: {
    setAccount(state, { payload: { data } }: PayloadAction<IAccountState>) {
      state.data = data ? Object.assign({}, state.data, data) : null;
    }
  }
});

export const { setAccount } = accountSlice.actions;
export default accountSlice.reducer;
