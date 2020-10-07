import React, { useState } from "react";
import { View, Text, TextInput, Button, StyleSheet } from "react-native";
import { API_HOST } from "../../environment/dev.env";

export default function formulaireOublie({ setState, setToken }) {
  const [identifiant, setIdentifiant] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [flashMessage, setFlashMessage] = useState("");

  const identifiantInputHandler = (enteredText) => {
    setIdentifiant(enteredText);
  };

  function handleErrors(response) {
    if (!response.ok) {
      switch (response.status) {
        case 404:
          setFlashMessage("Identifiant inconnu");
          throw new Error(404);
          break;
        case 500:
          setFlashMessage("Erreur serveur");
          throw new Error(500);
          break;
      }
    }
    return response.json();
  }

  const submitHandler = () => {
    setFlashMessage("");
    if (!identifiant.match(/[a-z].[a-z]/i)) {
      setFlashMessage("Entrez un identifiant valide (prenom.nom)");
    } else {
      setIsLoading(true);
      fetch(`https://${API_HOST}/utilisateurs/oublie_mdp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          identifiant: identifiant,
        }),
      })
        .then(handleErrors)
        .then((response) => {
          setIsLoading(false);
          setFlashMessage("Mail envoyé à l'adresse mail liée au compte");
          setToken(response.tokenMdp);
          setState(2);
        })
        .catch((error) => {
          setIsLoading(false);
        });
    }
  };
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Entrez votre identifiant</Text>
      <TextInput
        placeholder="Identifiant"
        style={styles.input}
        onChangeText={identifiantInputHandler}
        value={identifiant}
      />
      <View style={{ alignItems: "center" }}>
        <Button title="Envoyer" onPress={submitHandler} disabled={isLoading} />
      </View>
      <Text style={styles.errorMessage}>{flashMessage}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {},
  input: {
    borderColor: "grey",
    borderWidth: 2,
    width: 200,
    height: 30,
    marginBottom: 10,
    borderRadius: 8,
    // paddingHorizontal: 10,
    alignSelf: "center",
    paddingHorizontal: 10,
  },
  title: {
    color: "black",
    fontSize: 30,
    marginBottom: 20,
    textAlign: "center",
    paddingTop: "40%",
  },
  errorMessage: {
    color: "red",
    textAlign: "center",
  },
});
