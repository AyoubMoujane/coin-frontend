import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Button,
  ScrollView,
  RefreshControl,
  StyleSheet,
} from "react-native";
import { API_HOST } from "../../environment/dev.env";
import { connect } from "react-redux";
import moment from "moment";
import { logOut } from "../../redux/actions/authActions";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { AntDesign } from "@expo/vector-icons";
import { Entypo } from "@expo/vector-icons";

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

const wait = (timeout) => {
  return new Promise((resolve) => {
    setTimeout(resolve, timeout);
  });
};

function menuAdminEcran({ navigation, utilisateur, logOut }) {
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
      utilisateur.estAdmin ? getDernieresTransactions(30) : null;
      setRefreshing(false);
    });
  }, []);

  useEffect(() => {
    getSolde();
    utilisateur.estAdmin ? getDernieresTransactions(30) : null;
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

  const pressAdminHandler = () => {
    navigation.navigate("verifMdpEcran");
  };

  const getDernieresTransactions = (nombreDeTransactions) => {
    return new Promise((resolve, reject) => {
      setIsLoadingTransactions(true);
      fetch(
        `http://${API_HOST}/transactions/destinataire/${3}?nombreDeTransactions=${nombreDeTransactions}`,
        {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        }
      )
        .then(handleErrors)
        .then((response) => {
          setIsLoadingTransactions(false);
          setTransactions(response);
          resolve();
        })
        .catch((error) => {
          setIsLoadingTransactions(false);
          reject();
        });
    });
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
          onPress={pressAdminHandler}
        />
        <AntDesign
          name="logout"
          size={36}
          color="black"
          onPress={pressDeconnexionHandler}
        />
      </View>
      <View style={styles.container2}>
        <Text style={styles.titre}>Caisse</Text>
        <Text style={styles.solde}>{isLoading ? "..." : solde} €</Text>
      </View>
      <View style={styles.container3}>
        {isLoadingTransactions ? (
          <Text>Chargement des transactions...</Text>
        ) : (
          <View>
            <Text style={styles.titre2}>Derniers paiements</Text>
            <ScrollView>
              {transactions.map((transaction) => (
                <View
                  style={styles.transaction}
                  key={transaction.idTransaction}
                >
                  <Entypo name="arrow-bold-left" size={12} color="green" />
                  <Text style={styles.montant}>{transaction.Montant} € </Text>
                  <Text>
                    {transaction.identifiantAuteur}{" "}
                    {moment(transaction.Date_creation).format("llll")}
                  </Text>
                </View>
              ))}
            </ScrollView>
          </View>
        )}
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
    flex: 2,
    justifyContent: "center",
  },
  titre: {
    position: "absolute",
    textAlign: "center",
    width: "100%",
    top: "20%",
    marginBottom: 20,
    fontSize: 20,
  },
  solde: {
    textAlign: "center",
    fontSize: 70,
  },
  container3: {
    flex: 3,
    flexDirection: "row",
    justifyContent: "space-evenly",
    alignItems: "center",
  },
  titre2: {
    fontSize: 20,
    textAlign: "center",
  },
  transaction: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 10,
  },
  montant: {
    fontWeight: "bold",
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(menuAdminEcran);
