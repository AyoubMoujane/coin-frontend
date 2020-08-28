import React, { useState } from "react";
import { View, Text, TextInput, Button } from "react-native";

export default function formulaireCode({ setState, tokenMdp }) {
  const [code, setCode] = useState("");
  const [erreur, setErreur] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [flashMessage, setFlashMessage] = useState("");

  const codeInputHandler = (enteredText) => {
    setCode(enteredText);
    console.log(code);
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
    setIsLoading(true);
    fetch("http://192.168.1.26:73/utilisateurs/verifier_code", {
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
  };

  return (
    <View>
      <Text>Entrez le code reçu par mail</Text>
      <TextInput
        placeholder="Code"
        // style={styles.input}
        onChangeText={codeInputHandler}
        value={code}
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
