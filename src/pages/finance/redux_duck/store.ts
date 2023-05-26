import { configureStore } from "@reduxjs/toolkit";
import transactionSlice from "./transactionSlice";
import userAuth from "./userAuth";

export const store = configureStore({
  reducer: {
    transaction: transactionSlice,
    register: userAuth,
  },
});
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
