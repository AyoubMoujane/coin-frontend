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
  },
  paiementEcran: {
    screen: paiementEcran,
  },
  offreEcran: {
    screen: offreEcran,
  },
  recapEcran: {
    screen: recapEcran,
  },
};

const HomeStack = createStackNavigator(ecrans);

export default createAppContainer(HomeStack);
