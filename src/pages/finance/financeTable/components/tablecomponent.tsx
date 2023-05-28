import { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import Pagination from "./pagination";
import toast, { Toaster } from "react-hot-toast";
import { useDispatch } from "react-redux";
import { deleteTransaction } from "../../redux_duck/transactionSlice";
import { TransactionType } from "../../../../model/transactionInterface";
import { table_heading } from "../../../../utils/constant";

export default function Tablecomponent(props: {
  transactions: TransactionType[];
  groupVal?: string;
}) {
  const [newData, setNewData] = useState(props.transactions);

  const dispatch = useDispatch();

  useEffect(() => {
    setNewData(props.transactions);
  }, [props.transactions]);

  const [currentPage, setCurrentPage] = useState(1);
  const perPageLimit = 3;
  const firstIndex = currentPage;
  const displayData =
    newData &&
    newData.slice((firstIndex - 1) * perPageLimit, firstIndex * perPageLimit);

  const noPage = Math.ceil(newData && newData.length / perPageLimit);
  const number = [...Array(noPage + 1).keys()].slice(1);

  const pageChange = (pageNo: number) => {
    setCurrentPage(pageNo);
  };

  const previous = () => {
    if (currentPage !== 1) {
      setCurrentPage(currentPage - 1);
    }
  };
  const next = () => {
    if (currentPage !== noPage) {
      setCurrentPage(currentPage + 1);
    }
  };

  const [lastSortkey, setLastSortKey] = useState("");
  const sortOrder = useRef("");
  const sorting = (sortBy: string) => {
    setCurrentPage(1);
    setLastSortKey(sortBy);
    if (sortBy === lastSortkey && sortOrder.current === "asc") {
      sortOrder.current = "desc";
    } else if (sortBy === lastSortkey && sortOrder.current === "desc") {
      sortOrder.current = "";
    } else {
      sortOrder.current = "asc";
    }
    performSort(sortBy);
  };

  const month = [
    "JAN 2023",
    "FEB 2023",
    "MARCH 2023",
    "APRIL 2023",
    "MAY 2023",
    "JUNE 2023",
    "JULY 2023",
    "AUGUST 2023",
    "SEPTEMBER 2023",
    "OCTOBER 2023",
    "NOVEMBER 2023",
    "DECEMBER 2023",
  ];
  const monthChecker = (months: string, sort: string) => {
    let sortedmonth;
    switch (sort) {
      case "asc":
        sortedmonth = [...newData].sort((a, b) =>
          month.indexOf(a[months]) >= month.indexOf(b[months]) ? 1 : -1
        );
        break;
      case "desc":
        sortedmonth = [...newData].sort((a, b) =>
          month.indexOf(a[months]) <= month.indexOf(b[months]) ? 1 : -1
        );
        break;
      default:
        sortedmonth = props.transactions;
        break;
    }
    return sortedmonth;
  };

  const dateChecker = (dates: string, sort: string) => {
    let sorteddate;
    switch (sort) {
      case "asc":
        sorteddate = [...newData].sort((a, b) => {
          const dateFirst = new Date(a[dates]);
          const dateSecond = new Date(b[dates]);
          return dateFirst >= dateSecond ? 1 : -1;
        });
        break;
      case "desc":
        sorteddate = [...newData].sort((a, b) => {
          const dateFirst = new Date(a[dates]);
          const dateSecond = new Date(b[dates]);
          return dateFirst <= dateSecond ? 1 : -1;
        });
        break;
      default:
        sorteddate = props.transactions;
        break;
    }
    return sorteddate;
  };

  const amountChecker = (amount: string, sort: string) => {
    let sortedamount;
    switch (sort) {
      case "asc":
        sortedamount = [...newData].sort((a, b) => {
          return Number(a[amount]) > Number(b[amount]) ? 1 : -1;
        });
        break;
      case "desc":
        sortedamount = [...newData].sort((a, b) => {
          return Number(a[amount]) < Number(b[amount]) ? 1 : -1;
        });

        break;
      default:
        sortedamount = props.transactions;
        break;
    }
    return sortedamount;
  };

  const performSort = (sortBy: string) => {
    switch (sortOrder.current) {
      case "asc":
        if (sortBy === "tran_date") {
          const data3 = dateChecker(sortBy, "asc");
          setNewData(data3);
        } else if (sortBy === "tran_month") {
          const data3 = monthChecker(sortBy, "asc");
          setNewData(data3);
        } else if (sortBy === "tran_amount") {
          const data3 = amountChecker(sortBy, "asc");
          setNewData(data3);
        } else {
          const data3 = [...newData].sort((a, b) =>
            a[sortBy].localeCompare(b[sortBy])
          );
          setNewData(data3);
        }
        break;

      case "desc":
        if (sortBy === "tran_date") {
          const data3 = dateChecker(sortBy, "desc");
          setNewData(data3);
        } else if (sortBy === "tran_month") {
          const data3 = monthChecker(sortBy, "desc");
          setNewData(data3);
        } else if (sortBy === "tran_amount") {
          const data3 = amountChecker(sortBy, "desc");
          setNewData(data3);
        } else {
          const data3 = [...newData].sort((a, b) =>
            b[sortBy].localeCompare(a[sortBy])
          );
          setNewData(data3);
        }
        break;
      default:
        const data3 = props.transactions;
        setNewData(data3);
        break;
    }
  };

  /* Debounce */

  const debounce = (func: Function, delay: number) => {
    let timer: ReturnType<typeof setTimeout>;
    return function (this: any, ...args: any[]) {
      clearTimeout(timer);
      timer = setTimeout(() => func.apply(this, args), delay); // whenever we call anynomous function which call from debounce.passing 'this' into inner function refer to same context/this where you call debounce
    };
  };

  /* Debounce */
  const searchInput = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { value } = e.target;
    const cloneData = [...props.transactions];

    if (value !== "") {
      const search = cloneData.filter((data) => {
        return Object.keys(data).some((item) => {
          if (
            item != "tran_id" &&
            item != "tran_receipt" &&
            data[item].toString().toLowerCase().includes(value.toLowerCase())
          ) {
            return item;
          }
          return 0;
        });
      });

      if (search.length !== 0) {
        toast.success("Data Founded", {
          duration: 1300,
        });
      } else {
        toast.error("No Data Found", {
          duration: 1300,
        });
      }
      setNewData(search);
    } else {
      setNewData(props.transactions);
    }
  };

  const removeTransaction = (id: number) => {
    toast.success("Record Deleted", {
      icon: <i className="fa-solid fa-trash"></i>,
      style: {
        minWidth: "150px",
        color: "#713200",
      },
    });
    dispatch(deleteTransaction({ id: id }));
  };



  return (
    <>
      <Toaster
        toastOptions={{
          // Define default options
          className: "",
          duration: 5000,
          style: {
            background: "#fff",
            color: "#000",
          },

          // Default options for specific types
          success: {
            duration: 3000,
          },
        }}
      />
      <form className="d-flex mx-3 mb-4">
        <input
          className="form-control me-1 searchBar"
          onChange={debounce(searchInput, 500)}
          type="search"
          placeholder="Search"
          aria-label="Search"
        />
      </form>
      {displayData ? (
        <table className="table main_table">
          <thead className="table-dark">
            <tr>
         {Object.keys(table_heading).map((key)=>{
        
            return (
             props.transactions.length > 1 && key!=="tran_receipt" && key!=="view" && key!=="edit" &&key!=="delete"  ?  
             
              <th  key={key} onClick={()=> sorting(key)}>
                <div className="t_head">
                
                {table_heading[key]}
                 {sortOrder.current === "asc" &&
                    lastSortkey === key ? (
                      <i className="fa-sharp fa-solid fa-caret-up mx-3"></i>
                    ) : sortOrder.current === "desc" &&
                      lastSortkey === key ? (
                      <i className="fa-sharp fa-solid fa-caret-down mx-3"></i>
                    ) : (
                      <i className="fa-solid fa-sort"></i>
                    )}
                </div>
                </th> : <th scope="col" key={key}>{table_heading[key]}</th>
            )
         })}
          
            </tr>
          </thead>
          <tbody>
            {displayData.map((item: TransactionType, index: number) => {
              return (
                <tr key={index}>
                  <td>{item.tran_date}</td>
                  <td>{item.tran_month}</td>
                  <td>{item.tran_type}</td>
                  <td>{item.tran_from}</td>
                  <td>{item.tran_to}</td>
                  <td>
                    {Intl.NumberFormat("en-IN", {
                      style: "currency",
                      currency: "INR",
                      minimumFractionDigits: 0,
                    }).format(item.tran_amount)}
                  </td>
                  <td>
                    <img src={item.tran_receipt} width="100px" alt="Content" />
                  </td>
                  <td>{item.tran_note}</td>
                  <td>
                    <Link to={`${item.tran_id}`}>
                      <i className="fa-solid fa-eye"></i>
                    </Link>
                  </td>
                  <td>
                    <Link to={`edit/${item.tran_id}`}>
                      <i className="fa-solid fa-pen-to-square"></i>
                    </Link>
                  </td>
                  <td>
                    <i
                      className="fa-solid fa-trash"
                      onClick={() => {
                        if (item.tran_id !== undefined)
                          removeTransaction(item.tran_id);
                      }}
                    ></i>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      ) : (
        <span> No Dat Found</span>
      )}
      <Pagination
        pageChange={pageChange}
        // {...newData}
        currentPage={currentPage}
        number={number}
        previous={previous}
        next={next}
        noPage={noPage}
      />
    </>
  );
}
