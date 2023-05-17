import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import Selectcombo from "./comboBox";
import { monthOpiton, transactionType, fromToAccount } from '../../utils/constant'
import "../css/formStyle.css";
export default function Form({ formValues, userIndex, userId }) {
  console.log(formValues, "FORM")
  const navigate = useNavigate();
  let intialTransaction;
  formValues ? intialTransaction = {
    tran_id: formValues.tran_id,
    tran_date: formValues.tran_date,
    tran_month: formValues.tran_month,
    tran_type: formValues.tran_type,
    tran_from: formValues.tran_from,
    tran_to: formValues.tran_to,
    tran_amount: formValues.tran_amount,
    tran_receipt: formValues.tran_receipt,
    tran_note: formValues.tran_note,
  } :
    intialTransaction = {
      tran_date: "",
      tran_month: "",
      tran_type: "",
      tran_from: "",
      tran_to: "",
      tran_amount: "",
      tran_receipt: "",
      tran_note: "",
    };
  const [transaction, setTransaction] = useState(intialTransaction);
  const [formerror, setFormError] = useState({});


  const setShow = () => {
    setTransaction({ ...transaction, tran_receipt: "" });
  }

  const isSubmit = useRef(false);
  const handelSubmit = (e) => {
    let error = '';
    if (isSubmit.current === false) {
      error = emptyCheck();
    }
    ;
    console.log(error);

    if (Object.keys(error).length > 0) {
      setFormError(error);
      e.preventDefault();
    }
    else {
      if (Object.keys(formerror).length > 0) {
        e.preventDefault();
      } else {
        setLocalstorage();
        navigate("/displayData");
      }
    }

  }

  const setLocalstorage = () => {

    setTransaction({ ...transaction, })
    let getData = JSON.parse(localStorage.getItem("Transaction"));
    if (getData !== null) {
      debugger
      if (formValues) {
        const index = Object.values(getData).map((item) => item.tran_id).findIndex((userIndex) => userIndex == formValues.tran_id)
        console.log(index, "USE INED")



        console.log(transaction, "UPDATE TRASN")
        getData[index] = Object.assign(getData[index], transaction);
        console.log(getData, "NEW GETDATA");

      }
      else {

        const previousId = getData[getData.length - 1].tran_id;
        console.log(previousId)
        transaction.tran_id = previousId + 1;
        getData.push(transaction);
      }

      localStorage.setItem("Transaction", JSON.stringify(getData));
    } else {

      const transaction_clone = { ...transaction };
      console.log(transaction_clone)
      transaction_clone.tran_id = 1;

      localStorage.setItem("Transaction", JSON.stringify([transaction_clone]));
    }
  }

  console.log(formerror)

  const handelChange = (e, index) => {
    const { name, value } = e.target;

    setTransaction({ ...transaction, [name]: value });

    console.log(name + "--" + value);
    switch (name) {
      case "tran_receipt":
        if (e.target.files[0].size > "100000") {
          setFormError({
            ...formerror,
            file_error: "Files size must be less than 1 MB",
          });
        } else {
          setFormError((c) => {
            console.log(c);
            const { file_big, ...rest } = c;
            return rest;
          });

          let fileExtension = e.target.files[0].type;
          fileExtension = fileExtension.substr(
            fileExtension.indexOf("/") + 1,
            fileExtension.length
          );

          console.log(typeof fileExtension);
          if (
            fileExtension.toLowerCase() === "jpeg" ||
            fileExtension.toLowerCase() === "jpg" ||
            fileExtension.toLowerCase() === "png"
          ) {
            setFormError((c) => {
              console.log(c);
              const { file_error, ...rest } = c;
              return rest;
            });
          } else {
            setFormError({
              ...formerror,
              file_error: "File type must be JPG PNG JPEG",
            });
          }

          const reader = new FileReader();
          const file_banner = e.target.files[0];

          reader.addEventListener("load", () => {
            let imgSrc = reader.result;
            setTransaction({ ...transaction, [name]: imgSrc });
          });
          reader.readAsDataURL(file_banner);
          setShow(true);
        }
        break;

      default:
        console.log("object");
        break;
    }
  }

  const stopFIrst = useRef(true);
  useEffect(
    () => {
      if (stopFIrst.current === true) {
        stopFIrst.current = false;
        return;
      }
      else {
        let clone = Object.assign({}, formerror);
        Object.keys(transaction).map((item) => {

          if (transaction[item] !== "") {
            delete clone[item];
          }
          setFormError(clone);
        })

        if (Object.keys(clone).length > 0) {
          isSubmit.current = false;
        }



        if (transaction["tran_date"] !== "") {
          const date = new Date();
          const currentDate = date.toISOString().split('T')[0];

          if (transaction["tran_date"] > currentDate) {
            setFormError({ ...formerror, date_error: " Date cannot be greater than today" })
          }
          else {
            setFormError((c) => {
              console.log(c);
              const { date_error, ...rest } = c;
              return rest;
            });
          }
        }
        if ((transaction["tran_from"] && transaction["tran_to"]) !== "") {
          if (transaction["tran_from"] === transaction["tran_to"]) {
            setFormError({ ...formerror, account_same: "Both same" });
          } else {
            setFormError((c) => {
              console.log(c);
              const { account_same, ...rest } = c;
              return rest;
            });
          }
        }
        if (transaction["tran_amount"] !== "") {
          if (
            transaction["tran_amount"] === '0' ||
            transaction["tran_amount"] < 0
          ) {
            setFormError({
              ...formerror,
              amount_error: "Amount should be greater than 0",
            });
          } else {
            setFormError((c) => {
              console.log(c);
              const { amount_error, ...rest } = c;
              return rest;
            });
          }
        }

        if (transaction['tran_note'] !== "") {
          if (transaction['tran_note'].trim() === "") {
            setFormError({ ...formerror, note_error: "write something white space not allowed" });
          }
          else {
            if (transaction["tran_note"].length > 250) {
              setFormError({ ...formerror, note_error: "Length is reached!!!" });
            } else {
              setFormError((c) => {
                console.log(c);
                const { note_error, ...rest } = c;
                return rest;
              });
            }
          }
        }


      }

    },
    //eslint-disable-next-line
    [transaction]
  );


  console.log(isSubmit)
  console.log(formerror)
  const emptyCheck = () => {

    const error = {};
    let i = 0;
    const error_name = ['transaction Date', 'transaction Month', 'transaction Type', 'transaction From'
      , 'transaction To', 'transaction Amount', 'transaction Receipt', 'transaction Note'];
    for (let key in transaction) {
      if (transaction[key] == "") {
        error[key] = `Please Fill ${error_name[i]}`;
      }
      i = i + 1;
    }
    console.log(error);
    isSubmit.current = true;
    return error;
  };

  const remove = () => {
    localStorage.removeItem("loginToken");
    navigate('/login');
  }

  return (
    <div>

      <div>
        <button type="button" onClick={() => remove()} className="btn btn-primary my-2">LOGOUT</button>
        <form
          className="userform"
          encType="multipart/form-data"
          onSubmit={handelSubmit}
        >
          {formerror.field_empty ? (
            <div className="formWrapper mb-3">{formerror.field_empty}</div>
          ) : null}
          <div className="userFormWraper">
            <div class="row mb-3">
              <label for="inputEmail3" class="col-sm-2 col-form-label">Transaction Date:</label>
              <div class="col-sm-10">
                <input
                  type="date"
                  name="tran_date"
                  id="tranDate"
                  onChange={handelChange}
                  value={transaction.tran_date}
                />
                <div><span className="fieldError">{formerror.date_error}</span></div>
                <div><span className="fieldError">{formerror.tran_date}</span></div>
              </div>
            </div>
            <div class="row mb-3">
              <label for="inputEmail3" class="col-sm-2 col-form-label">Transaction Month:</label>
              <div class="col-sm-10">
                <Selectcombo
                  name="tran_month"
                  id="tranMonth"
                  option={monthOpiton}
                  onchange={handelChange}
                  formValues={transaction.tran_month}
                />
                <div><span className="fieldError">{formerror.tran_month}</span></div>

              </div>
            </div>
            <div class="row mb-3">
              <label for="inputEmail3" class="col-sm-2 col-form-label">Transaction Type:</label>
              <div class="col-sm-10">
                <Selectcombo
                  name="tran_type"
                  id="tranType"
                  option={transactionType}
                  onchange={handelChange}
                  formValues={transaction.tran_type}
                />
                <div><span className="fieldError">{formerror.tran_type}</span></div>

              </div>
            </div>
            <div class="row mb-3">
              <label for="inputEmail3" class="col-sm-2 col-form-label">Transaction From:</label>
              <div class="col-sm-10">
                <Selectcombo
                  name="tran_from"
                  id="tranFrom"
                  option={fromToAccount}
                  onchange={handelChange}
                  formValues={transaction.tran_from}


                />
                <div><span className="fieldError">{formerror.account_same}</span></div>
                <div><span className="fieldError">{formerror.tran_from}</span></div>

              </div>
            </div>
            <div class="row mb-3">
              <label for="inputEmail3" class="col-sm-2 col-form-label">Transaction To:</label>
              <div class="col-sm-10">
                <Selectcombo
                  name="tran_to"
                  id="tranFrom"
                  option={fromToAccount}
                  onchange={handelChange}
                  formValues={transaction.tran_to}

                />
                <div><span className="fieldError">{formerror.account_same}</span></div>
                <div><span className="fieldError">{formerror.tran_to}</span></div>

              </div>
            </div>
            <div class="row mb-3">
              <label for="inputEmail3" class="col-sm-2 col-form-label">Transaction Amount:</label>
              <div class="col-sm-10">
                <input
                  type="number"
                  name="tran_amount"
                  id="tranAmount"
                  onChange={handelChange}
                  value={transaction.tran_amount}

                />
                <div><span className="fieldError">{formerror.amount_error}</span></div>
                <div><span className="fieldError">{formerror.tran_amount}</span></div>

              </div>
            </div>
            <div class="row mb-3">
              <label for="inputEmail3" class="col-sm-2 col-form-label">Transaction Receipt:</label>
              <div class="col-sm-10">
                {transaction.tran_receipt !== "" ?
                  <>
                    <img src={transaction.tran_receipt}
                      width="100"
                      alt="content"
                    />
                    <i
                      class="fa-solid fa-circle-xmark fa-lg mx-3"
                      onClick={() => setShow()}
                    />
                  </>
                  : <input
                    type="file"
                    name="tran_receipt"
                    id="tranReceipt"
                    onChange={handelChange}
                  />}

                <div><span className="fieldError">{formerror.file_error}</span></div>
                <div><span className="fieldError">{formerror.tran_receipt}</span></div>

              </div>
            </div>
            <div class="row mb-3">
              <label for="inputEmail3" class="col-sm-2 col-form-label">Transaction Note:</label>
              <div class="col-sm-10">
                <textarea
                  name="tran_note"
                  id="tranNote"
                  rows="3"
                  onChange={handelChange}
                  value={transaction.tran_note}

                ></textarea>
                <div><span className="fieldError">{formerror.note_error}</span></div>
                <div><span className="fieldError">{formerror.tran_note}</span></div>

              </div>
            </div>

            <button type="submit" class="btn btn-primary">Submit</button>
          </div>
        </form>
      </div>
    </div >
  );
}
