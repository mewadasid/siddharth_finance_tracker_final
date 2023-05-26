import { useParams } from "react-router-dom";
import "../css/style.css";

import Transactionform from "../../transactionForm/components/useform";
import { useSelector } from "react-redux";
import { RootState } from "../../redux_duck/store";
export default function Edituser() {
  const { id } = useParams();
  const transaction_redux = useSelector((state: RootState) =>
    state.transaction.find(
      (trans) => id !== undefined && trans.tran_id === parseInt(id)
    )
  );

  return (
    <>
      {id !== undefined && transaction_redux !== undefined && (
        <div>
          <Transactionform
            formValues={transaction_redux}
            userId={parseInt(id)}
          />
          ;
        </div>
      )}
    </>
  );
}
