import React, { useEffect, useState } from "react";
import { View, Text, Button } from "react-native";
import { connect } from "react-redux";
import { logOut } from "../redux/actions/authActions";
import { API_HOST } from "../environment/dev.env";

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
  const [solde, setSolde] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [flashMessage, setFlashMessage] = useState("");

  useEffect(() => {
    setIsLoading(true);
    fetch(`http://${API_HOST}/utilisateurs/+${utilisateur.idUtilisateur}`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    })
      .then(handleErrors)
      .then((response) => {
        setIsLoading(false);
        setSolde(response[0].solde);
      })
      .catch((error) => {
        setIsLoading(false);
      });
  }, []);

  function handleErrors(response) {
    if (!response.ok) {
      switch (response.status) {
        case 401:
          setFlashMessage("Token expire");
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
      <Text>Solde : {isLoading ? "Chargement..." : solde}</Text>
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
