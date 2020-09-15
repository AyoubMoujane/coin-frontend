import { createStackNavigator } from "react-navigation-stack";
import { createAppContainer } from "react-navigation";

import LoginForm from "../components/loginForm";
import ChangerMdp from "../components/ChangerMdp/ChangerMdp";

const ecrans = {
  connexionEcran: {
    screen: LoginForm,
    navigationOptions: {
      title: "Connexion",
    },
  },
  oublieEcran: {
    screen: ChangerMdp,
    navigationOptions: {
      title: "Mot de passe oublié",
    },
  },
};

const AuthStack = createStackNavigator(ecrans);

export default createAppContainer(AuthStack);
