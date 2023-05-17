import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../css/style.css";

import Tablecomponent from "./tablecomponent";

export default function Transactiontable() {
  const navigate = useNavigate();
  const transDetail = JSON.parse(localStorage.getItem("Transaction"));

  const [transactions, setTransaction] = useState(transDetail);
  const [groupData, setGroupData] = useState({});


  const handleChange = (e) => {
    const group = e.target.value;
    console.log(group);
    const groupedMap = {};
    if (group !== "") {
      for (const e of transDetail) {
        if (groupedMap.hasOwnProperty(e[group])) {
          groupedMap[e[group]].push(e);
        } else {
          groupedMap[e[group]] = [e];
        }
      }
    }
    setGroupData(groupedMap);
  };

  const remove = () => {
    localStorage.removeItem("loginToken");
    navigate('/login')
  }

  return (
    <>

      <div>
        <Link to={"createTransaction"}>
          <button type="button" className="btn btn-primary my-2">
            Create Transaction
          </button>
        </Link>
      </div>
      {
        transactions ?
          <div className="container">
            <div className="topBarWrapper">
              <div>
                <select className="btn btn-primary mx-5" name="" onChange={handleChange}>
                  <option value=""></option>
                  <option value="tran_month">Month Year</option>
                  <option value="tran_type">Transaction Type</option>
                  <option value="tran_from">From Account</option>
                  <option value="tran_to">To Account</option>
                </select>
              </div>
              <div>
                <button type="button" onClick={() => remove()} className="btn btn-primary logOutbtn">LOGOUT</button>
              </div>
            </div>
            <Tablecomponent transactions={transactions} />
            {
              Object.keys(groupData).map((item) => {
                console.log(item)
                console.log("hello group", item, groupData[item]);
                return (
                  <Tablecomponent
                    transactions={groupData[item]}
                  />
                );
              })
            }
          </div >
          : <span>No data Found</span>
      }
    </>
  )
}
