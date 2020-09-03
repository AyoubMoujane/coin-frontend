import React, { useState } from "react";
import { View, Text, TextInput, Button } from "react-native";
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
    if (code.length !== 6) {
      setFlashMessage("Entrez le code de 6 chiffres envoyé par mail");
    } else {
      setIsLoading(true);
      fetch(`http://${API_HOST}/utilisateurs/verifier_code`, {
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
