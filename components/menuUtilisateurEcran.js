import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Button,
  ScrollView,
  RefreshControl,
  StyleSheet,
} from "react-native";
import { connect } from "react-redux";
import { logOut } from "../redux/actions/authActions";
import { API_HOST } from "../environment/dev.env";
import moment from "moment";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { AntDesign } from "@expo/vector-icons";

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

// Pour le rafraichissement
const wait = (timeout) => {
  return new Promise((resolve) => {
    setTimeout(resolve, timeout);
  });
};

function menuEcran({ navigation, utilisateur, logOut }) {
  const [solde, setSolde] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [flashMessage, setFlashMessage] = useState("");
  const [transactions, setTransactions] = useState([]);
  const [isLoadingTransactions, setIsLoadingTransactions] = useState(false);

  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    wait(500).then(() => {
      getSolde();
      setRefreshing(false);
    });
  }, []);

  useEffect(() => {
    getSolde();
  }, []);

  const getSolde = () => {
    setIsLoading(true);
    fetch(`http://${API_HOST}/utilisateurs/${utilisateur.idUtilisateur}`, {
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
  };

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
    <ScrollView
      contentContainerStyle={styles.scrollView}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      <View style={styles.container1}>
        <MaterialCommunityIcons
          name="account"
          size={36}
          color="black"
          onPress={pressRecapHandler}
        />
        <AntDesign
          name="logout"
          size={36}
          color="black"
          onPress={pressDeconnexionHandler}
        />
      </View>
      <View style={styles.container2}>
        <Text style={styles.titre}>Mon Compte </Text>
        <Text style={styles.solde}>{isLoading ? "..." : solde} €</Text>
      </View>
      <View style={styles.container3}>
        <Button title="Consommer" onPress={pressConsommerHandler} />
        <Button title="Offrir" onPress={pressOffrirHandler} />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
  },
  container1: {
    flex: 1,
    paddingTop: 10,
    paddingHorizontal: 10,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  container2: {
    flex: 4,
    justifyContent: "center",
  },
  titre: {
    position: "absolute",
    textAlign: "center",
    width: "100%",
    top: "30%",
    marginBottom: 20,
    fontSize: 20,
  },
  solde: {
    textAlign: "center",
    fontSize: 70,
  },
  container3: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-evenly",
    alignContent: "center",
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(menuEcran);
