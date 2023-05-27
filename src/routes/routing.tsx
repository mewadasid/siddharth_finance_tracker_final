import {
  Route,
  createBrowserRouter,
  createRoutesFromElements,
} from "react-router-dom";
import Protected from "../protected/components/protectedRoute";

import { routeMapList, routeType } from "./route";
import { ErrorBoundary } from "react-error-boundary";
import { FallbackError } from "../errors/errorBoundary";

const mapRoute = (item: routeType) => {
  return (
    <Route path={item.path} key={item.path}>
      {item.further?.map((routeItem) => {
        switch (routeItem.further !== undefined) {
          case true:
            return mapRoute(routeItem);

          default:
            return (
              <Route
                key={routeItem.path}
                path={routeItem.path}
                element={
                  <ErrorBoundary FallbackComponent={FallbackError}>
                    {routeItem.protected !== undefined ? (
                      <Protected
                        ispublic={!routeItem.protected}
                        Cmp={routeItem.element}
                      />
                    ) : (
                      routeItem.element
                    )}
                  </ErrorBoundary>
                }
              ></Route>
            );
        }
      })}
    </Route>
  );
};

export const rootRoute = createBrowserRouter(
  createRoutesFromElements(mapRoute(routeMapList))
);

export default rootRoute;
