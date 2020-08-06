// import axios from "axios";
import {
  LOGIN_FAILURE,
  LOGIN_REQUEST,
  LOGIN_SUCCESS,
  LOGOUT,
} from "../types/authTypes";

function handleErrors(response) {
  if (!response.ok) {
    throw new Error("Echec authentification");
  }
  return response.json();
}

export const loginAttempt = ({ identifiant, motDePasse }) => {
  return (dispatch) => {
    dispatch(loginRequest());

    fetch("http://192.168.1.26:73/utilisateurs/connexion", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        identifiant: identifiant,
        motDePasse: motDePasse,
      }),
    })
      .then(handleErrors)
      .then((response) => {
        dispatch(loginSuccess(response));
      })
      .catch((error) => {
        // error.message is the error message
        dispatch(loginFailure(error));
      });
  };
};

export const loginRequest = () => {
  return {
    type: LOGIN_REQUEST,
  };
};

export const loginSuccess = (data) => {
  return {
    type: LOGIN_SUCCESS,
    payload: data,
  };
};

export const loginFailure = (error) => {
  return {
    type: LOGIN_FAILURE,
    payload: error,
  };
};

export const logOut = () => {
  return {
    type: LOGOUT,
  };
};
