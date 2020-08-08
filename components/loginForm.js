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

  const identifiantInputHandler = (enteredText) => {
    setIdentifiant(enteredText);
  };
  const motDePasseInputHandler = (enteredText) => {
    setMotDePasse(enteredText);
  };

  const connexionHandler = () => {
    props.loginAttempt({ identifiant: identifiant, motDePasse: motDePasse });
  };
  return (
    <View>
      <View>
        <TextInput
          placeholder="identifiant"
          style={styles.input}
          onChangeText={identifiantInputHandler}
          value={identifiant}
        />
      </View>
      <View>
        <TextInput
          placeholder="mot de passe"
          style={styles.input}
          onChangeText={motDePasseInputHandler}
          value={motDePasse}
          secureTextEntry={true}
        />
      </View>
      <Button title="Connexion" onPress={connexionHandler} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {},
  input: {},
});

export default connect(mapStateToProps, mapDispatchToProps)(LoginForm);
