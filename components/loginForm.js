import React, { useState } from "react";
import { StyleSheet, Text, View, TextInput, Button } from "react-native";
import { loginAttempt } from "../redux/actions/authActions";
import { connect } from "react-redux";

const mapStateToProps = (state) => {
  return {
    auth: state.auth.token,
    isLoading: state.auth.loading,
    error: state.auth.error,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    loginAttempt: (credentials) => dispatch(loginAttempt(credentials)),
  };
};

function LoginForm(props) {
  const [identifiant, setIdentifiant] = useState("");
  const [motDePasse, setMotDePasse] = useState("");

  const { navigation, isLoading, error } = props;

  const identifiantInputHandler = (enteredText) => {
    setIdentifiant(enteredText);
  };
  const motDePasseInputHandler = (enteredText) => {
    setMotDePasse(enteredText);
  };

  const connexionHandler = () => {
    props.loginAttempt({ identifiant: identifiant, motDePasse: motDePasse });
  };

  const oublieHandler = () => {
    navigation.navigate("oublieEcran");
  };
  return (
    <View style={{ flex: 1 }}>
      <View style={[styles.titleContainer, { flex: 1 }]}>
        <Text style={styles.title}>Le coin des gourmandises</Text>
      </View>
      <View style={[styles.container, { flex: 2 }]}>
        <View>
          <TextInput
            placeholder="Identifiant"
            style={styles.input}
            onChangeText={identifiantInputHandler}
            value={identifiant}
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
          title={isLoading ? "Chargement" : "Connexion"}
          onPress={connexionHandler}
          style={styles.button}
          disabled={isLoading}
        />

        {error ? <Text style={styles.errorMessage}>{error}</Text> : null}
        <Text onPress={oublieHandler} style={{ marginTop: 10 }}>
          Mot de passe oublié ?
        </Text>
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

export default connect(mapStateToProps, mapDispatchToProps)(LoginForm);
