// thu vien hay dung
//https://codingislove.com/top-15-react-native-libraries/

import React, { Component } from "react";
import {  StyleSheet } from "react-native";
// import Orientation from 'react-native-orientation-locker';

import { createStore } from "redux";
import { Provider } from "react-redux";
import allReducers from "./src/reducers/index";


import SwitchStartScreen from "./src/screens/startscreen/SwitchStartScreenContainer";

let store = createStore(allReducers);

export default class App extends Component{
  constructor(props){
    super(props);
    this.state={
      currentLanguage : ''
    }
  }
  
  componentDidMount() {
    // Orientation.lockToPortrait()
    // console.log(store.getState());
    store.subscribe(()=>{
      // console.log(store.getState());
      // this.setState({ currentLanguage : store.getState().stateCurentLanguage },
      // ()=> {console.log(this.state.currentLanguage)}
      // )
    })
  }


  render() {
    return (
      <Provider store={store}>
        <SwitchStartScreen />
      </Provider>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F5FCFF"
  },
  welcome: {
    fontSize: 20,
    textAlign: "center",
    margin: 10
  },
  instructions: {
    textAlign: "center",
    color: "#333333",
    marginBottom: 5
  }
});
