import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, TextInput, Button } from "react-native";
import { API_HOST } from "../../environment/dev.env";

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

export default function gestionAdminEcran() {
  const [isLoading, setIsLoading] = useState(false);
  const [flashMessage, setFlashMessage] = useState("");
  const [utilisateurs, setUtilisateurs] = useState([]);
  const [groupes, setGroupes] = useState([]);
  const [isPatchingSolde, setIsPatchingSolde] = useState([]);

  const updateSeuilChanged = (index, enteredText) => {
    console.log(index);
    let newArr = [...groupes];
    newArr[index].Seuil = enteredText === "" ? null : enteredText;
    setGroupes(newArr);
  };

  const updateSoldeChanged = (index, enteredText) => {
    let newArr = [...utilisateurs];
    newArr[index].solde = enteredText;
    setUtilisateurs(newArr);
  };

  const fetchUtilisateurs = () => {
    return new Promise((resolve, reject) => {
      fetch(`http://${API_HOST}/utilisateurs`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      })
        .then(handleErrors)
        .then((response) => {
          response = response.map((utilisateur) => ({
            ...utilisateur,
            isLoading: false,
            flashMessage: "",
          }));
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
          response = response.map((groupe) => ({
            ...groupe,
            isLoading: false,
            flashMessage: "",
          }));
          setGroupes(response);
          resolve();
        })
        .catch((error) => {
          reject(error);
        });
    });
  };

  const patchSeuil = (index) => {
    let newArr = [...groupes];
    newArr[index].isLoading = true;
    newArr[index].flashMessage = "";
    setGroupes(newArr);
    const { idGroupe, Seuil } = groupes[index];
    fetch(`http://${API_HOST}/groupes/seuil/${idGroupe}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        seuil: Seuil,
      }),
    })
      .then(handleErrors)
      .then((response) => {
        let newArr = [...groupes];
        newArr[index].isLoading = false;
        newArr[index].flashMessage = "succès";
        setGroupes(newArr);
        // resolve(response);
      })
      .catch((error) => {
        let newArr = [...groupes];
        newArr[index].isLoading = false;
        newArr[index].flashMessage = "erreur";
        setGroupes(newArr);
        // reject(error);
      });
  };

  const patchSolde = (index) => {
    let newArr = [...utilisateurs];
    newArr[index].isLoading = true;
    newArr[index].flashMessage = "";
    setUtilisateurs(newArr);
    const { idUtilisateur, solde } = utilisateurs[index];
    fetch(`http://${API_HOST}/utilisateurs/solde/${idUtilisateur}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        solde: solde,
      }),
    })
      .then(handleErrors)
      .then((response) => {
        console.log("success");
        console.log(response);
        let newArr = [...utilisateurs];
        newArr[index].isLoading = false;
        newArr[index].flashMessage = "succès";
        setUtilisateurs(newArr);
        // resolve(response);
      })
      .catch((error) => {
        console.log("success");
        // reject(error);
        let newArr = [...utilisateurs];
        newArr[index].isLoading = false;
        newArr[index].flashMessage = "erreur";
        setUtilisateurs(newArr);
      });
  };

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

  return (
    <View style={styles.container}>
      {isLoading ? (
        <Text>Chargement...</Text>
      ) : (
        <View>
          {groupes.map((groupe, index) => (
            <View key={index}>
              <View style={styles.rowContainer}>
                <View style={styles.halfContainer}>
                  <Text style={styles.groupe}>{groupe.libelleGroupe}</Text>
                </View>
                <View style={styles.halfContainer}>
                  <Text>Seuil : </Text>
                  <TextInput
                    style={styles.input}
                    value={groupe.Seuil ? groupe.Seuil.toString() : ""}
                    onChangeText={(text) => updateSeuilChanged(index, text)}
                    keyboardType="numeric"
                  />
                  <Button
                    title="Modifier"
                    onPress={() => patchSeuil(index)}
                    disabled={groupe.isLoading}
                  />
                  <Text>
                    {groupe.flashMessage ? groupe.flashMessage : null}
                  </Text>
                </View>
              </View>
              {utilisateurs.map((utilisateur, index) => {
                return utilisateur.groupeFK === groupe.idGroupe ? (
                  <View key={index} style={styles.rowContainer}>
                    <View style={{ flex: 1 }}>
                      <Text style={styles.utilisateur}>
                        {utilisateur.identifiant}
                      </Text>
                    </View>
                    <View style={styles.twoThirdContainer}>
                      <Text key={index}>Solde : </Text>
                      <TextInput
                        style={styles.input}
                        value={utilisateur.solde.toString()}
                        onChangeText={(text) => updateSoldeChanged(index, text)}
                        keyboardType="numeric"
                      />
                      <Button
                        title="Modifier"
                        disabled={utilisateur.isLoading}
                        onPress={() => {
                          patchSolde(index);
                        }}
                      />
                      <Text>
                        {utilisateur.flashMessage
                          ? utilisateur.flashMessage
                          : null}
                      </Text>
                    </View>
                  </View>
                ) : null;
              })}
            </View>
          ))}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  rowContainer: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 5,
  },
  halfContainer: {
    flex: 1 / 2,
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
  },
  twoThirdContainer: {
    flex: 2,
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
  },
  utilisateur: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 10,
  },
  groupe: {
    fontSize: 20,
    textAlign: "center",
    paddingLeft: 10,
    marginVertical: 10,
  },
  input: {
    borderColor: "grey",
    borderWidth: 2,
    width: 40,
    borderRadius: 8,
    paddingHorizontal: 5,
    marginRight: 5,
  },
});
