import React, { useState } from "react";
import { View, Text, TextInput, Button } from "react-native";
import { connect } from "react-redux";

import { tentativeTransfert } from "../redux/actions/transfertAction";

import { API_HOST } from "../environment/dev.env";

const mapStateToProps = (state) => {
  return {
    utilisateur: state.auth.user,
  };
};

function paiementEcran({ utilisateur, navigation }) {
  const [montant, setMontant] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [flashMessage, setFlashMessage] = useState("");
  const [isPaymentSuccess, setIsPaymentSuccess] = useState(false);

  const montantInputHandler = (montant) => {
    setMontant(montant);
  };

  function handleErrors(response) {
    if (!response.ok) {
      switch (response.status) {
        case 401:
          setFlashMessage("Seuil depasse");
          throw new Error(401);
          break;
        case 500:
          setFlashMessage("Erreur serveur");
          throw new Error(500);
          break;
      }
    }
    return response.json();
  }

  const transfertHandler = () => {
    setIsLoading(true);
    fetch(`http://${API_HOST}/transactions`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        Montant: montant,
        Auteur: utilisateur.idUtilisateur,
        Destinataire: 3,
      }),
    })
      .then(handleErrors)
      .then((response) => {
        setIsLoading(false);
        setFlashMessage("Paiement effectué");
        setIsPaymentSuccess(true);
        setTimeout(function () {
          navigation.navigate("menuEcran");
        }, 1000);
      })
      .catch((error) => {
        // error.message is the error message
        setIsLoading(false);
      });
  };

  return (
    <View>
      <Text>Entrer la somme à payer:</Text>
      <TextInput
        keyboardType="numeric"
        onChangeText={(montant) => montantInputHandler(montant)}
      />
      {isLoading ? (
        <Text>Chargement...</Text>
      ) : (
        <Button
          title="Payer"
          disabled={isPaymentSuccess}
          onPress={transfertHandler}
        />
      )}
      {flashMessage ? <Text>{flashMessage}</Text> : null}
    </View>
  );
}

export default connect(mapStateToProps)(paiementEcran);
