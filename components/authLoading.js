import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { connect } from "react-redux";

import HomeStack from "../routes/homeStack";
import AuthStack from "../routes/authStack";

const mapStateToProps = (state) => {
  return {
    auth: state.auth.token,
    isLoading: state.auth.loading,
    error: state.auth.error,
  };
};

function authLoading(props) {
  const { auth } = props;
  console.log(auth);
  return auth ? <HomeStack /> : <AuthStack />;
}

const styles = StyleSheet.create({
  container: {
    marginTop: 50,
  },
});

export default connect(mapStateToProps)(authLoading);
