import React, { Component } from "react";
import { createStackNavigator, createAppContainer } from "react-navigation";
import LoginScreen from "./Login";
import LanguageChange from "./LanguageChange";


const AppNavigator = createStackNavigator(
  {
    Home: {
      screen: LoginScreen,
      navigationOptions: () => ({
        title: "LoginScreen Screen"
      })
    },
    LanguageChange: {
      screen: LanguageChange,
      navigationOptions: () => ({
        title: "LanguageChange Screen"
      })
    }
  },
  {
    initialRouteName: "LanguageChange",

    defaultNavigationOptions: {
      headerStyle: {
        backgroundColor: "#fcfcfc"
      },
      headerTintColor: "#000",
      headerTitleStyle: {
        fontWeight: "bold"
      }
    }
  }
);

const AppContainer = createAppContainer(AppNavigator);

export default class ContainerScreen extends Component {
  render() {
    return <AppContainer />;
  }
}
