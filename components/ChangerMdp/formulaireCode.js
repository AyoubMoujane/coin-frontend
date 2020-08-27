import React, { useState } from "react";
import { View, Text, TextInput, Button } from "react-native";

export default function formulaireCode({ setState }) {
  const [code, setCode] = useState("");

  const codeInputHandler = (enteredText) => {
    setCode(enteredText);
  };

  const submitHandler = () => {
    console.log("Envoi du code", code);
    setState(3);
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
      <Button title="Envoyer" onPress={submitHandler} />
    </View>
  );
}
