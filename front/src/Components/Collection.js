import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { allCards } from "../redux/actions/post.action";

export default function Collection() {
  const { cardSelected } = useSelector((state) => state.cardSelectedReducer);
  const { allCardsList } = useSelector(
    (state) => state.allCardsSelectedReducer
  );

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(allCards());
    console.log("Card Updated");
  }, []);

  return (
    <>
      <div className="collection">
        <div className="collection__leftPanel">
          <h2 className="collection__sortTitle">Sorted by :</h2>
          <ul className="collection__sortBy">
            <li className="collection__sorted collection__sortedFirst">
              All cards
            </li>
            <li className="collection__sorted">Red</li>
            <li className="collection__sorted">White</li>
            <li className="collection__sorted">Green</li>
            <li className="collection__sorted">Black</li>
            <li className="collection__sorted collection__sortedLast">Blue</li>
          </ul>
        </div>
        <div className="collection__rightPanel">
          {allCardsList[0] ? (
            allCardsList[0].map((element) => {
              return (
                <>
                  <div className="olaa">
                    <h1>{element.cardName}</h1>
                    <h2>{element.cardId}</h2>
                  </div>
                </>
              );
            })
          ) : (
            <p>Nique</p>
          )}
        </div>
      </div>
    </>
  );
}
