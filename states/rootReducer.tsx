import { combineReducers } from "@reduxjs/toolkit";
import cartReducer from "./reducers/cartSlice";
import messageReducer from "./reducers/messageSlice";
import userReducer from "./reducers/userSlice";

const rootReducer = combineReducers({
  user: userReducer,
  cart: cartReducer,
  message: messageReducer,
});

export default rootReducer;
