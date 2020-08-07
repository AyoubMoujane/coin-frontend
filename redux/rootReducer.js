import { combineReducers } from "redux";
// import { persistReducer } from "redux-persist";
// import storage from "redux-persist/lib/storage";
import transfertReducer from "./reducers/transfertReducer";
import authReducer from "./reducers/authReducer";

// const persistConfig = {
//     key: "root",
//     storage,
//     whitelist: ["auth"],
// };

const rootReducer = combineReducers({
  transfert: transfertReducer,
  auth: authReducer,
});

// export default persistReducer(persistConfig, rootReducer);
export default rootReducer;
