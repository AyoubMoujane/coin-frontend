import React from 'react';
import renderer from 'react-test-renderer';
import { shallow, configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import { View, Text, TextInput, Button, StyleSheet } from "react-native";


configure({ adapter: new Adapter() });

const setUp = (props = {}) => {
  const component = shallow(<FormulaireOublie {...props} />);
  return component;
}

const findByTestAttr = (component, attr) => { 
  const wrapper = component.find({ 'data-testid': `${attr}` });
  return wrapper;
}

import FormulaireOublie from '../../../components/ChangerMdp/formulaireOublie'

describe('<formulaireOublie />', () => {

  let component
  const setState = jest.fn();
  const useStateSpy = jest.spyOn(React, 'useState')
  useStateSpy.mockImplementation((init) => [init, setState]);
  
  beforeEach(() => {
    component = setUp();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("renders without error", () => {
    expect(component).toMatchSnapshot();
  });
  it("includes 2 Text labels", () => {
    expect(component.find("Text").length).toEqual(2);
  });
  it("refuses empty input", () => {
    let button = findByTestAttr(component, "boutonEnvoyer")
    button.props().onPress()
    let flashMessage = findByTestAttr(component, "flashMessage")
    expect(flashMessage.props().children).toEqual("Entrez un identifiant valide (prenom.nom)")
  });

  it("refuses invalid input", () => {
    let button = findByTestAttr(component, "boutonEnvoyer")
    button.props().onPress()
    let flashMessage = findByTestAttr(component, "flashMessage")
    expect(flashMessage.props().children).toEqual("Entrez un identifiant valide (prenom.nom)")
  });


});