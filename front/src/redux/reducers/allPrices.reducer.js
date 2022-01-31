const INITIAL_STATE = {
  allPricesList: [],
};

function allCardPrices(state = INITIAL_STATE, action) {
  switch (action.type) {
    case "ALL_PRICES":
      const newPricesArr = [];
      newPricesArr.unshift(action.payload);

      return {
        allPricesList: newPricesArr,
      };
  }

  return state;
}

export default allCardPrices;
