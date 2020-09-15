import { createStackNavigator } from "react-navigation-stack";
import { createAppContainer } from "react-navigation";

import menuAdminEcran from "../components/adminComponents/menuAdminEcran";
import gestionAdminEcran from "../components/adminComponents/gestionAdminEcran";
import verifMdpEcran from "../components/adminComponents/verifMdpEcran";

const ecrans = {
  menuAdminEcran: {
    screen: menuAdminEcran,
    navigationOptions: {
      title: "Menu",
    },
  },
  verifMdpEcran: {
    screen: verifMdpEcran,
    navigationOptions: {
      title: "Vérification",
    },
  },
  gestionAdminEcran: {
    screen: gestionAdminEcran,
    navigationOptions: {
      title: "Gestion",
    },
  },
};

const HomeStack = createStackNavigator(ecrans);

export default createAppContainer(HomeStack);
