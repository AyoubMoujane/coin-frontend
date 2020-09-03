import React, { useState } from "react";
import { View, Text, TextInput, Button } from "react-native";
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
    if (!identifiant.match(/[a-z].[a-z]/i)) {
      setFlashMessage("Entrez un identifiant valide (prenom.nom)");
    } else {
      setIsLoading(true);
      fetch(`http://${API_HOST}/utilisateurs/oublie_mdp`, {
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
    <View>
      <Text>Entrez votre identifiant pour recevoir un mail</Text>
      <TextInput
        placeholder="Identifiant"
        // style={styles.input}
        onChangeText={identifiantInputHandler}
        value={identifiant}
      />
      {isLoading ? (
        <Text>Chargement...</Text>
      ) : (
        <Button title="Envoyer" onPress={submitHandler} />
      )}
      {flashMessage ? <Text>{flashMessage}</Text> : null}
    </View>
  );
}
