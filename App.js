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
import { Asset } from "expo-asset";
import AppLoading from "expo-app-loading";

import AuthLoading from "./components/authLoading";

export default class App extends React.Component {
  state = {
    isReady: false,
  };

  render() {
    if (!this.state.isReady) {
      return (
        <AppLoading
          startAsync={this._cacheResourcesAsync}
          onFinish={() => this.setState({ isReady: true })}
          onError={console.warn}
        />
      );
    }

    return (
      <SafeAreaView style={styles.container}>
        <Provider store={store}>
          <AuthLoading />
        </Provider>
      </SafeAreaView>
    );
  }

  async _cacheResourcesAsync() {
    const images = [require("./assets/logo-coin.png")];

    const cacheImages = images.map((image) => {
      return Asset.fromModule(image).downloadAsync();
    });
    return Promise.all(cacheImages);
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: Constants.statusBarHeight,
  },
});
