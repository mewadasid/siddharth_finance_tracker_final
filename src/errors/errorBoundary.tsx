import React from "react";
import { Link } from "react-router-dom";

import "./errors.css";
export const FallbackError = ({
  error,
  resetErrorBoundary,
}: {
  error: Error;
  resetErrorBoundary: () => void;
}) => {
  return (
    <div className="container">
      <div className="flex_cont">
        <div className="img_container">
          <div className="img_wrapper">
            <img src="/bugs.jpg" alt="404 Error"></img>
          </div>
        </div>

        <div className="error_container">
          <div className="error_message">
            <h3 className="error_title">
              <span>Something</span> Went Wrong
            </h3>
            <pre className="error_message">{error.message}</pre>

            <button
              type="button"
              className="btn btn-primary "
              onClick={resetErrorBoundary}
            >
              Try Again
            </button>

            <Link to={"/"}>
              <button type="button" className="btn btn-primary mx-3">
                Go to home
              </button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
