import React, { Component } from "react";
import {
  createMaterialTopTabNavigator,
  createAppContainer,
  createStackNavigator
} from "react-navigation";
import { View, StyleSheet, Image } from "react-native";
import NewScreenTabHeader from "./news_tab/NewScreenTabHeader";
import VideoScreenTabHeader from "./video_tab/VideoScreenTabHeader";
import HeaderComponent from "../../../../components/HeaderComponent";
import { heightHeader } from "../../../../config/enviroment";
import TitleComponent from "../../../../components/TitleComponent";

// translate connect subcribe language change
import I18n from "../../../../translations/i18n";
import { connect } from "react-redux";


//B1: Create TabNavigator
//B2: Create StackNavigator = TabNavigator + DetaiOtherScreen
//B3: Connect app to Translate vs Redux

const TabTopNavigator = createMaterialTopTabNavigator(
  {
    NewsTab: {
      screen: NewScreenTabHeader,
      navigationOptions: props => ({
        header: null,
        tabBarLabel: ({focused, tintColor}) => ( <TitleComponent fontWeight = "bold" tabType = "top" Color = {tintColor} titleEn="NEWS" titleVi="TIN TỨC" />)
      })
    },
    VideoTab: {
      screen: VideoScreenTabHeader,
      navigationOptions: props => ({
        header: null,
        tabBarLabel: ({focused, tintColor}) => ( <TitleComponent fontWeight = "bold" tabType = "top" Color = {tintColor} titleEn="VIDEO" titleVi="VIDEO" />)
      })
    }
  },
  {
    initialRouteName: "NewsTab",
    swipeEnabled: true,
    animationEnabled: false,
    tabBarPosition: "top",
    lazy: true,
    tabBarOptions: {
      tinColor: "red",
      activeTintColor: "#fff",
      inactiveTintColor: "#ccc",
      showIcon: true,
      showLabel: true,
      lazyLoad: false,
      upperCaseLabel: true,
      labelStyle: {
        fontSize: 14,
        fontWeight: "bold"
      },
      tabStyle: {
        height: 50,
        paddingTop: 0,
        paddingBottom: 18
      },
      style: {
        backgroundColor: "#0882b0",
        height: 50
      }
    },
    order: ["NewsTab", "VideoTab"]
  }
);

const TabTopMediaTag = createAppContainer(TabTopNavigator);

// 3 bước truyền router
// static router = TabTopMediaTag.router;
// const { navigation } = this.props;
//  navigation={navigation}


class MediaScreen extends React.Component {

  static router = TabTopMediaTag.router;// 1 pass routerPram

  render() {
    I18n.locale = this.props.stateCurentLanguage;
    const { navigation } = this.props;// 2 pass routerPram
    return (
      <View style={{ flex: 1 }}>
        <View style={{ height: heightHeader }}>
          <HeaderComponent
            hiddenButtonBack={true}
            titleName={I18n.t("MEDIA")}
          />
        </View>

        <View style={{ flex: 1 }}>
        {/* 3 pass routerPram */}
          <TabTopMediaTag navigation={navigation} />
        </View>
      </View>
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
)(MediaScreen);

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  tabBottom: {
    flex: 1
  }
});
