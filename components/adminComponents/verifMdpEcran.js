import React, { useState } from "react";
import { StyleSheet, Text, View, TextInput, Button } from "react-native";
import { connect } from "react-redux";
import { API_HOST } from "../../environment/dev.env";

const mapStateToProps = (state) => {
  return {
    auth: state.auth,
  };
};

function handleErrors(response) {
  if (!response.ok) {
    throw new Error("Echec authentification");
  }
  return response.json();
}

function verifMdpEcran(props) {
  const [identifiant, setIdentifiant] = useState("");
  const [motDePasse, setMotDePasse] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const { navigation, auth } = props;

  const identifiantInputHandler = (enteredText) => {
    setIdentifiant(enteredText);
  };
  const motDePasseInputHandler = (enteredText) => {
    setMotDePasse(enteredText);
  };

  const verifHandler = () => {
    setIsLoading(true);
    setError("");
    fetch(
      `${API_HOST}/utilisateurs/verifier_mdp/${auth.user.idUtilisateur}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          identifiant: identifiant,
          motDePasse: motDePasse,
        }),
      }
    )
      .then(handleErrors)
      .then((response) => {
        setIsLoading(false);
        navigation.navigate("gestionAdminEcran");
      })
      .catch((error) => {
        setIsLoading(false);
        setError("Echec vérification");
      });
  };

  return (
    <View style={{ flex: 1 }}>
      <View style={styles.titleContainer}>
        <Text style={styles.title}>Identifiez-vous</Text>
      </View>
      <View style={[styles.container, { flex: 3 }]}>
        <View>
          <TextInput
            placeholder="Identifiant"
            style={styles.input}
            onChangeText={identifiantInputHandler}
            value={identifiant}
            keyboardType="email-address"
          />
        </View>
        <View>
          <TextInput
            placeholder="Mot de passe"
            style={styles.input}
            onChangeText={motDePasseInputHandler}
            value={motDePasse}
            secureTextEntry={true}
          />
        </View>

        <Button
          title={isLoading ? "Chargement" : "Vérifier"}
          onPress={verifHandler}
          style={styles.button}
          disabled={isLoading}
        />

        {error ? <Text style={styles.errorMessage}>{error}</Text> : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 3, alignItems: "center" },
  titleContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
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
  },
  errorMessage: {
    color: "red",
  },
});

export default connect(mapStateToProps)(verifMdpEcran);
