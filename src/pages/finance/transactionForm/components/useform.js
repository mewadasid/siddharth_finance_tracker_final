import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import Selectcombo from "./comboBox";
import {
  monthOpiton,
  transactionType,
  fromToAccount,
} from "../../utils/constant";
import "../css/formStyle.css";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useDispatch, useSelector } from "react-redux";
import {
  addTransaction,
  updateTransaction,
} from "../../redux_duck/transactionSlice";
export default function Transactionform({ formValues, userId }) {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const transaction_redux = useSelector((state) => state.transaction);

  let intialTransaction;
  formValues
    ? (intialTransaction = {
        tran_id: formValues.tran_id,
        tran_date: formValues.tran_date,
        tran_month: formValues.tran_month,
        tran_type: formValues.tran_type,
        tran_from: formValues.tran_from,
        tran_to: formValues.tran_to,
        tran_amount: formValues.tran_amount,
        tran_receipt: formValues.tran_receipt,
        tran_note: formValues.tran_note,
      })
    : (intialTransaction = {
        tran_date: "",
        tran_month: "",
        tran_type: "",
        tran_from: "",
        tran_to: "",
        tran_amount: "",
        tran_receipt: "",
        tran_note: "",
      });
  const [transaction, setTransaction] = useState(intialTransaction);

  const SUPPORTED_FORMATS = ["image/jpg", "image/jpeg", "image/png"];
  const validatioSchema = yup.object().shape({
    tran_date: yup.string().required("Please Fill Transaction Date"),
    tran_month: yup.string().required("Please Select Transaction Month"),
    tran_type: yup.string().required("Please Select Transaction Type"),
    tran_from: yup
      .string()
      .required("Please Select Transaction From")
      .test({
        name: "Same",
        skipAbsent: true,
        test(value, ctx) {
          if (value === this.parent.tran_to) {
            return ctx.createError({
              message: "From Account adn To Account is Same",
            });
          }
          return true;
        },
      }),
    tran_to: yup
      .string()
      .required("Please Select Transaction To")
      .test({
        name: "Same",
        skipAbsent: true,
        test(value, ctx) {
          if (value === this.parent.tran_from) {
            return ctx.createError({
              message: "From Account adn To Account is Same",
            });
          }
          return true;
        },
      }),
    tran_amount: yup
      .number()
      .required()
      .typeError("Please Enter Amount")
      .min(1, "Amount Must be greater than 0"),
    tran_receipt: yup
      .mixed()
      .test("required", "Please Choose File", (value) => {
        return value && value.length > 0;
      })
      .test("To big", "File Size Must be less than 1MB", (value) => {
        if (typeof value === "string") {
          return true;
        } else {
          if (value.length !== 0) {
            return !(value[0].size > 1024 * 1024 * 1);
          }
        }
      })
      .test("File type", "File type must be JPG PNG", (value) => {
        if (typeof value === "string") {
          return true;
        } else {
          if (value.length !== 0) {
            return SUPPORTED_FORMATS.includes(value[0].type);
          }
        }
      }),
    tran_note: yup.string().trim().required("Please Enter Notes"),
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm({
    resolver: yupResolver(validatioSchema),
    mode: "all",
    defaultValues: intialTransaction,
  });

  const setShow = () => {
    setTransaction({ ...transaction, tran_receipt: "" });
    setValue("tran_receipt", "");
    submit.current = false;
  };

  const submit = useRef(false);

  const logout = () => {
    localStorage.removeItem("loginToken");
    navigate("/login");
  };

  const submitHandle = (data) => {
    data.tran_receipt = transaction.tran_receipt;
    setTransaction(data);
    submit.current = true;
  };

  const stop = useRef(false);
  useEffect(() => {
    if (stop.current) {
      stop.current = false;
      return;
    }
    if (submit.current === true) {
      let getData = transaction_redux;

      if (getData !== null && getData !== undefined && getData.length !== 0) {
        if (formValues) {
          dispatch(updateTransaction({ transaction, id: userId }));
          // const index = Object.values(getData).findIndex(
          //   (userIndex) => userIndex.tran_id == formValues.tran_id
          // );
          // getData[index] = transaction;
        } else {
          const previousId = getData[getData.length - 1].tran_id;

          transaction.tran_id = previousId + 1;
          // getData.push(transaction);
          dispatch(addTransaction(transaction)); //Redux Data
        }

        navigate("/");
      } else {
        const transaction_clone = { ...transaction };
        console.log(transaction_clone);
        transaction_clone["tran_id"] = 1;
        dispatch(addTransaction(transaction_clone));

        navigate("/");
      }
    }
    //eslint-disable-next-line
  }, [transaction]);

  const handleChange = (e) => {
    console.log("object");
    const reader = new FileReader();
    const file_banner = e.target.files[0];
    reader.addEventListener("load", () => {
      let imgSrc = reader.result;
      setTransaction({ ...transaction, tran_receipt: imgSrc });
    });
    reader.readAsDataURL(file_banner);
  };

  return (
    <div>
      <div>
        <button
          type="button"
          onClick={() => logout()}
          className="btn btn-primary my-2"
        >
          LOGOUT
        </button>
        <button
          type="button"
          onClick={() => navigate("/")}
          className="btn btn-primary my-2 mx-3"
        >
          Back To Dashboard
        </button>

        <form
          className="userform"
          encType="multipart/form-data"
          onSubmit={handleSubmit(submitHandle)}
        >
          <div className="userFormWraper">
            <div class="row mb-3">
              <label for="inputEmail3" class="col-sm-2 col-form-label">
                Transaction Date:
              </label>
              <div class="col-sm-10">
                <input
                  {...register("tran_date")}
                  type="date"
                  name="tran_date"
                  id="tranDate"
                  max={new Date().toISOString().split("T")[0]}
                />
                <div>
                  <span className="fieldError">
                    {errors.tran_date?.message}
                  </span>
                </div>
              </div>
            </div>
            <div class="row mb-3">
              <label for="inputEmail3" class="col-sm-2 col-form-label">
                Transaction Month:
              </label>
              <div class="col-sm-10">
                <Selectcombo
                  register={register}
                  name="tran_month"
                  id="tranMonth"
                  option={monthOpiton}
                />
                <div>
                  <span className="fieldError">
                    {errors.tran_month?.message}
                  </span>
                </div>
              </div>
            </div>
            <div class="row mb-3">
              <label for="inputEmail3" class="col-sm-2 col-form-label">
                Transaction Type:
              </label>
              <div class="col-sm-10">
                <Selectcombo
                  register={register}
                  name="tran_type"
                  id="tranType"
                  option={transactionType}
                />
                <div>
                  <span className="fieldError">
                    {errors.tran_type?.message}
                  </span>
                </div>
              </div>
            </div>
            <div class="row mb-3">
              <label for="inputEmail3" class="col-sm-2 col-form-label">
                Transaction From:
              </label>
              <div class="col-sm-10">
                <Selectcombo
                  name="tran_from"
                  id="tranFrom"
                  option={fromToAccount}
                  register={register}

                  // {...register('tran_from')}
                />
                <div>
                  <span className="fieldError">
                    {errors.tran_from?.message}
                  </span>
                </div>
              </div>
            </div>
            <div class="row mb-3">
              <label for="inputEmail3" class="col-sm-2 col-form-label">
                Transaction To:
              </label>
              <div class="col-sm-10">
                <Selectcombo
                  register={register}
                  name="tran_to"
                  id="tranFrom"
                  option={fromToAccount}
                />
                <div>
                  <span className="fieldError">{errors.tran_to?.message}</span>
                </div>
              </div>
            </div>
            <div class="row mb-3">
              <label for="inputEmail3" class="col-sm-2 col-form-label">
                Transaction Amount:
              </label>
              <div class="col-sm-10">
                <input
                  {...register("tran_amount")}
                  type="number"
                  name="tran_amount"
                  id="tranAmount"
                  // onChange={handelChange}
                  // value={transaction.tran_amount}
                />
                <div>
                  <span className="fieldError">
                    {errors.tran_amount?.message}
                  </span>
                </div>
              </div>
            </div>
            <div class="row mb-3">
              <label for="inputEmail3" class="col-sm-2 col-form-label">
                Transaction Receipt:
              </label>
              <div class="col-sm-10">
                {transaction.tran_receipt !== "" ? (
                  <>
                    <img
                      src={transaction.tran_receipt}
                      width="100"
                      alt="content"
                    />
                    <i
                      class="fa-solid fa-circle-xmark fa-lg mx-3"
                      onClick={() => setShow()}
                    />
                  </>
                ) : (
                  <input
                    {...register("tran_receipt", { onChange: handleChange })}
                    type="file"
                    name="tran_receipt"
                    id="tranReceipt"
                  />
                )}

                <div>
                  <span className="fieldError">
                    {errors.tran_receipt?.message}
                  </span>
                </div>
              </div>
            </div>
            <div class="row mb-3">
              <label for="inputEmail3" class="col-sm-2 col-form-label">
                Transaction Note:
              </label>
              <div class="col-sm-10">
                <textarea
                  {...register("tran_note")}
                  name="tran_note"
                  id="tranNote"
                  rows="3"
                ></textarea>
                <div>
                  <span className="fieldError">
                    {errors.tran_note?.message}
                  </span>
                </div>
              </div>
            </div>
            <button type="submit" class="btn btn-primary">
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
