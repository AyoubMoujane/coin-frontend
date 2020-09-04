import React, { useState, useEffect } from "react";
import { View, Text, ScrollView, StyleSheet } from "react-native";
import { connect } from "react-redux";
import { API_HOST } from "../environment/dev.env";
import moment from "moment";

const mapStateToProps = (state) => {
  return {
    utilisateur: state.auth.user,
  };
};

function recapEcran({ utilisateur }) {
  const [error, setError] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [transactionsA, setTransactionsA] = useState([]);
  const [transactionsD, setTransactionsD] = useState([]);

  const fetchTransactionA = () => {
    return new Promise((resolve, reject) => {
      fetch(
        `http://${API_HOST}/transactions/auteur/${utilisateur.idUtilisateur}`,
        {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        }
      )
        .then((res) => res.json())
        .then(
          (result) => {
            const sortedResults = result.sort(
              (a, b) => a.Date_creation < b.Date_creation
            );
            setTransactionsA(sortedResults);
            resolve();
          },
          (error) => {
            reject(error);
          }
        );
    });
  };

  const fetchTransactionD = () => {
    return new Promise((resolve, reject) => {
      fetch(
        `http://${API_HOST}/transactions/destinataire/${utilisateur.idUtilisateur}`,
        {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        }
      )
        .then((res) => res.json())
        .then(
          (result) => {
            const sortedResults = result.sort(
              (a, b) => a.Date_creation < b.Date_creation
            );
            setTransactionsD(sortedResults);
            resolve();
          },
          (error) => {
            reject(error);
          }
        );
    });
  };

  useEffect(() => {
    setIsLoaded(false);
    Promise.all([fetchTransactionA(), fetchTransactionD()])
      .then(() => {
        setIsLoading(true);
      })
      .catch((err) => {
        setIsLoaded(true);
      });
  }, []);

  if (error) {
    return <Text>Error: {error.message}</Text>;
  } else if (!isLoaded) {
    return <Text>Loading...</Text>;
  } else {
    return (
      <View style={styles.container}>
        <View style={styles.halfContainer}>
          <Text>Transactions envoyees</Text>
          <ScrollView>
            {transactionsA.map((transaction) => (
              <Text key={transaction.idTransaction}>
                {transaction.identifiantAuteur} -- {transaction.Montant} --D{" "}
                {transaction.identifiantDestinataire}{" "}
                {moment(transaction.Date_creation).format("llll")}
              </Text>
            ))}
          </ScrollView>
        </View>
        <View style={styles.halfContainer}>
          <Text>Transactions recues</Text>
          <ScrollView>
            {transactionsD.map((transaction) => (
              <Text key={transaction.idTransaction}>
                {transaction.identifiantAuteur} -- {transaction.Montant} --D{" "}
                {transaction.identifiantDestinataire}{" "}
                {moment(transaction.Date_creation).format("llll")}
              </Text>
            ))}
          </ScrollView>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  halfContainer: {
    flex: 1 / 2,
  },
});

export default connect(mapStateToProps)(recapEcran);
