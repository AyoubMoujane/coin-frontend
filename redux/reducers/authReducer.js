import {
  LOGIN_FAILURE,
  LOGIN_REQUEST,
  LOGIN_SUCCESS,
  LOGOUT,
} from "../types/authTypes";

const initialState = {
  loading: false,
  token: null,
  error: "",
  user: null,
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case LOGIN_REQUEST:
      return {
        ...state,
        loading: true,
      };
    case LOGIN_SUCCESS:
      return {
        loading: false,
        token: action.payload.token,
        error: "",
        user: action.payload.utilisateur,
      };
    case LOGIN_FAILURE:
      return {
        loading: false,
        token: null,
        error: action.payload.message,
      };
    case LOGOUT:
      return {
        ...state,
        user: null,
        token: null,
      };
    default:
      return state;
  }
};

export default reducer;
