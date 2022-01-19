import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { checkLoginInfos } from "../redux/actions/post.action";

export default function Login() {
  const [loginData, setLoginData] = useState({
    userName: "",
    userPassword: "",
  });

  const dispatch = useDispatch();

  const handleLogin = (e) => {
    if (e.target.classList.contains("userName")) {
      const newUserState = {
        ...loginData,
        userName: e.target.value,
      };
      setLoginData(newUserState);
      console.log(newUserState);
    }
  };

  const handlePass = (e) => {
    if (e.target.classList.contains("userPass")) {
      const newUserState = {
        ...loginData,
        userPassword: e.target.value,
      };
      setLoginData(newUserState);
      console.log(newUserState);
    }
  };

  const sendLoginInfos = (e) => {
    e.preventDefault();
    dispatch(checkLoginInfos(loginData));
  };

  return (
    <>
      <div className="login">
        <form action="" className="login__form" onSubmit={sendLoginInfos}>
          <label htmlFor="" className="login__label">
            Username
          </label>
          <input
            type="text"
            className="login__input  userName"
            onChange={handleLogin}
          />
          <label htmlFor="" className="login__label">
            Password
          </label>
          <input
            type="password"
            className="login__input userPass"
            onChange={handlePass}
          />
          <button className="login__btn">Login</button>
        </form>
      </div>
    </>
  );
}
