import { combineReducers } from "redux";
import cardSelectedReducer from "./getcard.reducer";
import allCardsSelectedReducer from "./allcards.reducer";
import userLoggedNow from "./user.reducer";
import countCardsDB from "./countcards.reducer";
import allCardPrices from "./allPrices.reducer";

export default combineReducers({
  cardSelectedReducer,
  allCardsSelectedReducer,
  userLoggedNow,
  countCardsDB,
  allCardPrices,
});
