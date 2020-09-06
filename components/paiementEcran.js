import React, { useState } from "react";
import { View, Text, TextInput, Button, StyleSheet } from "react-native";
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
    if (!montant.toString().match(/^\d+(\.\d{1,2})?$/)) {
      setFlashMessage('Entrez un montant valide ex: "1" ou "0.50"');
    } else {
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
            navigation.navigate("menuUtilisateurEcran");
          }, 1000);
        })
        .catch((error) => {
          // error.message is the error message
          setIsLoading(false);
        });
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Entrez le coût:</Text>
      <TextInput
        keyboardType="numeric"
        onChangeText={(montant) => montantInputHandler(montant)}
        style={styles.input}
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
      {flashMessage ? (
        <Text style={styles.errorMessage}>{flashMessage}</Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: "center", justifyContent: "center" },
  input: {
    borderColor: "grey",
    borderWidth: 2,
    width: 200,
    height: 30,
    marginBottom: 10,
    borderRadius: 8,
    paddingHorizontal: 10,
  },
  title: {
    color: "black",
    fontSize: 30,
    marginBottom: 20,
  },
  errorMessage: {
    color: "red",
  },
});

export default connect(mapStateToProps)(paiementEcran);
