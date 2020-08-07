import "react-native-gesture-handler";
import { StatusBar } from "expo-status-bar";
import React from "react";
import { StyleSheet, Text, View, TextInput, Button } from "react-native";
import { Provider } from "react-redux";
import store from "./redux/store";

import AuthLoading from "./components/authLoading";

export default function App() {
  return (
    <Provider store={store}>
      <AuthLoading />
    </Provider>
  );
}

const styles = StyleSheet.create({});
