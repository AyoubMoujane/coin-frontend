import React, { useState, useEffect } from "react";
import { View, Text, Button, TextInput } from "react-native";
import { Picker } from "@react-native-community/picker";
import { connect } from "react-redux";
import { API_HOST } from "../environment/dev.env";

const mapStateToProps = (state) => {
  return {
    utilisateur: state.auth.user,
  };
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

function offreEcran({ utilisateur, navigation }) {
  const [groupes, setGroupes] = useState([]);
  const [utilisateurs, setUtilisateurs] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [flashMessage, setFlashMessage] = useState("");
  const [selectedUtilisateur, setSelectedUtilisateur] = useState(0);
  const [selectedGroupe, setSelectedGroupe] = useState(0);
  const [montant, setMontant] = useState("");
  const [isLoadingPaiement, setIsLoadingPaiement] = useState(false);
  const [isPaymentSuccess, setIsPaymentSuccess] = useState(false);

  // Code pour chargement des selecteurs

  useEffect(() => {
    setIsLoading(true);
    Promise.all([fetchGroupes(), fetchUtilisateurs()])
      .then(() => {
        setIsLoading(false);
        setFlashMessage("Vous pouvez selectionner une personne");
      })
      .catch((err) => {
        setIsLoading(false);
        setFlashMessage("Erreur");
      });
  }, []);

  const fetchUtilisateurs = () => {
    return new Promise((resolve, reject) => {
      fetch(`http://${API_HOST}/utilisateurs`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      })
        .then(handleErrors)
        .then((response) => {
          setUtilisateurs(response);
          resolve();
        })
        .catch((error) => {
          reject(error);
        });
    });
  };

  const fetchGroupes = () => {
    return new Promise((resolve, reject) => {
      fetch(`http://${API_HOST}/groupes`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      })
        .then(handleErrors)
        .then((response) => {
          response.unshift({
            idGroupe: 0,
            libelleGroupe: "Tous",
          });
          setGroupes(response);
          resolve();
        })
        .catch((error) => {
          reject(error);
        });
    });
  };

  // Code pour transfert d'argent

  const montantInputHandler = (montant) => {
    setMontant(montant);
  };

  const transfertHandler = () => {
    if (!montant.toString().match(/^\d+(\.\d{1,2})?$/)) {
      setFlashMessage('Entrez un montant valide ex: "1" ou "0.50"');
    } else {
      setIsLoadingPaiement(true);
      fetch(`http://${API_HOST}/transactions`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          Montant: montant,
          Auteur: utilisateur.idUtilisateur,
          Destinataire: selectedUtilisateur,
        }),
      })
        .then(handleErrors)
        .then((response) => {
          setIsLoadingPaiement(false);
          setFlashMessage("Paiement effectué");
          setIsPaymentSuccess(true);
          setTimeout(function () {
            navigation.navigate("menuEcran");
          }, 1000);
        })
        .catch((error) => {
          setIsLoadingPaiement(false);
        });
    }
  };

  function handleErrors(response) {
    if (!response.ok) {
      switch (response.status) {
        case 401:
          setFlashMessage("Seuil depasse");
          throw new Error(401);
          break;
        case 500:
          setFlashMessage("Erreur serveur");
          throw new Error(500);
          break;
      }
    }
    return response.json();
  }

  return (
    <View>
      <Text>Ecran d'offre d'argent</Text>

      {isLoading ? (
        <Text> Chargement des groupes... </Text>
      ) : (
        <Picker
          selectedValue={selectedGroupe}
          onValueChange={(itemValue, key) => setSelectedGroupe(itemValue)}
        >
          {groupes.map((groupe) => (
            <Picker.Item
              key={groupe.idGroupe}
              label={groupe.libelleGroupe}
              value={groupe.idGroupe}
            />
          ))}
        </Picker>
      )}

      {isLoading ? (
        <Text> Chargement des utilisateurs... </Text>
      ) : (
        <Picker
          selectedValue={selectedUtilisateur}
          onValueChange={(itemValue, key) => setSelectedUtilisateur(itemValue)}
        >
          {utilisateurs.map((utilisateur, index) => {
            return selectedGroupe === 0 ? (
              <Picker.Item
                key={index}
                label={utilisateur.identifiant}
                value={utilisateur.idUtilisateur}
              />
            ) : utilisateur.groupeFK === selectedGroupe ? (
              <Picker.Item
                key={index}
                label={utilisateur.identifiant}
                value={utilisateur.idUtilisateur}
              />
            ) : null;
          })}
        </Picker>
      )}

      <TextInput
        keyboardType="numeric"
        onChangeText={(montant) => montantInputHandler(montant)}
      />

      {isLoadingPaiement ? (
        <Text>Chargement...</Text>
      ) : (
        <Button
          title="Payer"
          disabled={isPaymentSuccess}
          onPress={() => transfertHandler()}
        />
      )}

      {flashMessage ? <Text>{flashMessage}</Text> : null}
    </View>
  );
}

export default connect(mapStateToProps)(offreEcran);
