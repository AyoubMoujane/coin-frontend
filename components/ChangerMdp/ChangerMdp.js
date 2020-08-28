import React, { useState } from "react";
import { View, Text, TextInput, Button } from "react-native";

import FormulaireOublie from "./formulaireOublie";
import FormulaireNouveauMdp from "./formulaireNouveauMdp";
import FormulaireCode from "./formulaireCode";

export default function formulaireOublie() {
  const [state, setState] = useState(1);
  const [tokenMdp, setToken] = useState("");
  //   const switchState = setState(state + 1);

  return (
    <View>
      {state === 1 && (
        <FormulaireOublie setState={setState} setToken={setToken} />
      )}
      {state === 2 && (
        <FormulaireCode setState={setState} tokenMdp={tokenMdp} />
      )}
      {state === 3 && <FormulaireNouveauMdp tokenMdp={tokenMdp} />}
    </View>
  );
}
