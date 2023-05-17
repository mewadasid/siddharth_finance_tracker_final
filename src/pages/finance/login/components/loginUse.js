import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useNavigate, Link } from "react-router-dom";
import { getItem, setItem } from "../../requests/localstorage";
import "../css/loginStyle.css";
const validatioSchema = yup.object().shape({
  userEmail: yup
    .string()
    .trim()
    .required("Please Fill Email")
    .email("Please Enter Valid Email"),
  userPassword: yup.string().required("Please Fill Password").min(6).max(15),
});

export default function Loginform() {
  const [error, setError] = useState({});
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(validatioSchema),
    mode: "all",
    reValidateMode: "onSubmit",
  });

  const submit = (data) => {
    const registerData = getItem("userRegister");
    let credential = [];
    registerData.map((item, index) =>
      credential.push({
        email: registerData[index].userEmail,
        password: registerData[index].userPassword,
      })
    );
    for (let key in credential) {
      if (
        credential[key].email === data.userEmail &&
        credential[key].password === data.userPassword
      ) {
        setLocalStorage();
        break;
      } else {
        setError({
          ...error,
          wrong_credential: "Entered Email or password is wrong",
        });
      }
    }
  };

  const setLocalStorage = () => {
    const characters =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let token = "";
    for (let i = 0; i < 10; i++) {
      token += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    setItem("loginToken", token);
    navigate("/");
  };
  return (
    <div className="form_container">
      <form onSubmit={handleSubmit(submit)}>
        <div className="mb-3">
          <label for="exampleInputEmail1" className="form-label">
            Email address
          </label>
          <input
            {...register("userEmail")}
            type="text"
            name="userEmail"
            className="form-control"
            id="exampleInputEmail1"
            placeholder="test@gmail.com"
          />
          <div>
            <span className="error_msg mb-2">{errors.userEmail?.message}</span>
          </div>
          <div>
            <span className="error_msg mb-2">{error.wrong_credential}</span>
          </div>
        </div>
        <div className="mb-3">
          <label for="exampleInputPassword1" className="form-label">
            Password
          </label>
          <input
            {...register("userPassword")}
            type="password"
            name="userPassword"
            className="form-control"
            id="exampleInputPassword1"
            placeholder="password"
          />

          <div>
            <span className="error_msg mb-2">{error.wrong_credential}</span>
          </div>

          <div>
            <span className="error_msg mb-2">
              {errors.userPassword?.message}
            </span>
          </div>
        </div>
        <button type="submit" className="mb-2 btn btn-primary">
          Submit
        </button>
      </form>
      <span>New User </span>
      <Link to={"/register"}> Click For Register</Link>
    </div>
  );
}
