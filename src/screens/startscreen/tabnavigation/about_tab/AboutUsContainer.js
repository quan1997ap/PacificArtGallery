import React, { Component } from "react";
import {
  createAppContainer,
  createMaterialTopTabNavigator
} from "react-navigation";
import { Image , View , Text} from "react-native";
import ContactScreen from "./ContactScreen";
import HeaderComponent from "../../../../components/HeaderComponent";
import { heightHeader } from "../../../../config/enviroment";

// translate
import I18n from "../../../../translations/i18n";
import { connect } from "react-redux";
import AboutUsScreenTab from "./AboutUsScreenTab";


const TabTopAboutUsNavigator = createMaterialTopTabNavigator(
  {
    Contact: {
      screen: ContactScreen,
      navigationOptions: () => ({
        title: I18n.t("CONTACTUS")
      })
    },
    AboutUsScreen: {
      screen: AboutUsScreenTab,
      navigationOptions: () => ({
        title: I18n.t("CONTACTUS")
      })
    }
  },
  {
    initialRouteName: "AboutUsScreen",
    swipeEnabled: false,
    animationEnabled: false,
    swipeEnabled: true,
    tabBarPosition: "top",
    lazy: false,
    tabBarOptions: {
      tinColor: "red",
      activeTintColor: "#fff",
      inactiveTintColor: "#ccc",
      showIcon: true,
      showLabel: true,
      lazyLoad: true,
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
    order: ["AboutUsScreen", "Contact" ]
  }
);

// chú ý truyền props
//https://reactnavigation.org/docs/en/custom-navigators.html
//Tạo tabNavigator kết hợp với stack navigator

const TabTopAboutUsNavigatorTag = createAppContainer(TabTopAboutUsNavigator);

class AboutUsContainer extends Component {
  
  // pass navigation
  static router = TabTopAboutUsNavigatorTag.router;

  render() {
    const { navigation } = this.props;
    return (
      <View style={{ flex: 1 }}>
        <View style={{ height: heightHeader }}>
          <HeaderComponent
            hiddenButtonBack={true}
            titleName={I18n.t("ABOUTUS")}
          />
        </View>

        <View style={{ flex: 1 }}>
          <TabTopAboutUsNavigatorTag navigation={navigation} />
        </View>
      </View>
    );
  }
}

// translate connect subcribe language change___________________________________________________________________________________________________________________________________________
const mapStateToProps = state => {
  return {
    stateCurentLanguage: state.stateCurentLanguage
  };
};

export default connect(
  mapStateToProps,
  null
)(AboutUsContainer);
