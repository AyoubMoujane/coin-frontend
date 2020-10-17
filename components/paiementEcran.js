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
  const [soldeActuel, setSoldeActuel] = useState(null);

  const montantInputHandler = (montant) => {
    setMontant(montant);
  };

  const remplace_virgule_par_point = (somme) => {
    var stringResult = "";
    for (let index = 0; index < somme.length; index++) {
      somme[index] === ","
        ? (stringResult = stringResult.concat("."))
        : (stringResult = stringResult.concat(somme[index]));
    }
    return stringResult;
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

  const transfertHandler = async () => {
    setIsLoading(true);
    if (!montant.toString().match(/^[0-9]{1,3}([,.][0-9]{1,2})?$/)) {
      setFlashMessage('Entrez un montant valide ex: "1" ou "0.50"');
      setIsLoading(false);
    } else {
      try {
        const sa = await getSolde();
        console.log(sa);
        let transformedMontant = remplace_virgule_par_point(montant);
        let newSolde = sa - transformedMontant;
        console.log(newSolde);
        let seuil = -utilisateur.Seuil;
        console.log(seuil);
        if (utilisateur.Seuil === null || newSolde >= seuil) {
          await postTransfert();
          setIsPaymentSuccess(true);
          setIsLoading(false);
          setFlashMessage("Paiement enregistré");
          setTimeout(function () {
            navigation.navigate("menuUtilisateurEcran");
          }, 1000);
        } else {
          setIsLoading(false);
          setFlashMessage(`Seuil limite ${seuil}`);
        }
      } catch {
        setIsLoading(false);
        setFlashMessage("Erreur");
      }
    }
  };

  const postTransfert = async () => {
    new Promise((resolve, reject) => {
      fetch(`${API_HOST}/transactions`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          Montant: remplace_virgule_par_point(montant),
          Auteur: utilisateur.idUtilisateur,
          Destinataire: 3,
        }),
      })
        .then(handleErrors)
        .then((response) => {
          resolve();
        })
        .catch((error) => {
          reject();
        });
    });
  };

  const getSolde = () => {
    return new Promise((resolve, reject) => {
      fetch(`https://${API_HOST}/utilisateurs/${utilisateur.idUtilisateur}`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      })
        .then(handleErrors)
        .then((response) => {
          setSoldeActuel(response[0].solde);
          resolve(response[0].solde);
        })
        .catch((error) => {
          reject();
        });
    });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Entrez le coût</Text>
      <TextInput
        keyboardType="decimal-pad"
        returnKeyType="done"
        onChangeText={(montant) => montantInputHandler(montant)}
        style={styles.input}
      />

      <Button
        title="Payer"
        disabled={isPaymentSuccess || isLoading}
        onPress={transfertHandler}
      />

      {flashMessage ? <Text>{flashMessage}</Text> : null}
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
