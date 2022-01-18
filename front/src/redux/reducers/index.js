import { combineReducers } from "redux";
import cardSelectedReducer from "./getcard.reducer";
import allCardsSelectedReducer from "./allcards.reducer";

export default combineReducers({
  cardSelectedReducer,
  allCardsSelectedReducer,
});
