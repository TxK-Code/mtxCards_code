import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { addNewUser } from "../../redux/actions/post.action";

export default function ModalSignUp({ onCancel }) {
  const [userSignIpData, setUserSignIpData] = useState({
    userName: "",
    userPassword: "",
    userPasswordVerif: "",
  });

  const dispatch = useDispatch();

  const handleSignUp = (e) => {
    if (e.target.classList.contains("userNameSignIn")) {
      const newUserSignInState = {
        ...userSignIpData,
        userName: e.target.value,
      };
      setUserSignIpData(newUserSignInState);
    }
  };

  const handleSignUpPass = (e) => {
    if (e.target.classList.contains("userPasswordSignIn")) {
      const newUserSignInState = {
        ...userSignIpData,
        userPassword: e.target.value,
      };
      setUserSignIpData(newUserSignInState);
    }
  };

  const handleSignUpPassVerif = (e) => {
    if (e.target.classList.contains("userPasswordVerifSignIn")) {
      const newUserSignInState = {
        ...userSignIpData,
        userPasswordVerif: e.target.value,
      };
      setUserSignIpData(newUserSignInState);
    }
  };

  const sendSignInInfos = (e) => {
    e.preventDefault();
    dispatch(addNewUser(userSignIpData));
  };

  return (
    <>
      <div className="modalSignUp">
        <form
          action=""
          className="modalSignUp__form"
          onSubmit={sendSignInInfos}
        >
          <div className="modalSignUp__div">
            <label htmlFor="username" className="modalSignUp__label">
              Username
            </label>
            <input
              type="text"
              className="modalSignUp__input userNameSignIn"
              id="username"
              onChange={handleSignUp}
            />
            <span className="modalSignUp__span"></span>
          </div>
          <div className="modalSignUp__div">
            <label htmlFor="password" className="modalSignUp__label">
              Password
            </label>
            <input
              type="password"
              className="modalSignUp__input userPasswordSignIn"
              id="password"
              onChange={handleSignUpPass}
            />
            <span className="modalSignUp__span"></span>
          </div>
          <div className="modalSignUp__div">
            <label htmlFor="passwordVerif" className="modalSignUp__label">
              Password verification
            </label>
            <input
              type="password"
              className="modalSignUp__input userPasswordVerifSignIn"
              id="passwordVerif"
              onChange={handleSignUpPassVerif}
            />
            <span className="modalSignUp__span"></span>
          </div>
          <button className="modalSignUp__btn" type="submit">
            Create Account
          </button>
          <button
            className="modalSignUp__btnLogin"
            type="button"
            onClick={onCancel}
          >
            Login
          </button>
        </form>
      </div>
    </>
  );
}
