import React, { Component } from "react";
import { View, Image, StyleSheet, Dimensions } from "react-native";
import { widthPercentageToDP, heightPercentageToDP } from "../../theme/scale";
import { AsyncStorage, ImageBackground } from "react-native";

// translate
import { connect } from "react-redux";
import { changeLanguage } from "../../actions";



class WaittingScreen extends React.Component {
  constructor(props) {
    super(props);
  }

  _storeLocalLanguage = async (language) => {
    try {
      await AsyncStorage.setItem('currentLanguage', language);
    } catch (error) {
      // console.log(error)
    }
  };

  _getLanguageStore = async () => {
    try {
      // co ngon ngu
      const currLang = await AsyncStorage.getItem('currentLanguage');
      if (currLang !== "" && currLang != null) {
        this.props._changeLanguage(currLang);
        setTimeout(() => {
          this.props.navigation.navigate("TabBottomDashBoardScreen");
        }, 2000);
      }
      // chua co ngon ngu
      else{
        this.props._changeLanguage("vi");
        this._storeLocalLanguage("vi");
        setTimeout(() => {
          this.props.navigation.navigate("TabBottomDashBoardScreen");
        }, 2000);
      }
    } catch (error) {
      // Error retrieving data
    }
  };


  componentDidMount() {
    this._getLanguageStore();
  }

  render() {
    return (
      <View style={{ flex: 1 }}>
        <Image
          source={require("../../assets/image/BackgroundWaitingScreen.png")}
          style={styles.fullBackGround}
        />
      </View>
    );
  }
}

const mapDispatchToProps = dispatch => {
  return {
    _changeLanguage: language => {
      dispatch(changeLanguage(language));
    }
  };
};

const mapStateToProps = state => {
  return {
    stateCurentLanguage: state.stateCurentLanguage,
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(WaittingScreen);


const styles = StyleSheet.create({
  fullBackGround: {
    flex: 1,
    width: null,
    height: null,
    resizeMode: 'stretch'
  }
});
