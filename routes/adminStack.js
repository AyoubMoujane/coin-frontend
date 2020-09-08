import { createStackNavigator } from "react-navigation-stack";
import { createAppContainer } from "react-navigation";

import menuAdminEcran from "../components/adminComponents/menuAdminEcran";
import gestionAdminEcran from "../components/adminComponents/gestionAdminEcran";
import verifMdpEcran from "../components/adminComponents/verifMdpEcran";

const ecrans = {
  menuAdminEcran: {
    screen: menuAdminEcran,
  },
  verifMdpEcran: {
    screen: verifMdpEcran,
  },
  gestionAdminEcran: {
    screen: gestionAdminEcran,
  },
};

const HomeStack = createStackNavigator(ecrans);

export default createAppContainer(HomeStack);
