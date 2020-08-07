import {
  TRANSFERT_FAILURE,
  TRANSFERT_REQUEST,
  TRANSFERT_SUCCESS,
} from "../types/transfertTypes";

const initialState = {
  transfertEnCours: false,
  message: "",
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case TRANSFERT_REQUEST:
      return {
        ...state,
        loading: true,
      };
    case TRANSFERT_SUCCESS:
      return {
        loading: false,
        message: "Transfert reussit",
      };
    case TRANSFERT_FAILURE:
      return {
        loading: false,
        message: action.payload.message,
      };
    default:
      return state;
  }
};

export default reducer;
