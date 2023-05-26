import "../css/style.css";

type paginationType = {
  number: number[];
  currentPage: number;
  next: () => void;
  previous: () => void;
  pageChange: (pageNo: number) => void;
  noPage: number;
};
export default function Pagination({
  pageChange,
  number,
  previous,
  currentPage,
  next,
  noPage,
}: paginationType) {
  return (
    <div className="paginationNumber">
      <span onClick={() => previous()}>Prev</span>

      {number.length <= 3
        ? number.map((pageNo: number) => {
            return (
              <span
                key={pageNo}
                className={`${currentPage == pageNo ? "active" : ""}`}
                onClick={() => pageChange(pageNo)}
              >
                {pageNo}
              </span>
            );
          })
        : number
            .slice(currentPage - 1, currentPage - 1 + 3)
            .map((pageNo: number) => {
              return (
                <>
                  <span
                    className={`${currentPage == pageNo ? "active" : ""}`}
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
