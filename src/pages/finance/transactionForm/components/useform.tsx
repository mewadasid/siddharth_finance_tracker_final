import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import Selectcombo from "./comboBox";
import {
  monthOpiton,
  transactionType,
  fromToAccount,
  fileConvert,
} from "../../../utils/constant";
import "../css/formStyle.css";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useDispatch, useSelector } from "react-redux";
import {
  addTransaction,
  updateTransaction,
} from "../../redux_duck/transactionSlice";
import { TransactionType } from "../../../../model/transactionInterface";
import { RootState } from "../../redux_duck/store";

export default function Transactionform({
  formValues,
  userId,
}: {
  formValues?: TransactionType;
  userId?: number;
}) {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const transaction_redux = useSelector(
    (state: RootState) => state.transaction
  );

  let intialTransaction: TransactionType;
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
        tran_amount: 0,
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
      .test(
        "required",
        "Please Choose File",
        (value: yup.AnyObject | undefined) => {
          return value && value.length > 0;
        }
      )
      .test(
        "To big",
        "File Size Must be less than 1MB",
        (value: yup.AnyObject | undefined) => {
          if (value) {
            if (typeof value === "string") {
              return true;
            } else {
              if (value[0] !== undefined) {
                return !(value[0].size > 1024 * 1024 * 1);
              }
            }
          }
        }
      )
      .test(
        "File type",
        "File type must be JPG PNG",
        (value: yup.AnyObject | undefined) => {
          if (value) {
            if (typeof value === "string") {
              return true;
            } else {
              if (value[0] !== undefined) {
                return SUPPORTED_FORMATS.includes(value[0].type);
              }
            }
          }
        }
      ),
    tran_note: yup.string().trim().required("Please Enter Notes"),
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<TransactionType>({
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

  const submitHandle = (data: TransactionType) => {
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
          let previousId = getData[getData.length - 1].tran_id;
          if (previousId !== undefined) {
            transaction.tran_id = previousId + 1;
            // getData.push(transaction);
            dispatch(addTransaction(transaction)); //Redux Data
          }
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

  const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files !== null) {
      const file_banner = e.target.files[0];

      const fileString = await fileConvert(file_banner);

      if (typeof fileString == "string") {
        setTransaction({ ...transaction, tran_receipt: fileString });
      }
    }
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
            <div className="row mb-3">
              <label htmlFor="inputEmail3" className="col-sm-2 col-form-label">
                Transaction Date:
              </label>
              <div className="col-sm-10">
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
            <div className="row mb-3">
              <label htmlFor="inputEmail3" className="col-sm-2 col-form-label">
                Transaction Month:
              </label>
              <div className="col-sm-10">
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
            <div className="row mb-3">
              <label htmlFor="inputEmail3" className="col-sm-2 col-form-label">
                Transaction Type:
              </label>
              <div className="col-sm-10">
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
            <div className="row mb-3">
              <label htmlFor="inputEmail3" className="col-sm-2 col-form-label">
                Transaction From:
              </label>
              <div className="col-sm-10">
                <Selectcombo
                  name="tran_from"
                  id="tranFrom"
                  option={fromToAccount}
                  register={register}
                />
                <div>
                  <span className="fieldError">
                    {errors.tran_from?.message}
                  </span>
                </div>
              </div>
            </div>
            <div className="row mb-3">
              <label htmlFor="inputEmail3" className="col-sm-2 col-form-label">
                Transaction To:
              </label>
              <div className="col-sm-10">
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
            <div className="row mb-3">
              <label htmlFor="inputEmail3" className="col-sm-2 col-form-label">
                Transaction Amount:
              </label>
              <div className="col-sm-10">
                <input
                  {...register("tran_amount")}
                  type="number"
                  name="tran_amount"
                  id="tranAmount"
                />
                <div>
                  <span className="fieldError">
                    {errors.tran_amount?.message}
                  </span>
                </div>
              </div>
            </div>
            <div className="row mb-3">
              <label htmlFor="inputEmail3" className="col-sm-2 col-form-label">
                Transaction Receipt:
              </label>
              <div className="col-sm-10">
                {transaction.tran_receipt !== "" ? (
                  <>
                    <img
                      src={transaction.tran_receipt}
                      width="100"
                      alt="content"
                    />
                    <i
                      className="fa-solid fa-circle-xmark fa-lg mx-3"
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
            <div className="row mb-3">
              <label htmlFor="inputEmail3" className="col-sm-2 col-form-label">
                Transaction Note:
              </label>
              <div className="col-sm-10">
                <textarea
                  {...register("tran_note")}
                  name="tran_note"
                  id="tranNote"
                  rows={3}
                ></textarea>
                <div>
                  <span className="fieldError">
                    {errors.tran_note?.message}
                  </span>
                </div>
              </div>
            </div>
            <button type="submit" className="btn btn-primary">
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
