import { createStackNavigator } from "react-navigation-stack";
import { createAppContainer } from "react-navigation";

import menuAdminEcran from "../components/adminComponents/menuAdminEcran";
import gestionAdminEcran from "../components/adminComponents/gestionAdminEcran";
import verifMdpEcran from "../components/adminComponents/verifMdpEcran";
import dernieresTransactionsAdminEcran from "../components/adminComponents/dernieresTransactionsAdminEcran";


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
  dernieresTransactionsAdminEcran: {
    screen: dernieresTransactionsAdminEcran,
    navigationOptions: {
      title: "Dernières transactions",
    },
  },
};

const HomeStack = createStackNavigator(ecrans);

export default createAppContainer(HomeStack);
