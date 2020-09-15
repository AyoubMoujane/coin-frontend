import { createStackNavigator } from "react-navigation-stack";
import { createAppContainer } from "react-navigation";

import menuUtilisateurEcran from "../components/menuUtilisateurEcran";
import paiementEcran from "../components/paiementEcran";
import offreEcran from "../components/offreEcran";
import recapEcran from "../components/recapEcran";
import menuAdmin from "../components/adminComponents/menuAdminEcran";

const ecrans = {
  menuUtilisateurEcran: {
    screen: menuUtilisateurEcran,
    navigationOptions: {
      title: "Menu",
    },
  },
  paiementEcran: {
    screen: paiementEcran,
    navigationOptions: {
      title: "Consommer",
    },
  },
  offreEcran: {
    screen: offreEcran,
    navigationOptions: {
      title: "Offrir",
    },
  },
  recapEcran: {
    screen: recapEcran,
    navigationOptions: {
      title: "Récapitulatif",
    },
  },
};

const HomeStack = createStackNavigator(ecrans);

export default createAppContainer(HomeStack);
