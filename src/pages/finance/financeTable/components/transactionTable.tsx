import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../css/style.css";

import Tablecomponent from "./tablecomponent";

import { useSelector } from "react-redux";
import { Cookies } from "react-cookie";
import { RootState } from "../../redux_duck/store";
import { TransactionType } from "../../../../model/transactionInterface";

export default function Transactiontable() {
  const navigate = useNavigate();
  const cookie = new Cookies();
  const transaction_redux = useSelector(
    (state: RootState) => state.transaction
  );
  type groupType = {
    [key: string]: TransactionType[];
  };

  const [transactions, setTransaction] = useState(transaction_redux);
  const [groupData, setGroupData] = useState<groupType>({});
  useEffect(() => {
    setTransaction(transaction_redux);
  }, [transaction_redux]);

  const [isGroup, setIsGroup] = useState(false);
  const [groupVal, setGroupVal] = useState("");

  useEffect(() => {
    if (isGroup === true) {
      handleChange(groupVal);
    }
    //eslint-disable-next-line
  }, [transactions]);

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement> | string) => {
    let groupedMap: groupType = {};
    let cloneTransaction = [...transactions];
    setIsGroup(true);
    if (typeof e !== "string" && e.target) {
      const group = e.target.value;
      setGroupVal(group);

      if (group !== "") {
        for (const key of cloneTransaction) {
          if (groupedMap.hasOwnProperty(key[group])) {
            groupedMap[key[group]].push(key);
          } else {
            groupedMap[key[group]] = [key];
          }
        }
        setGroupData(groupedMap ?? {});
      }
    } else {
      if (typeof e === "string") {
        for (const key of cloneTransaction) {
          if (groupedMap.hasOwnProperty(key[e])) {
            groupedMap[key[e]].push(key);
          } else {
            groupedMap[key[e]] = [key];
          }
        }
        setGroupData(groupedMap ?? {});
      }
    }
  };

  const logout = () => {
    const status = window.confirm("Are you sure for logout?");
    if (status) {
      cookie.remove("token", { path: "/" });
      navigate("/login");
    }
  };
  return (
    <>
      <div>
        <Link to={"createTransaction"}>
          <button type="button" className="btn btn-primary my-2">
            Create Transaction
          </button>
        </Link>
      </div>

      {transactions.length > 0 ? (
        <div className="container-fluid">
          <div className="topBarWrapper">
            <div>
              <select
                className="btn btn-primary mx-5"
                name=""
                onChange={handleChange}
              >
                <option value="">None</option>
                <option value="tran_month">Month Year</option>
                <option value="tran_type">Transaction Type</option>
                <option value="tran_from">From Account</option>
                <option value="tran_to">To Account</option>
              </select>
            </div>
            <div>
              <button
                type="button"
                onClick={() => logout()}
                className="btn btn-primary logOutbtn"
              >
                LOGOUT
              </button>
            </div>
          </div>
          <Tablecomponent transactions={transactions} />

          {Object.keys(groupData).length > 0 &&
            Object.keys(groupData).map((item) => {
              return (
                <Tablecomponent
                  transactions={groupData[item]}
                  groupVal={groupVal}
                />
              );
            })}
        </div>
      ) : (
        <span>No data Found</span>
      )}
    </>
  );
}
