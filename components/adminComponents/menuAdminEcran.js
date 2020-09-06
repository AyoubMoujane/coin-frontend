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
      utilisateur.estAdmin ? getDernieresTransactions(10) : null;
      setRefreshing(false);
    });
  }, []);

  useEffect(() => {
    getSolde();
    utilisateur.estAdmin ? getDernieresTransactions(10) : null;
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
    navigation.navigate("gestionAdminEcran");
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
      <View>
        <Text>Ecran menu principal</Text>
        <Text>Identifiant : {utilisateur.identifiant}</Text>
        <Text>Solde : {isLoading ? "Chargement..." : solde}</Text>
        {utilisateur.estAdmin ? (
          isLoadingTransactions ? (
            <Text>Chargement des transactions...</Text>
          ) : (
            <View>
              <Text>Dernieres transactions</Text>
              <ScrollView>
                {transactions.map((transaction) => (
                  <Text key={transaction.idTransaction}>
                    {transaction.identifiantAuteur} -- {transaction.Montant} --D{" "}
                    {transaction.identifiantDestinataire}{" "}
                    {moment(transaction.Date_creation).format("llll")}
                  </Text>
                ))}
              </ScrollView>
            </View>
          )
        ) : null}
        <Button title="D" onPress={pressAdminHandler} />
        <Button title="Deconnexion" onPress={pressDeconnexionHandler} />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(menuAdminEcran);
