import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { getCard } from "../redux/actions/post.action";

export default function AddCard() {
  const { cardSelected } = useSelector((state) => state.cardSelectedReducer);
  const [card, setCard] = useState({
    id: "",
    name: "",
  });

  const dispatch = useDispatch();

  const handleInputTranslate = (e) => {
    if (e.target.classList.contains("addCard__translateinput")) {
      const newCardState = {
        ...card,
        name: e.target.value.toLowerCase().replace(/\s/g, "-"),
      };
      console.log("Result Translate ==> ", newCardState);
      setCard(newCardState);
    }
  };
  const handleInputAdd = (e) => {
    if (e.target.classList.contains("addCard__addinput")) {
      const newCardState = {
        ...card,
        name: e.target.value.toLowerCase().replace(/\s/g, "-"),
      };
      console.log("Result Add ==> ", newCardState);
      setCard(newCardState);
    }
  };

  const handleFormTranslate = (e) => {
    e.preventDefault();
    dispatch(getCard(card));
    console.log("Result Trad Send ==> ", card);
  };
  const handleFormAdd = (e) => {
    e.preventDefault();
    console.log(e);
    dispatch(getCard(card));
    console.log("Result Add Send ==> ", card);
  };

  return (
    <>
      <div className="addCard">
        <div className="addCard__addBox">
          <form
            action="#"
            className="addCard__addform"
            onSubmit={handleFormAdd}
          >
            <label htmlFor="cardTitle" className="addCard__addlabel">
              Card Name :
            </label>
            <input
              type="text"
              id="cardTitle"
              className="addCard__addinput"
              onChange={handleInputAdd}
            />
            <button type="submit" className="addCard__addbtn">
              Search
            </button>
          </form>
          <div>
            {cardSelected[0] != null ? (
              <div className="addCard__addresult">
                <h1 className="addCard__addresultTitle">
                  {cardSelected[0].printed_name
                    ? cardSelected[0].printed_name
                    : cardSelected[0].name
                    ? cardSelected[0].name
                    : ""}
                </h1>
                <img
                  src={cardSelected[0].image_uris.normal}
                  alt="Image de la carte"
                  className="addCard__addresultImg"
                />
                <p className="addCard__addresultDescription">
                  {cardSelected[0].printed_text
                    ? cardSelected[0].printed_text
                    : cardSelected[0].oracle_text
                    ? cardSelected[0].oracle_text
                    : ""}
                </p>
                <p className="addCard__addresultPrice">
                  {cardSelected[0].prices.eur
                    ? cardSelected[0].prices.eur + " €"
                    : "Prix non disponible."}
                </p>
                <div className="addCard__addCollectionDiv">
                  <button className="addCard__addCollectionBtn">
                    Add to collection
                  </button>
                </div>
              </div>
            ) : (
              ""
            )}
          </div>
        </div>

        <div className="addCard__translateBox">
          <form
            action="#"
            className="addCard__translateform"
            onSubmit={handleFormTranslate}
          >
            <label htmlFor="tradName" className="addCard__translatelabel">
              Translate the name of a card :
            </label>
            <input
              type="text"
              id="tradName"
              className="addCard__translateinput"
              onChange={handleInputTranslate}
            />
            <button type="submit" className="addCard__translatebtn">
              Translate
            </button>
          </form>
        </div>
      </div>
    </>
  );
}
