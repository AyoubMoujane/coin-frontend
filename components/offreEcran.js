import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Button,
  TextInput,
  StyleSheet,
  ScrollView,
} from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { Picker } from "@react-native-community/picker";
import { connect } from "react-redux";
import { API_HOST } from "../environment/dev.env";

const mapStateToProps = (state) => {
  return {
    utilisateur: state.auth.user,
  };
};

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
  const [availableUtilisateurs, setAvailableUtilisateurs] = useState([]);

  // Code pour chargement des selecteurs

  useEffect(() => {
    setIsLoading(true);
    Promise.all([fetchGroupes(), fetchUtilisateurs()])
      .then(() => {
        setIsLoading(false);
        setFlashMessage("");
      })
      .catch((err) => {
        setIsLoading(false);
        setFlashMessage("Erreur");
      });
  }, []);

  function handleErrors(response) {
  if (!response.ok) {
    switch (response.status) {
      case 401:
          setFlashMessage("Seuil depassé");
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

  const fetchUtilisateurs = () => {
    return new Promise((resolve, reject) => {
      fetch(`${API_HOST}/utilisateurs`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      })
        .then(handleErrors)
        .then((response) => {
          setUtilisateurs(response);
          setAvailableUtilisateurs(response);
          setSelectedUtilisateur(response[0].idUtilisateur);
          resolve();
        })
        .catch((error) => {
          reject(error);
        });
    });
  };

  const getSolde = () => {
    return new Promise((resolve, reject) => {
      fetch(`${API_HOST}/utilisateurs/${utilisateur.idUtilisateur}`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      })
        .then(handleErrors)
        .then((response) => {
          resolve(response[0].solde);
        })
        .catch((error) => {
          reject();
        });
    });
  };

  const onChangeGroupe = (itemValue) => {
    setSelectedGroupe(itemValue);
    if (itemValue === 0) {
      setAvailableUtilisateurs(utilisateurs);
    } else {
      let newArr = utilisateurs.filter(
        (utilisateur) => utilisateur.groupeFK === itemValue
      );
      setAvailableUtilisateurs(newArr);
      setSelectedUtilisateur(newArr[0].idUtilisateur);
    }
  };

  const fetchGroupes = () => {
    return new Promise((resolve, reject) => {
      fetch(`${API_HOST}/groupes`, {
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

  const remplace_virgule_par_point = (somme) => {
    var stringResult = "";
    for (let index = 0; index < somme.length; index++) {
      somme[index] === ","
        ? (stringResult = stringResult.concat("."))
        : (stringResult = stringResult.concat(somme[index]));
    }
    return stringResult;
  };

  // Code pour transfert d'argent

  const montantInputHandler = (montant) => {
    setMontant(montant);
  };

  const postTransfert = async () => {
    new Promise((resolve, reject) => {
      fetch(`${API_HOST}/transactions`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          Montant: remplace_virgule_par_point(montant),
          Auteur: utilisateur.idUtilisateur,
          Destinataire: selectedUtilisateur,
        }),
      })
        .then(handleErrors)
        .then((response) => {
          resolve();
        })
        .catch((error) => {
          reject();
        });
    });
  };

  const transfertHandler = async () => {
    setIsLoadingPaiement(true);
    setFlashMessage("");
    if (!montant.toString().match(/^[0-9]{1,3}([,.][0-9]{1,2})?$/)) {
      setFlashMessage('Entrez un montant valide ex: "1" ou "0.50"');
      setIsLoadingPaiement(false);
    } else {
      try {
        const sa = await getSolde();
        console.log(sa)
        let transformedMontant = remplace_virgule_par_point(montant);
        let newSolde = sa - transformedMontant;
        let seuil = -utilisateur.Seuil;
        if (utilisateur.Seuil === null || newSolde >= seuil) {
          await postTransfert();
          setIsPaymentSuccess(true);
          setIsLoadingPaiement(false);
          setFlashMessage("Paiement enregistré");
          setTimeout(function () {
            navigation.navigate("menuUtilisateurEcran");
          }, 1000);
        } else {
          setIsLoadingPaiement(false);
          setFlashMessage(`Seuil limite ${seuil}`);
        }
      } catch(e) {
        setIsLoadingPaiement(false);
        setFlashMessage("Erreur");
        console.log(e)
      }
    }
  };

  function handleErrors(response) {
    if (!response.ok) {
      switch (response.status) {
        case 401:
          setFlashMessage("Seuil depassé");
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
    <KeyboardAwareScrollView
      resetScrollToCoords={{ x: 0, y: 0 }}
      contentContainerStyle={styles.container0}
      scrollEnabled={false}
    >
      <ScrollView>
        <View style={styles.container1}>
          <Text style={styles.title}>Groupe</Text>

          {isLoading ? (
            <Text> Chargement des groupes... </Text>
          ) : (
            <Picker
              selectedValue={selectedGroupe}
              onValueChange={(itemValue, key) => onChangeGroupe(itemValue)}
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

          <Text style={styles.title}>Utilisateur</Text>

          {isLoading ? (
            <Text> Chargement des utilisateurs... </Text>
          ) : (
            <Picker
              selectedValue={selectedUtilisateur}
              onValueChange={(itemValue, key) => {
                setSelectedUtilisateur(itemValue);
              }}
            >
              {availableUtilisateurs.map((utilisateur, index) => (
                <Picker.Item
                  key={index}
                  label={utilisateur.identifiant}
                  value={utilisateur.idUtilisateur}
                />
              ))}
            </Picker>
          )}
        </View>
        <View style={styles.container2}>
          <TextInput
            style={styles.input}
            keyboardType="decimal-pad"
            returnKeyType="done"
            onChangeText={(montant) => montantInputHandler(montant)}
          />

          <Button
            title="Payer"
            disabled={isLoading || isPaymentSuccess || isLoadingPaiement}
            onPress={() => transfertHandler()}
          />

          {flashMessage ? (
            <Text style={styles.flashMessage}>{flashMessage}</Text>
          ) : null}
        </View>
      </ScrollView>
    </KeyboardAwareScrollView>
  );
}

const styles = StyleSheet.create({
  container0: { flex: 1 },
  container1: { flex: 3, justifyContent: "center" },
  container2: { flex: 1, alignItems: "center" },

  input: {
    borderColor: "grey",
    borderWidth: 2,
    width: 200,
    height: 30,
    marginBottom: 10,
    borderRadius: 8,
    paddingHorizontal: 10,
    alignSelf: "center",
  },
  title: {
    color: "black",
    fontSize: 30,
    textAlign: "center",
  },
  flashMessage: {
    // color: "red",
    textAlign: "center",
  },
});

export default connect(mapStateToProps)(offreEcran);
