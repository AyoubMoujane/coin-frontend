import React from "react";
import { View, Text, Button } from "react-native";
import { connect } from "react-redux";
import { logOut } from "../redux/actions/authActions";

const mapStateToProps = (state) => {
  return {
    utilisateur: state.auth.user,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    logOut: () => dispatch(logOut()),
  };
};
function menuEcran({ navigation, utilisateur, logOut }) {
  const pressConsommerHandler = () => {
    navigation.navigate("paiementEcran");
  };

  const pressOffrirHandler = () => {
    navigation.navigate("offreEcran");
  };

  const pressRecapHandler = () => {
    navigation.navigate("recapEcran");
  };

  const pressDeconnexionHandler = () => {
    logOut();
  };

  return (
    <View>
      <Text>Ecran menu principal</Text>
      <Text>Identifiant : {utilisateur.identifiant}</Text>
      <Text>Solde : {utilisateur.solde}</Text>
      <Text>Groupe : {utilisateur.libelleGroupe}</Text>
      <Text>
        Seuil : {utilisateur.Seuil ? utilisateur.Seuil : "Aucun plafond"}
      </Text>

      <Button title="Consommer" onPress={pressConsommerHandler} />
      <Button title="Offrir" onPress={pressOffrirHandler} />
      <Button title="Recapitulatif" onPress={pressRecapHandler} />
      <Button title="Deconnexion" onPress={pressDeconnexionHandler} />
    </View>
  );
}

export default connect(mapStateToProps, mapDispatchToProps)(menuEcran);
