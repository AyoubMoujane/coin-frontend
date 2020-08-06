import { StatusBar } from "expo-status-bar";
import React from "react";
import { StyleSheet, Text, View, TextInput, Button } from "react-native";
import { Provider } from "react-redux";
import store from "./redux/store";

import LoginForm from "./components/loginForm";

export default function App() {
  return (
    <Provider store={store}>
      <View style={{ padding: 50 }}>
        <LoginForm />
      </View>
    </Provider>
  );
}

const styles = StyleSheet.create({});
