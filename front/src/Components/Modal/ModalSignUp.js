import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { addNewUser } from "../../redux/actions/post.action";

export default function ModalSignUp({ onCancel }) {
  const [userSignIpData, setUserSignIpData] = useState({
    userName: "",
    userPassword: "",
    userPasswordVerif: "",
  });
  const [userNameOK, setUserNameOK] = useState(0);
  const [userPassOK, setUserPassOK] = useState(0);
  const [userPassVerifOK, setUserPassVerifOK] = useState(0);

  const dispatch = useDispatch();

  // FormChecker
  const userName_validate = (e) => {
    // Min3_Max24_a-zA-z09_(".","_","-")
    const res = {
      full: /(?!.*[\.\-\_]{2,})^[a-zA-Z0-9\.\-\_]{3,24}$/,
    };
    return res.full.test(e);
  };
  const userPassword_validate = (e) => {
    // Min8_a-zA-z09_specialChar(1Upper1Lower1Number)
    const res = {
      full: /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/,
    };
    return res.full.test(e);
  };

  const handleSignUp = (e) => {
    if (e.target.classList.contains("userNameSignIn")) {
      if (userName_validate(e.target.value) === true) {
        document.getElementById("spanUsername").style.backgroundColor =
          "#59cd90";

        const newUserSignInState = {
          ...userSignIpData,
          userName: e.target.value,
        };

        setUserSignIpData(newUserSignInState);
        setUserNameOK(1);
      }
    }
    if (userName_validate(e.target.value) === false) {
      document.getElementById("spanUsername").style.backgroundColor = "#9e2a2b";
      setUserNameOK(2);
    }
  };

  const handleSignUpPass = (e) => {
    if (e.target.classList.contains("userPasswordSignIn")) {
      if (userPassword_validate(e.target.value) === true) {
        document.getElementById("spanUserPass").style.backgroundColor =
          "#59cd90";
        const newUserSignInState = {
          ...userSignIpData,
          userPassword: e.target.value,
        };
        setUserSignIpData(newUserSignInState);
        setUserPassOK(1);
      }
      if (userPassword_validate(e.target.value) === false) {
        document.getElementById("spanUserPass").style.backgroundColor =
          "#9e2a2b";
        setUserPassOK(2);
      }
    }
  };

  const handleSignUpPassVerif = (e) => {
    if (e.target.classList.contains("userPasswordVerifSignIn")) {
      if (
        e.target.value === userSignIpData.userPassword &&
        userPassword_validate(e.target.value) === true
      ) {
        document.getElementById("spanUserPassValid").style.backgroundColor =
          "#59cd90";
        const newUserSignInState = {
          ...userSignIpData,
          userPasswordVerif: e.target.value,
        };
        setUserSignIpData(newUserSignInState);
        setUserPassVerifOK(1);
      }
      if (
        e.target.value !== userSignIpData.userPassword &&
        userPassword_validate(e.target.value) === false
      ) {
        document.getElementById("spanUserPassValid").style.backgroundColor =
          "#9e2a2b";
        setUserPassVerifOK(2);
      }
    }
  };

  const sendSignInInfos = (e) => {
    e.preventDefault();
    if (
      userName_validate(userSignIpData.userName) === true &&
      userPassword_validate(userSignIpData.userPassword) === true &&
      userSignIpData.userPassword === userSignIpData.userPasswordVerif
    ) {
      dispatch(addNewUser(userSignIpData));
    } else {
      alert("User infos are not valid, please try again.");
    }
  };

  return (
    <>
      <div className="modalSignUp">
        <p className="login__logo">Mtx</p>
        <form
          action=""
          className="modalSignUp__form"
          onSubmit={sendSignInInfos}
        >
          <div className="modalSignUp__div">
            <label htmlFor="username" className="modalSignUp__label"></label>
            <input
              type="text"
              className="modalSignUp__input userNameSignIn"
              id="username"
              onChange={handleSignUp}
              placeholder="Username"
            />
            <span className="modalSignUp__span" id="spanUsername"></span>
          </div>
          {userNameOK === 2 ? (
            <div className="modalSignUp__infos">
              <p className="modalSignUp__infosText">
                User name must contains at least 3 characters.
              </p>
            </div>
          ) : (
            ""
          )}
          <div className="modalSignUp__div">
            <label htmlFor="password" className="modalSignUp__label"></label>
            <input
              type="password"
              className="modalSignUp__input userPasswordSignIn"
              id="password"
              onChange={handleSignUpPass}
              placeholder="Password"
            />
            <span className="modalSignUp__span" id="spanUserPass"></span>
          </div>
          {userPassOK === 2 ? (
            <div className="modalSignUp__infos">
              <p className="modalSignUp__infosText">
                User password must contain at least 8 characters. <br />1
                capital letter, 1 lower and 1 number must be used.
              </p>
            </div>
          ) : (
            ""
          )}
          <div className="modalSignUp__div">
            <label
              htmlFor="passwordVerif"
              className="modalSignUp__label"
            ></label>
            <input
              type="password"
              className="modalSignUp__input userPasswordVerifSignIn"
              id="passwordVerif"
              onChange={handleSignUpPassVerif}
              placeholder="Password verification"
            />
            <span className="modalSignUp__span" id="spanUserPassValid"></span>
          </div>
          {userPassVerifOK === 2 ? (
            <div className="modalSignUp__infos">
              <p className="modalSignUp__infosText">
                User passwords are not valid or not the same.
              </p>
            </div>
          ) : (
            ""
          )}
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
