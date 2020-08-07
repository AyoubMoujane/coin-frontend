import React, { useState } from "react";
import { View, Text, TextInput, Button } from "react-native";
import { connect } from "react-redux";

import { tentativeTransfert } from "../redux/actions/transfertAction";

const mapStateToProps = (state) => {
  return {
    utilisateur: state.auth.user,
    chargement: state.transfert.transfertEnCours,
    message: state.transfert.message,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    tentativeTransfert: (data) => dispatch(tentativeTransfert(data)),
  };
};

function paiementEcran(props) {
  const { utilisateur } = props;
  const [montant, setMontant] = useState("");

  const montantInputHandler = (montant) => {
    setMontant(montant);
  };

  const transfertHandler = () => {
    console.log(utilisateur.idUtilisateur);
    console.log(montant);
    props.tentativeTransfert({
      utilisateur: utilisateur.idUtilisateur,
      destinataire: 2,
      montant: montant,
    });
  };

  return (
    <View>
      <Text>Ecran de paiement</Text>
      <TextInput
        keyboardType="numeric"
        onChangeText={(montant) => montantInputHandler(montant)}
      />
      <Button title="Payer" onPress={transfertHandler} />
    </View>
  );
}

export default connect(mapStateToProps, mapDispatchToProps)(paiementEcran);
