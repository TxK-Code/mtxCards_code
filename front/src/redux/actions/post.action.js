import axios from "axios";

export const getCard = (props, data) => {
  return (dispatch) => {
    return axios
      .get(`https://api.scryfall.com/cards/named?fuzzy=${props.name}`, data)
      .then((res) => {
        console.log(res, " <== Result Card Selected Fetch");
        dispatch({ type: "GET_CARD", payload: res.data });
      })
      .catch((err) => console.log(err));
  };
};
