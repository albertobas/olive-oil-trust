import accountSlice from '@shared/state/accountSlice';
import providerSlice from '@app/state/providerSlice';
import connectionSlice from '@shared/state/connectionSlice';
import { configureStore } from '@reduxjs/toolkit';

export const store = configureStore({
  reducer: {
    account: accountSlice,
    connection: connectionSlice,
    provider: providerSlice
  },
  // ethers.js Web3Provider contains circular references which yield a type error if converting them
  // to JSON string notation. Therefore, I opted for ignoring the serializable check on the following
  // paths
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: { ignoredActionPaths: ['payload.data'], ignoredPaths: ['provider.data'] }
    })
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
