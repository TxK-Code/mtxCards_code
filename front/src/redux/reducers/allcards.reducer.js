const INITIAL_STATE = {
  allCardsList: [],
};

function allCardsSelected(state = INITIAL_STATE, action) {
  switch (action.type) {
    case "ALL_CARDS":
      const newCardArr = [];
      newCardArr.unshift(action.payload);

      return {
        allCardsList: newCardArr,
      };
  }

  return state;
}

export default allCardsSelected;
