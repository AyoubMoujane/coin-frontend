import { createStore, applyMiddleware } from "redux";
import { composeWithDevTools } from "redux-devtools-extension";
// import { persistStore } from "redux-persist";
// import logger from "redux-logger";
import thunk from "redux-thunk";

import rootReducer from "./rootReducer";

const store = createStore(
  rootReducer,
  composeWithDevTools(applyMiddleware(thunk))
);
// const persistor = persistStore(store);

// export { store, persistor };

export default store;
