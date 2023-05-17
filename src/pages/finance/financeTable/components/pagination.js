import { React } from "react";
import "../css/style.css";
export default function Pagination({
  pageChange,
  number,
  previous,
  cuurentPage,
  next,
  noPage,
}) {
  return (
    <div className="paginationNumber">
      <span onClick={() => previous()}>Prev</span>

      {number.length <= 3
        ? number.map((pageNo) => {
            return (
              <span
                key={pageNo}
                className={`${cuurentPage == pageNo ? "active" : ""}`}
                onClick={() => pageChange(pageNo)}
              >
                {pageNo}
              </span>
            );
          })
        : number.slice(cuurentPage - 1, cuurentPage - 1 + 3).map((pageNo) => {
            return (
              <>
                <span
                  className={`${cuurentPage == pageNo ? "active" : ""}`}
                  onClick={() => pageChange(pageNo)}
                >
                  {pageNo}
                </span>
              </>
            );
          })}

      <span
        className={`${noPage == 1 ? "disable" : ""}`}
        onClick={() => next()}
      >
        Next
      </span>
    </div>
  );
}
