import {
  TRANSFERT_REQUEST,
  TRANSFERT_SUCCESS,
  TRANSFERT_FAILURE,
} from "../types/transfertTypes";

import { API_HOST } from "../../environment/dev.env";

function handleErrors(response) {
  if (!response.ok) {
    throw new Error("Echec du transfert");
  }
  return response.json();
}

export const tentativeTransfert = ({ montant, utilisateur, destinataire }) => {
  return (dispatch) => {
    dispatch(transfertRequest());
    fetch(`${API_HOST}/transactions`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        Montant: montant,
        Auteur: utilisateur,
        Destinataire: destinataire,
      }),
    })
      .then(handleErrors)
      .then((response) => {
        dispatch(transfertSuccess(response));
      })
      .catch((error) => {
        // error.message is the error message
        dispatch(transfertFailure(error));
      });
  };
};

export const transfertRequest = () => {
  return {
    type: TRANSFERT_REQUEST,
  };
};

export const transfertSuccess = (data) => {
  return {
    type: TRANSFERT_SUCCESS,
    payload: data,
  };
};

export const transfertFailure = (error) => {
  return {
    type: TRANSFERT_FAILURE,
    payload: error,
  };
};
