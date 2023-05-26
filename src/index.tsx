import React, { Suspense } from "react";
import ReactDOM from "react-dom/client";
import "./index.css";

import reportWebVitals from "./reportWebVitals";
import {
  RouterProvider,
  createBrowserRouter,
  createRoutesFromElements,
} from "react-router-dom";
import { store } from "./pages/finance/redux_duck/store";
import { Provider } from "react-redux";
import { CookiesProvider } from "react-cookie";
import routes from "./routes/route";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);
const rootRoute = createBrowserRouter(createRoutesFromElements(routes));

root.render(
  <Provider store={store}>
    <CookiesProvider>
      <Suspense fallback={<h1>Loading ....</h1>}>
        <RouterProvider router={rootRoute}></RouterProvider>
      </Suspense>
    </CookiesProvider>
  </Provider>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
