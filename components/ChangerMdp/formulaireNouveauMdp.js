import React, { useState } from "react";
import { View, Text, TextInput, Button, StyleSheet } from "react-native";
import { API_HOST } from "../../environment/dev.env";

export default function formulaireOublie({ tokenMdp, navigation }) {
  const [mdp1, setMdp1] = useState("");
  const [mdp2, setMdp2] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [flashMessage, setFlashMessage] = useState("");
  const [success, setSuccess] = useState(false);

  const mdp1InputHandler = (enteredText) => {
    setMdp1(enteredText);
  };
  const mdp2InputHandler = (enteredText) => {
    setMdp2(enteredText);
  };
  const submitHandler = () => {
    setFlashMessage("");
    verifCorrespMdp
      ? verifLongeurMdp
        ? sendPassword()
        : setFlashMessage(
            "Le nouveau mot de passe doit contenir au moins 6 caractères"
          )
      : setFlashMessage("Les mots de passe de correspondent pas");
  };
  const verifCorrespMdp = mdp1 === mdp2 ? true : false;
  const verifLongeurMdp = mdp1.length >= 6 ? true : false;

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
    fetch(`${API_HOST}/utilisateurs/changer_mdp`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        Auth_mdp: tokenMdp,
        motDePasse: mdp1,
      }),
    })
      .then(handleErrors)
      .then((response) => {
        setSuccess(true);
        setFlashMessage("Mot de passe change avec succès");
        setTimeout(function () {
          setIsLoading(false);
          navigation.navigate("connexionEcran");
        }, 1000);
      })
      .catch((error) => {
        setIsLoading(false);
      });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Nouveau mot de passe</Text>
      <TextInput
        placeholder="Mot de passe"
        style={styles.input}
        onChangeText={mdp1InputHandler}
        value={mdp1}
        secureTextEntry={true}
      />
      <Text style={styles.title}>Retapez le mot de passe</Text>
      <TextInput
        placeholder="Retapez le mot de passe"
        style={styles.input}
        onChangeText={mdp2InputHandler}
        value={mdp2}
        secureTextEntry={true}
      />
      <View style={{ alignItems: "center" }}>
        <Button title="Envoyer" onPress={submitHandler} disabled={isLoading} />
        {flashMessage ? (
          <Text style={styles.errorMessage}>{flashMessage}</Text>
        ) : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { paddingTop: "40%" },
  input: {
    borderColor: "grey",
    borderWidth: 2,
    width: 200,
    height: 30,
    marginBottom: 10,
    borderRadius: 8,
    alignSelf: "center",
    paddingHorizontal: 10,
  },
  title: {
    color: "black",
    fontSize: 30,
    marginBottom: 20,
    textAlign: "center",
  },
  errorMessage: {
    textAlign: "center",
  },
});
