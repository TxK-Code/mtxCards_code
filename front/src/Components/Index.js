import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";

import { wallet } from "../redux/actions/post.action";

export default function Index() {
  const { countCards } = useSelector((state) => state.countCardsDB);

  const dispatch = useDispatch();
  const userInfosLS = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    dispatch(wallet(userInfosLS));
  }, []);

  return (
    <>
      <div className="indexHeader">
        <div className="indexHeaderL">
          <div className="indexHeaderL__container">
            <h1 className="indexHeaderL__title">Mtx is your card manager!</h1>
            <p className="indexHeaderL__description">
              With Mtx you can check the value of your collection in real time
              and admire your cards without having to worry about damaging them.
            </p>

            <h2 className="indexHeaderL__titleTwo">
              Number of cards : {countCards[0] === 0 ? "0" : countCards[0]}
            </h2>
            <h2 className="indexHeaderL__titleTwo">Total value : 12345$</h2>
          </div>
        </div>
        <div className="indexHeaderR">
          <img
            src="https://magic-casual.fr/wp-content/uploads/2017/05/Magic-The-Gathering-cartes-678x381.jpg"
            alt="Image de cartes Magic"
            className="indexHeaderR__img"
          />
        </div>
      </div>
    </>
  );
}
