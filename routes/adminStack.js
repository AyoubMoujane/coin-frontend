import { createStackNavigator } from "react-navigation-stack";
import { createAppContainer } from "react-navigation";

import menuAdminEcran from "../components/adminComponents/menuAdminEcran";
import gestionAdminEcran from "../components/adminComponents/gestionAdminEcran";

const ecrans = {
  menuAdminEcran: {
    screen: menuAdminEcran,
  },
  gestionAdminEcran: {
    screen: gestionAdminEcran,
  },
};

const HomeStack = createStackNavigator(ecrans);

export default createAppContainer(HomeStack);
