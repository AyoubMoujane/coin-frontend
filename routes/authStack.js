import { createStackNavigator } from "react-navigation-stack";
import { createAppContainer } from "react-navigation";

import LoginForm from "../components/loginForm";
import ChangerMdp from "../components/ChangerMdp/ChangerMdp";

const ecrans = {
  connexionEcran: {
    screen: LoginForm,
  },
  oublieEcran: {
    screen: ChangerMdp,
  },
};

const AuthStack = createStackNavigator(ecrans);

export default createAppContainer(AuthStack);
