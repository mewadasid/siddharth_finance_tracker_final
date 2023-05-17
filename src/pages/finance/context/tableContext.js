import { createContext, useContext, useState } from "react";

import React from "react";
import { defaultTransaction } from "../utils/constant";

export const TransactionContext = createContext();
export const useTable = () => {
  return useContext(TransactionContext);
};
export default function TableProvider({ children }) {
  const [transactionData, setTransactionData] = useState(defaultTransaction);
  return (
    <div>
      <TransactionContext.Provider
        value={{ transactionData, setTransactionData }}
      >
        {children}
      </TransactionContext.Provider>
    </div>
  );
}
