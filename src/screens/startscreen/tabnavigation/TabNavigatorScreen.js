import React, { Component } from "react";
import {  View, StyleSheet , Image} from "react-native";
import { createBottomTabNavigator, createAppContainer , createStackNavigator } from "react-navigation";
import FineArtScreen from "./fine_art_tab/FineArtScreen";
import SettingScreen from "./setting_tab/SettingScreen";
import AboutUsContainer from "./about_tab/AboutUsContainer";
import EventContainer from "./event_tab/EventContainer";
import MediaScreen from "./media_tab/MediaScreen";
import SearchItemScreen from "./search/SearchItemScreen";
import TitleComponent from "../../../components/TitleComponent";

// translate connect subcribe language change
import I18n from "../../../translations/i18n";
import { connect } from "react-redux";


// chú ý Với tab => phải set tabtitle cả default và vào từng tab
const TabNavigator = createBottomTabNavigator(
  {
    FineArt: {
      screen: FineArtScreen,
      navigationOptions: props => ({
        tabBarIcon: ({ tintColor }) => (
          <Image
            source={require("../../../assets/icon/FineArt.png")}
            style={{ width: 24, height: 24, tintColor: tintColor }}
          />
        ),
        tabBarLabel: ({focused, tintColor}) => ( <TitleComponent fontWeight = "400" tabType = "bottom" Color = {tintColor} titleEn="ARTWORKS" titleVi="TÁC PHẨM" />)
      })

    },
    Event: {
      screen: EventContainer,
      navigationOptions: props => ({
        tabBarIcon: ({ tintColor }) => (
          <Image
            source={require("../../../assets/icon/Event.png")}
            style={{ width: 24, height: 24, tintColor: tintColor }}
          />
        ),
        tabBarLabel: ({focused, tintColor}) => ( <TitleComponent fontWeight = "400" tabType = "bottom" Color = {tintColor} titleEn="EVENTS" titleVi="SỰ KIỆN" />)
      })
    },
    AboutUs: {
      screen: AboutUsContainer,
      navigationOptions: props => ({
        tabBarIcon: ({ tintColor }) => (
          <Image
            source={require("../../../assets/icon/AboutUS.png")}
            style={{ width: 24, height: 24, tintColor: tintColor }}
          />
        ),
        tabBarLabel: ({focused, tintColor}) => ( <TitleComponent fontWeight = "400" tabType = "bottom" Color = {tintColor} titleEn="ABOUT US" titleVi="GIỚI THIỆU" />)
      })
    },
    Media: {
      screen: MediaScreen,
      navigationOptions: props => ({
        tabBarIcon: ({ tintColor }) => (
          <Image
            source={require("../../../assets/icon/Media.png")}
            style={{ width: 24, height: 24, tintColor: tintColor }}
          />
        ),
        tabBarLabel: ({focused, tintColor}) => ( <TitleComponent fontWeight = "400" tabType = "bottom" Color = {tintColor} titleEn="MEDIA" titleVi="TRUYỀN THÔNG" />)
      })
    },
    Setting: {
      screen: SettingScreen,
      navigationOptions: props => ({
        tabBarIcon: ({ tintColor }) => (
          <Image
            source={require("../../../assets/icon/Setting.png")}
            style={{ width: 24, height: 24, tintColor: tintColor }}
          />
        ),
        tabBarLabel: ({focused, tintColor}) => ( <TitleComponent tabType = "bottom" Color = {tintColor} titleEn="SETTING" titleVi="CÀI ĐẶT" />)
      })
    }
  },
  {
    initialRouteName: "FineArt",
    animationEnabled: false,
    swipeEnabled: false,
    tabBarPosition: "top",
    swipeEnabled: false,
    lazy: true,
    tabBarOptions: {
      tinColor: "red",
      activeTintColor: "#00aeef",
      inactiveTintColor: "#c9c5cb",
      showIcon: true,
      showLabel: true,
      upperCaseLabel: false,
      allowFontScaling: true,
      labelStyle: { fontSize: 9 },
      style: {
        position: "absolute",
        left: 0,
        right: 0,
        bottom: 0,
        height: 55
      }
    },
    order: ["FineArt", "Event", "Media", "AboutUs", "Setting"]
  }
);
const TabNavigatorScreenTag = createAppContainer(TabNavigator);

class TabNavigatorScreen extends React.Component {

  static router = TabNavigatorScreenTag.router;//1
  constructor(props) {
    super(props);
  }

  render() {
    I18n.locale = this.props.stateCurentLanguage;
    const { navigation } = this.props;//2 pass prop

    return (
      <View style={styles.container}>
        <TabNavigatorScreenTag
          navigation={navigation}
        />
      </View>
    );
  }
}


// translate connect subcribe language change
const mapStateToProps = state => {
  return {
    stateCurentLanguage: state.stateCurentLanguage
  };
};

export default connect(
  mapStateToProps,
  null
)(TabNavigatorScreen);

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  tabBottom: {
    flex: 1
  },
  searchContainer: {
    height: 55,
    flexDirection: "row",
    backgroundColor: "transparent"
  },
  titleTabBottom: {
    color: "#fff",
    width: "100%",
    paddingTop: 15,
    textAlign: "center",
    fontSize: 20
  },
  buttonSearch: {
    width: 45,
    height: 45,
    position: "absolute",
    top: 10,
    right: 10,
    paddingTop: 5,
    paddingLeft: 10
  },
  icon: {
    width: 30,
    height: 30
  }
});
