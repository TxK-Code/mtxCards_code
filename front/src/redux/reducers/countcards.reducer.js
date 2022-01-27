const INITIAL_STATE = {
  countCards: [],
};

function countCardsDB(state = INITIAL_STATE, action) {
  switch (action.type) {
    case "COUNT_CARDS":
      const newCardArr = [];
      newCardArr.unshift(action.payload);

      return {
        countCards: newCardArr,
      };
  }

  return state;
}

export default countCardsDB;
