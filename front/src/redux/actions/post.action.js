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

export const cardToDb = (data) => {
  return (dispatch) => {
    return axios
      .post("http://localhost:3001/api/cardToDb", data)
      .then((res) => {
        console.log(res.data, "<== RES card to DB");
      })
      .catch((err) => console.log(err));
  };
};

export const checkLoginInfos = (data) => {
  return (dispatch) => {
    return axios
      .post("http://localhost:3001/api/checkLoginInfos", data)
      .then((res) => {
        console.log(res, "<== RES check Login Infos");
        if (res.status === 200) {
          console.log("Ok Connection", res);
        } else {
          alert("User not found");
        }
      })
      .catch((err) => console.log(err));
  };
};
