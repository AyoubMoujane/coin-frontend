import { createStackNavigator } from "react-navigation-stack";
import { createAppContainer } from "react-navigation";

import LoginForm from "../components/loginForm";
import FormulaireOublie from "../components/formulaireOublie";

const ecrans = {
  connexionEcran: {
    screen: LoginForm,
  },
  oublieEcran: {
    screen: FormulaireOublie,
  },
};

const AuthStack = createStackNavigator(ecrans);

export default createAppContainer(AuthStack);
