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

export const allCards = (props, data) => {
  return (dispatch) => {
    return axios
      .post("http://localhost:3001/api/allCards", props)
      .then((res) => {
        dispatch({ type: "ALL_CARDS", payload: res.data });
      })
      .catch((err) => console.log(err));
  };
};

export const wallet = (props, data) => {
  return (dispatch) => {
    return axios
      .post("http://localhost:3001/api/wallet", props)
      .then((res) => {
        if (res.data.userCardList === null) {
          console.log("No cards found");
        } else {
          const cardsBackend = [res.data.userCardList];
          const cardsBackendSplited = `${cardsBackend}`.split(",");
          let countCards = 0;

          cardsBackendSplited.forEach((card) => {
            countCards += 1;
          });

          dispatch(allCards(props));
          dispatch({ type: "COUNT_CARDS", payload: countCards });
        }
      })
      .catch((err) => console.log(err));
  };
};

export const cardToDb = (data) => {
  return (dispatch) => {
    return axios
      .post("http://localhost:3001/api/cardToDb", data)
      .then((res) => {})
      .catch((err) => console.log(err));
  };
};

export const checkLoginInfos = (data) => {
  return (dispatch) => {
    return axios
      .post("http://localhost:3001/api/checkLoginInfos", data)
      .then((res) => {
        if (res.status === 200) {
          dispatch({ type: "USER_LOG", payload: res.data });
        }
      })
      .catch((err) => console.log(err));
  };
};

export const addNewUser = (data) => {
  return (dispatch) => {
    return axios
      .post("http://localhost:3001/api/addNewUser", data)
      .then((res) => {
        if (res.status === 200) {
          console.log("User added successfully");
        }
      })
      .catch((err) => alert("Username already in use"));
  };
};
