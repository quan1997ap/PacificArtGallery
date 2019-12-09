import React, { Component } from "react";
import {
  Text,
  Button,
  View,
  Image,
  StyleSheet,
  ScrollView,
  TouchableHighlight,
  TouchableOpacity
} from "react-native";
import {AsyncStorage} from 'react-native';

import RoundCheckbox from "rn-round-checkbox";
import HeaderComponent from "../../../../components/HeaderComponent";
import { heightHeader } from "../../../../config/enviroment";

// translate
import I18n from "../../../../translations/i18n";
import { changeLanguage } from "../../../../actions/index";
import { connect } from "react-redux";




class SettingScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      propsTabBottom: {}
    };

  }

  // config tabBottom title  --------------------------------------------------------------------------------------------------------------------
  // static navigationOptions = ({ navigation, screenProps }) => {
  //   const { params = {} } = navigation.state;
  //   return {
  //     title: `${params.title}`,
  //     // tab title = "" and set below
  //     tabBarIcon: ({ tintColor }) => (
  //       <Image
  //         source={require("../../../../assets/icon/Setting.png")}
  //         style={{ width: 24, height: 24, tintColor: tintColor }}
  //       />
  //     )
  //   };
  // };


  // componentWillMount() {
  //   // set tab title
  //   this.props.navigation.setParams({ title: I18n.t("SETTING") });
  // }

  // _changeThisTitle = titleText => {
  //   const { setParams } = this.props.navigation;
  //   setParams({ title: titleText });
  // };

  // componentDidUpdate(prevProps) {
  //   // change tab title when language change
  //   if (this.props.stateCurentLanguage !== prevProps.stateCurentLanguage) {
  //     this._changeThisTitle(I18n.t("SETTING"));
  //   }
  // }
  // config tabBottom title  --------------------------------------------------------------------------------------------------------------------


  // xu ly ngon ngu
  _storeLocalLanguage = async (lang) => {
    try {
      // console.log(lang);
      await AsyncStorage.setItem('currentLanguage', lang , (err, result)=> {
      });
    } catch (error) {
      // console.log(error)
    }
  };

  _getLanguageStore = async () => {
    try {
      const currLang = await AsyncStorage.getItem('currentLanguage');
    //  console.log(currLang)
    } catch (error) {
      // Error retrieving data
    }
  };

  _changeLang(language) {
    this.props._changeLanguage(language);
    this._storeLocalLanguage(language);
  }

  componentDidMount(){
    // console.log(this.props.stateCurentLanguage);
  }
  render() {
    I18n.locale = this.props.stateCurentLanguage;

    return (
      <View style={{ flex: 1 }}>
        <View style={{ height: heightHeader}}>
          <HeaderComponent
            titleName={I18n.t("SETTING")}
            hiddenButtonBack={true}
          />
        </View>

        <View style={{ flex: 1 }}>
          <ScrollView style={styles.scrollView}>
          <TouchableHighlight underlayColor="#ffffff" onPress={() => { this._changeLang("vi"); }}>
            <View style={styles.rowLanguage} >
              <Text>Tiếng Việt</Text>
              <RoundCheckbox
                // vi
                size={24}
                checked={this.props.stateCurentLanguage == "vi" ? true : false}
                onValueChange={() => {
                  this._changeLang("vi");
                }}
              />
            </View>
            </TouchableHighlight>
            <View
              style={{
                borderWidth: 0.5,
                borderBottomColor: "#ccc",
                marginHorizontal: "3%",
                width: "94%"
              }}
            />
            <TouchableHighlight underlayColor="#ffffff" onPress={() => { this._changeLang("en"); }}>
              <View style={styles.rowLanguage}>
                <Text>English</Text>
                <RoundCheckbox
                  //en
                  size={24}
                  checked={this.props.stateCurentLanguage == "en" ? true : false}
                  onValueChange={() => {
                    this._changeLang("en");
                  }}
                />
              </View>
            </TouchableHighlight>

                       {/* <TouchableOpacity
              style={styles.buttonSearch}
              underlayColor="#fcfcfc"
              onPress={() => {
                  this._getLanguageStore()
              }}
            >
              <Text>chuyen</Text>
            </TouchableOpacity> */}

          </ScrollView>
        </View>
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
    title: state.titleSavedInState
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SettingScreen);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center"
  },
  rowLanguage: {
    height: 50,
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20
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
