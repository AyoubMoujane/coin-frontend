import {
  TRANSFERT_FAILURE,
  TRANSFERT_REQUEST,
  TRANSFERT_SUCCESS,
} from "../types/transfertTypes";

const initialState = {
  isLoading: false,
  message: "",
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case TRANSFERT_REQUEST:
      return {
        ...state,
        isLoading: true,
      };
    case TRANSFERT_SUCCESS:
      return {
        isLoading: false,
        message: "Transfert reussit",
      };
    case TRANSFERT_FAILURE:
      return {
        isLoading: false,
        message: action.payload.message,
      };
    default:
      return state;
  }
};

export default reducer;
