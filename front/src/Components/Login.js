import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

import { checkLoginInfos } from "../redux/actions/post.action";

import ModalSignUp from "../Components/Modal/ModalSignUp";

export default function Login() {
  const { userLogged } = useSelector((state) => state.userLoggedNow);

  const [loginData, setLoginData] = useState({
    userName: "",
    userPassword: "",
  });

  const dispatch = useDispatch();
  const history = useNavigate();

  useEffect(() => {
    if (userLogged[0]) {
      localStorage.setItem("user", JSON.stringify(userLogged[0]));
      history("/index");
    }
  }, [userLogged]);

  const handleLogin = (e) => {
    if (e.target.classList.contains("userName")) {
      const newUserState = {
        ...loginData,
        userName: e.target.value,
      };
      setLoginData(newUserState);
    }
  };

  const handlePass = (e) => {
    if (e.target.classList.contains("userPass")) {
      const newUserState = {
        ...loginData,
        userPassword: e.target.value,
      };
      setLoginData(newUserState);
    }
  };

  const sendLoginInfos = (e) => {
    e.preventDefault();
    dispatch(checkLoginInfos(loginData));
  };

  const [modalSignUp, setModalSignUp] = useState(false);

  const toggleModalSignUp = () => {
    setModalSignUp(!modalSignUp);
  };

  const handleModalSignUp = (e) => {
    e.preventDefault();
    setModalSignUp(!modalSignUp);
  };

  return (
    <>
      {modalSignUp === false ? (
        <div className="login">
          <p className="login__logo">Mtx</p>
          <form action="" className="login__form" onSubmit={sendLoginInfos}>
            <label htmlFor="username" className="login__label"></label>
            <input
              type="text"
              className="login__input  userName"
              onChange={handleLogin}
              id="username"
              placeholder="UserName"
            />
            <label htmlFor="password" className="login__label"></label>
            <input
              type="password"
              className="login__input userPass"
              onChange={handlePass}
              id="password"
              placeholder="Password"
            />
            <button className="login__btn" type="submit">
              Login
            </button>
            <button
              className="login__btnCreate"
              type="button"
              onClick={handleModalSignUp}
            >
              Create account
            </button>
          </form>
        </div>
      ) : (
        ""
      )}
      {modalSignUp && <ModalSignUp onCancel={() => toggleModalSignUp()} />}
    </>
  );
}
