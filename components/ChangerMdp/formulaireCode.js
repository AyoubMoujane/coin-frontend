import React, { useState } from "react";
import { View, Text, TextInput, Button, StyleSheet } from "react-native";
import { API_HOST } from "../../environment/dev.env";

export default function formulaireCode({ setState, tokenMdp }) {
  const [code, setCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [flashMessage, setFlashMessage] = useState("");

  const codeInputHandler = (enteredText) => {
    setCode(enteredText);
  };
  function handleErrors(response) {
    if (!response.ok) {
      switch (response.status) {
        case 404:
          setFlashMessage("Code errone");
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
    if (code.length !== 6) {
      setFlashMessage("Entrez le code de 6 chiffres envoyé par mail");
    } else {
      setIsLoading(true);
      fetch(`${API_HOST}/utilisateurs/verifier_code`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          Auth_mdp: tokenMdp,
          code: code,
        }),
      })
        .then(handleErrors)
        .then((response) => {
          setIsLoading(false);
          setFlashMessage("Code bon");
          setState(3);
        })
        .catch((error) => {
          setIsLoading(false);
        });
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Entrez le code reçu par mail</Text>
      <TextInput
        placeholder="Code"
        style={styles.input}
        onChangeText={codeInputHandler}
        value={code}
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
