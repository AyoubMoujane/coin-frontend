import { createStackNavigator } from "react-navigation-stack";
import { createAppContainer } from "react-navigation";

import LoginForm from "../components/loginForm";

const ecrans = {
  connexionEcran: {
    screen: LoginForm,
  },
};

const AuthStack = createStackNavigator(ecrans);

export default createAppContainer(AuthStack);
