import axios from "axios";

export const getCard = (props, data) => {
  return (dispatch) => {
    return axios
      .get(
        `https://api.scryfall.com/cards/named?fuzzy=${props.nameInput}`,
        data
      )
      .then((res) => {
        dispatch({ type: "GET_CARD", payload: res.data });
      })
      .catch((err) => console.log(err));
  };
};

export const allCards = (data) => {
  return (dispatch) => {
    console.log(data);
    return axios
      .post("http://localhost:3001/api/allCards")
      .then((res) => {
        console.log(res, "<===============");
        dispatch({ type: "ALL_CARDS", payload: res.data });
      })
      .catch((err) => console.log(err));
  };
};
