import { Route, Navigate } from "react-router-dom";
import Protected from "../protected/components/protectedRoute";
import { lazy } from "react";

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

const routes = (
  <Route path="/">
    <Route
      path="login"
      element={<Protected ispublic={true} Cmp={<Loginform />} />}
    ></Route>
    <Route
      path="register"
      element={<Protected ispublic={true} Cmp={<RegisterForm />} />}
    ></Route>
    <Route path="displayData">
      <Route
        path=""
        element={<Protected ispublic={false} Cmp={<TransactionShow />} />}
      ></Route>
      <Route
        path="createTransaction"
        element={<Protected ispublic={false} Cmp={<AddTransaction />} />}
      ></Route>
      <Route
        path=":id"
        element={<Protected ispublic={false} Cmp={<Displayuser />} />}
      ></Route>
      <Route
        path="edit/:id"
        element={<Protected ispublic={false} Cmp={<Edituser />} />}
      ></Route>
    </Route>
    <Route path="" element={<Navigate to={"/displayData"}></Navigate>}></Route>
    <Route path="/*" element={<h1>404 Error</h1>}></Route>
  </Route>
);

export default routes;
