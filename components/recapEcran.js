import React, { useState, useEffect } from "react";
import { View, Text } from "react-native";
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
  const [transactions, setTransactions] = useState([]);
  useEffect(() => {
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
          setIsLoaded(true);
          const sortedResults = result.sort(
            (a, b) => a.Date_creation < b.Date_creation
          );
          setTransactions(sortedResults);
        },
        // Note: it's important to handle errors here
        // instead of a catch() block so that we don't swallow
        // exceptions from actual bugs in components.
        (error) => {
          setIsLoaded(true);
          setError(error);
        }
      );
  }, []);

  if (error) {
    return <Text>Error: {error.message}</Text>;
  } else if (!isLoaded) {
    return <Text>Loading...</Text>;
  } else {
    return (
      <View>
        {transactions.map((transaction) => (
          <Text key={transaction.idTransaction}>
            {transaction.identifiantAuteur} -- {transaction.Montant} --D{" "}
            {transaction.identifiantDestinataire}{" "}
            {moment(transaction.Date_creation).format("llll")}
          </Text>
        ))}
      </View>
    );
  }
}

export default connect(mapStateToProps)(recapEcran);
