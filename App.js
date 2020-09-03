import "react-native-gesture-handler";
import { StatusBar } from "expo-status-bar";
import React from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  Button,
  SafeAreaView,
} from "react-native";
import { Provider } from "react-redux";
import store from "./redux/store";
import Constants from "expo-constants";

import AuthLoading from "./components/authLoading";

export default function App() {
  return (
    <SafeAreaView style={styles.container}>
      <Provider store={store}>
        <AuthLoading />
      </Provider>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: Constants.statusBarHeight,
  },
});
