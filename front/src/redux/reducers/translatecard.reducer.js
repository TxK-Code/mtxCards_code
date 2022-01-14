const INITIAL_STATE = {
  cardSelected: [],
};

function lastCardSelected(state = INITIAL_STATE, action) {
  switch (action.type) {
    case "GET_CARD":
      const newCardArr = [...state.cardSelected];
      newCardArr.unshift(action.payload);

      return {
        ...state,
        cardSelected: newCardArr,
      };
  }

  return state;
}

export default lastCardSelected;
