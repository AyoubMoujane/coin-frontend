import React, { useState } from "react";
import { View, Text, TextInput, Button } from "react-native";
import { connect } from "react-redux";

import { tentativeTransfert } from "../redux/actions/transfertAction";

const mapStateToProps = (state) => {
  return {
    utilisateur: state.auth.user,
  };
};

function paiementEcran({ utilisateur, navigation }) {
  const [montant, setMontant] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [flashMessage, setFlashMessage] = useState("");

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
    fetch("http://192.168.1.26:73/transactions", {
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
        <Button title="Payer" onPress={transfertHandler} />
      )}
      {flashMessage ? <Text>{flashMessage}</Text> : null}
    </View>
  );
}

export default connect(mapStateToProps)(paiementEcran);
