import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { allCards } from "../redux/actions/post.action";
import { v4 as uuidv4 } from "uuid";

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
              console.log(element);
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
                      />
                    </div>
                  </>
                );
              }
            })
          ) : (
            <p>Nique</p>
          )}
        </div>
      </div>
    </>
  );
}
