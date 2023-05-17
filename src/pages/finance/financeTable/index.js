import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import "./css/style.css";

import Tablecomponent from "./components/tablecomponent";

export default function Transactiontable() {
  const sortOrder = useRef("");
  const transDetail = JSON.parse(localStorage.getItem("Transaction"));

  const [transactions, setTransaction] = useState(transDetail);
  const [groupData, setGroupData] = useState({});
  const fixedlimit = 3;
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

  return (
    <div>
      <Link to={"/createTransaction"}>
        <button type="button" className="btn btn-primary my-4 ">
          Create Transaction
        </button>
      </Link>
      <select className="btn btn-primary mx-5" name="" onChange={handleChange}>
        <option value=""></option>
        <option value="tran_month">Month Year</option>
        <option value="tran_type">Transaction Type</option>
        <option value="tran_from">From Account</option>
        <option value="tran_to">To Account</option>
      </select>
      <Tablecomponent transactions={transactions} fixedlimit={fixedlimit} />

      {Object.keys(groupData).map((item) => {
        debugger;
        console.log("hello group", item, groupData[item]);
        return (
          <Tablecomponent
            transactions={groupData[item]}
            fixedlimit={fixedlimit}
          />
        );
      })}
    </div>
  );
}
