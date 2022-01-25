import { combineReducers } from "redux";
import cardSelectedReducer from "./getcard.reducer";
import allCardsSelectedReducer from "./allcards.reducer";
import userLoggedNow from "./user.reducer";

export default combineReducers({
  cardSelectedReducer,
  allCardsSelectedReducer,
  userLoggedNow,
});
