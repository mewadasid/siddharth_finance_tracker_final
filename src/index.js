import React from "react";
import ReactDOM from "react-dom/client";

import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import "./index.css";

import reportWebVitals from "./reportWebVitals";
import Form from "./pages/finance/transactionForm/components/form";
import Displayuser from "./pages/finance/financeTable/components/displayUser";
import Edituser from "./pages/finance/financeTable/components/editUser";


import Transactiontable from "./pages/finance/financeTable/components/transactionTable";

import LoginPage from "./pages/finance/login";
import RegisterPage from "./pages/finance/register";
import Protected from "./pages/finance/protected/components/protectedRoute";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <BrowserRouter>
    <Routes>
      <Route path="/">
        <Route path="login" element={<LoginPage />}></Route>
        <Route path="register"  element={<RegisterPage />}></Route>

        <Route path="displayData">
          <Route path="" element={<Protected Cmp={<Transactiontable />} />}></Route>
          <Route path="createTransaction" element={<Protected Cmp={<Form />} />}></Route>
          <Route path=":id" element={<Protected Cmp={<Displayuser />} />}></Route>
          <Route path="edit/:id" element={<Protected Cmp={<Edituser />} />}></Route>
        </Route>
        <Route path="" element={<Navigate to={'/displayData'}></Navigate>}></Route>
      </Route>

    </Routes>
  </BrowserRouter >
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
