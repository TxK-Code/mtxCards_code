import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { wallet } from "../redux/actions/post.action";
import { v4 as uuidv4 } from "uuid";

export default function Collection() {
  const { allCardsList } = useSelector(
    (state) => state.allCardsSelectedReducer
  );

  if (localStorage.getItem("user") === null) {
    alert("Please LogIn");
    window.location.href = "http://localhost:3000/mtxCards/";
  }

  const dispatch = useDispatch();

  const userInfosLS = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    dispatch(wallet(userInfosLS));
  }, []);

  return (
    <>
      <div className="collection">
        <div className="collection__leftPanel">
          <h2 className="collection__sortTitle">Sorted by :</h2>
          <ul className="collection__sortBy">
            <li
              className="collection__sorted collection__sortedFirst"
              id="li_01"
            >
              All cards
            </li>
            <li className="collection__sorted" id="li_02">
              Red
            </li>
            <li className="collection__sorted" id="li_03">
              White
            </li>
            <li className="collection__sorted" id="li_04">
              Green
            </li>
            <li className="collection__sorted" id="li_05">
              Black
            </li>
            <li
              className="collection__sorted collection__sortedLast"
              id="li_06"
            >
              Blue
            </li>
          </ul>
        </div>
        <div className="collection__rightPanel">
          {allCardsList[0]
            ? allCardsList[0].map((element) => {
                if (element.cardName != "Carte 01") {
                  return (
                    <>
                      <div className="collection__show" id={uuidv4()}>
                        <img
                          src={element.cardVisual}
                          alt={`Card visual of ${element.cardName}`}
                          className="collection__showImg"
                          width="146px"
                          height="204px"
                          id={uuidv4()}
                        />
                      </div>
                    </>
                  );
                }
              })
            : ""}
        </div>
      </div>
    </>
  );
}
