import React, { useState } from "react";
import { View, Text, TextInput, Button } from "react-native";

export default function formulaireOublie() {
  const [mdp1, setMdp1] = useState("");
  const [mdp2, setMdp2] = useState("");

  const mdp1InputHandler = (enteredText) => {
    setMdp1(enteredText);
  };
  const mdp2InputHandler = (enteredText) => {
    setMdp2(enteredText);
  };
  const submitHandler = () => {
    verifMdp
      ? console.log("Les mdp correspondent")
      : console.log("Les mdp ne coresspondent pas");
  };
  const verifMdp = mdp1 === mdp2 ? true : false;

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
      <Button title="Envoyer" onPress={submitHandler} />
    </View>
  );
}
