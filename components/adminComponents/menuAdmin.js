import React, { useState, useEffect } from "react";
import { View, Text } from "react-native";
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

export default function menuAdmin() {
  const [isLoading, setIsLoading] = useState(false);
  const [flashMessage, setFlashMessage] = useState("");
  const [utilisateurs, setUtilisateurs] = useState([]);

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

  useEffect(() => {
    setIsLoading(true);
    fetchUtilisateurs()
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
    <View>
      {isLoading ? (
        <Text>Chargement...</Text>
      ) : (
        <View>
          {utilisateurs.map((utilisateur, index) => (
            <Text key={index}>
              {utilisateur.identifiant} : solde={utilisateur.solde}
            </Text>
          ))}
        </View>
      )}
    </View>
  );
}
