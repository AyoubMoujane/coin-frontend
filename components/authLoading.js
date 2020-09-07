import React from "react";
import { View, Text } from "react-native";
import { connect } from "react-redux";

import HomeStack from "../routes/userStack";
import AuthStack from "../routes/authStack";
import AdminStack from "../routes/adminStack";

const mapStateToProps = (state) => {
  return {
    auth: state.auth.user,
    isLoading: state.auth.loading,
    error: state.auth.error,
  };
};

function authLoading({ auth }) {
  return auth ? auth.estAdmin ? <AdminStack /> : <HomeStack /> : <AuthStack />;
}

export default connect(mapStateToProps)(authLoading);
