import { createStackNavigator } from "react-navigation-stack";
import { createAppContainer } from "react-navigation";

import menuEcran from "../components/menuEcran";
import paiementEcran from "../components/paiementEcran";
import offreEcran from "../components/offreEcran";
import recapEcran from "../components/recapEcran";
import menuAdmin from "../components/adminComponents/menuAdmin";

const ecrans = {
  menuEcran: {
    screen: menuEcran,
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
  menuAdmin: {
    screen: menuAdmin,
  },
};

const HomeStack = createStackNavigator(ecrans);

export default createAppContainer(HomeStack);
