import { configureStore } from "@reduxjs/toolkit";
import transactionSlice from "./transactionSlice";
import userAuth from "./userAuth";

export default configureStore({
  reducer: {
    transaction: transactionSlice,
    register: userAuth,
  },
});
