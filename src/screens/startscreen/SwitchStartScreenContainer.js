import React, { Component } from "react";
// import TabNavigatorScreen from "./tabnavigation/TabNavigatorScreen";
import WaittingScreen from "./WaittingScreen";
import { createSwitchNavigator , createAppContainer } from "react-navigation";

// import StackTabBottomScreen from "./tabnavigation/TabNavigatorScreen";
import StackTabBottomScreen from "./tabnavigation/TabSrackNavigatorScreen";

const SwichScreen = createSwitchNavigator(
  {
    TabBottomDashBoardScreen: {
      // screen: TabNavigatorScreen,
      screen: StackTabBottomScreen,
      navigationOptions: () => ({
        header: null
      })
    },
    Waitting: {
      screen: WaittingScreen,
      navigationOptions: () => ({
        header: null
      })
    },
    
  },
  {
    initialRouteName: "Waitting",
  }
)

const SwichStartScreenTag = createAppContainer(SwichScreen);

export default class SwitchStartScreen extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
        <SwichStartScreenTag />
    );
  }
}
