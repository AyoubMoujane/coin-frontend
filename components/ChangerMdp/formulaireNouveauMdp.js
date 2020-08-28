import React, { useState } from "react";
import { View, Text, TextInput, Button } from "react-native";

export default function formulaireOublie({ tokenMdp, navigation }) {
  const [mdp1, setMdp1] = useState("");
  const [mdp2, setMdp2] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [flashMessage, setFlashMessage] = useState("");

  const mdp1InputHandler = (enteredText) => {
    setMdp1(enteredText);
  };
  const mdp2InputHandler = (enteredText) => {
    setMdp2(enteredText);
  };
  const submitHandler = () => {
    verifMdp ? sendPassword() : console.log("Les mdp ne coresspondent pas");
  };
  const verifMdp = mdp1 === mdp2 ? true : false;

  function handleErrors(response) {
    if (!response.ok) {
      switch (response.status) {
        case 401:
          setFlashMessage("Token expire");
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

  const sendPassword = () => {
    setIsLoading(true);
    fetch("http://192.168.1.26:73/utilisateurs/changer_mdp", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        Auth_mdp: tokenMdp,
        motDePasse: mdp1,
      }),
    })
      .then(handleErrors)
      .then((response) => {
        setIsLoading(false);
        setFlashMessage("Mot de passe change avec succes");
        navigation.navigate("connexionEcran");
      })
      .catch((error) => {
        setIsLoading(false);
      });
  };

  return (
    <View>
      <Text>Nouveau mot de passe</Text>
      <TextInput
        placeholder="Mot de passe"
        // style={styles.input}
        onChangeText={mdp1InputHandler}
        value={mdp1}
      />
      <Text>Retapez le mot de passe</Text>
      <TextInput
        placeholder="Retapez le mot de passe"
        // style={styles.input}
        onChangeText={mdp2InputHandler}
        value={mdp2}
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