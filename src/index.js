import React, { Suspense } from "react";
import ReactDOM from "react-dom/client";

import "./index.css";

import reportWebVitals from "./reportWebVitals";

import { Provider } from "react-redux";
import store from "./pages/finance/redux_duck/store";
import { CookiesProvider } from "react-cookie";
import {
  RouterProvider,
  createBrowserRouter,
  createRoutesFromElements,
} from "react-router-dom";
import routes from "./routes/route";
const root = ReactDOM.createRoot(document.getElementById("root"));

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

reportWebVitals();
