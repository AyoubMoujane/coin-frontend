import React, { useState } from "react";
import { View, Text, TextInput, Button } from "react-native";

import FormulaireOublie from "./formulaireOublie";
import FormulaireNouveauMdp from "./formulaireNouveauMdp";
import FormulaireCode from "./formulaireCode";

export default function formulaireOublie() {
  const [state, setState] = useState(1);
  //   const switchState = setState(state + 1);

  return (
    <View>
      {state === 1 && <FormulaireOublie setState={setState} />}
      {state === 2 && <FormulaireCode setState={setState} />}
      {state === 3 && <FormulaireNouveauMdp />}
    </View>
  );
}
