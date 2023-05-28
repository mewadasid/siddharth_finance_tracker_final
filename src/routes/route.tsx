import { Navigate } from "react-router-dom";
import React, { lazy } from "react";

const Displayuser = lazy(
  () => import("../pages/finance/financeTable/components/displayUser")
);
const Edituser = lazy(
  () => import("../pages/finance/financeTable/components/editUser")
);
const RegisterForm = lazy(
  () => import("../pages/finance/userAuth/registerUse")
);
const Loginform = lazy(() => import("../pages/finance/userAuth/loginUse"));
const TransactionShow = lazy(
  () => import("../pages/finance/financeTable/index")
);
const AddTransaction = lazy(
  () => import("../pages/finance/transactionForm/index")
);

export type routeType = {
  path: string;
  element?: JSX.Element;
  protected?: boolean;
  further?: Array<routeType>;
};

export const routeMapList: routeType = {
  path: "/",
  further: [
    {
      path: "",
      element: <Navigate to={"displayData"}></Navigate>,
    },
    {
      path: "login",
      element: <Loginform />,
      protected: false,
    },
    {
      path: "register",
      element: <RegisterForm />,
      protected: false,
    },

    {
      path: "displayData",
      further: [
        {
          path: "",
          element: <TransactionShow />,
          protected: true,
        },
        {
          path: "createTransaction",
          element: <AddTransaction />,
          protected: true,
        },
        {
          path: ":id",
          element: <Displayuser />,
          protected: true,
        },
        {
          path: "edit/:id",
          element: <Edituser />,
          protected: true,
        },
      ],
    },
    {
      path: "/*",
      element: <h1>404 Error</h1>,
    },
  ],
};
