import React, { Component } from "react";
import {
  Text,
  View,
  StyleSheet,
  Image,
  TouchableOpacity,
  ImageBackground
} from "react-native";
import Spinner from "react-native-spinkit";
import { heightHeader } from "../config/enviroment";

// translate connect subcribe language change
import I18n from "../translations/i18n";
import { connect } from "react-redux";

// types: ['CircleFlip', 'Bounce', 'Wave', 'WanderingCubes', 'Pulse', 'ChasingDots', 'ThreeBounce', 'Circle', '9CubeGrid', 'WordPress', 'FadingCircle', 'FadingCircleAlt', 'Arc', 'ArcAlt']

class LoadingComponent extends Component {

  render() {
    return (
      <View
        style={[
          styles.container,
          { display: this.props.Visible == true ? 'flex' : 'none' }
        ]}
      >
        <Text style={styles.textLoading}>{I18n.t("LOADING")}</Text>
        <Spinner
          style={styles.iconLoading}
          isVisible={true}
          size={30}
          type={"ThreeBounce"}
          color={"#333"}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingTop: 10,
    height:40,
    backgroundColor: "#fcfcfc",
    // borderTopColor: "#333",
    // borderTopWidth: 2,
    // marginTop: 10,
    marginBottom: 50,
    paddingBottom: 10
  },
  textLoading: {
    marginRight: 10
  },
  iconLoading: {
    width: 50
  }
});

// translate connect subcribe language change
const mapStateToProps = state => {
  return {
    stateCurentLanguage: state.stateCurentLanguage
  };
};

export default connect(
  mapStateToProps,
  null
)(LoadingComponent);
