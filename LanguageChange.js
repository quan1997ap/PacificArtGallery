import React, { Component } from "react";
import {
  Text,
  Button,
  View,
  ImageBackground,
  Dimensions,
  Image,
  StyleSheet,
  TextInput
} from "react-native";

import I18n from "./src/translations/i18n";
import { connect } from "react-redux";

class LanguageChange extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: "",
      password: "",
      languages: ""
    };
  }

  render() {
    I18n.locale = this.props.stateCurentLanguage;
    return (
      <ImageBackground
        source={require("./src/assets/image/BackgroundLogin.png")}
        style={[
          {
            width: Dimensions.get("window").width,
            height: Dimensions.get("window").height
          },
          styles.container
        ]}
      >
        <Image
          style={styles.logo}
          source={require("./src/assets/image/LibraryLogo.png")}
        />

        <TextInput
          style={[{ marginTop: "15%" }, styles.inputText]}
          onChangeText={emailText => this.setState({ email: emailText })}
          placeholder="ID Email"
          value={this.state.email}
        />

        <Text>
          {I18n.t("greeting")} {this.props.stateCurentLanguage}
        </Text>

        <TextInput
          style={styles.inputText}
          placeholder="Password"
          onChangeText={passwordlText =>
            this.setState({ password: passwordlText })
          }
          value={this.state.password}
        />

        <Button
          title="Go to Jane's profile"
          onPress={() => {
            this.props.navigation.navigate("Home");
          }}
        />
      </ImageBackground>
    );
  }
}

const mapStateToProps = state => {
  return {
    stateCurentLanguage: state.stateCurentLanguage
  };
};
export default connect(
  mapStateToProps,
  null
)(LanguageChange);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center"
  },
  logo: {
    width: 150,
    height: 150
  },
  inputText: {
    margin: 15,
    paddingHorizontal: 30,
    height: 40,
    width: "80%",
    borderColor: "#FFB247",
    borderWidth: 1,
    backgroundColor: "#E0E1E2",
    borderRadius: 1000,
    color: "#333"
  }
});
