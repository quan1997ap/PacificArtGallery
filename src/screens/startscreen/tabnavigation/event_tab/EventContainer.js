import React, { Component } from "react";
import {
  // Platform,
  // StyleSheet,
  // Text,
  // View,
  // Button,
  // FlatList,
  // TouchableOpacity,
  // Alert,
  Image
} from "react-native";

import { createStackNavigator, createAppContainer } from "react-navigation";
import EventScreen from "./EventScreen";
import EventDetail from "./EventDetail";

// translate connect subcribe language change
import I18n from "../../../../translations/i18n";
import { connect } from "react-redux";
import { rootPath } from "../../../../config/enviroment";

const AppNavigator = createStackNavigator(
  {
    Event: {
      screen: EventScreen,
      navigationOptions: () => (
        {
          title: "Event Screen"
        },
        { header: null }
      )
    },
  },
  {
    initialRouteName: "Event",

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

const EventContainerTag = createAppContainer(AppNavigator);

class EventContainer extends Component {
  static router = EventContainerTag.router; //1

  render() {
    const { navigation } = this.props; //2
    return <EventContainerTag  navigation={navigation}/>;
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
)(EventContainer);
