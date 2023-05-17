import React, { useContext } from "react";
import { useParams } from "react-router-dom";
import "../css/style.css";

import Transactionform from "../../transactionForm/components/useform";
import { useTable } from "../../context/tableContext";
export default function Edituser() {
  const { id } = useParams();

  const { transactionData } = useTable(); //Context
  const transDetail = [...transactionData];
  // const index = Object.values(transDetail)
  //   .map((item) => item.tran_id)
  //   .findIndex((did) => did == id);

  return (
    <div>
      {Object.values(transDetail)
        .filter((data) => data.tran_id == id)
        .map((item) => {
          // console.log(index);
          return <Transactionform formValues={item} userId={id} />;
        })}
    </div>
  );
}
