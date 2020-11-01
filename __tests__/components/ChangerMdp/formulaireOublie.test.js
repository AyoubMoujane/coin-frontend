import React from 'react';
import renderer from 'react-test-renderer';
import { shallow, configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import { View, Text, TextInput, Button, StyleSheet } from "react-native";


configure({ adapter: new Adapter() });

let findElement = function (tree, element) {
  console.warn(tree)
  return true
}

import FormulaireOublie from '../../../components/ChangerMdp/formulaireOublie'

describe('<formulaireOublie />', () => {
  it("FormulaireOublie renders properly", () => {
    const tree = renderer.create(<FormulaireOublie />).toJSON();
    expect(tree).toMatchSnapshot();
  });
  it("includes 2 Text labels", () => {
    const wrapper = shallow(<FormulaireOublie />);
    expect(wrapper.find("Text").length).toEqual(2);

  });


});