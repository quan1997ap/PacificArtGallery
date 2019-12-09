import React, { Component } from "react";
import { Text, View, StyleSheet ,Image, TouchableOpacity , ImageBackground } from "react-native";

import { withNavigation } from "react-navigation";
import { heightHeader } from "../config/enviroment";

const paddingTop = 40;

class HeaderComponent extends Component {

  render() {
  
    return (
      <View style={styles.container}>
     
        <ImageBackground
          source={require("../assets/image/backgroundHeader.png")}
          style={styles.searchContainer}
        >
          <Text style={[{fontWeight: '600'},styles.titleTabBottom]}>
            <Text>{ this.props.titleName}</Text>
          </Text>

          <TouchableOpacity
            style={[styles.buttonBack]}
            underlayColor="#fcfcfc"
            onPress={() => { this.props.navigation.goBack() }}
          >
            <Image source= {require("../assets/icon/back.png")} style={[styles.iconBack, {width: this.props.hiddenButtonBack == true ?  0  : 13 }]}/>
          </TouchableOpacity>
        </ImageBackground>
      </View>
    );
  }
}

export default withNavigation(HeaderComponent);

const styles = StyleSheet.create({
container: {
    flex: 1,
    height: heightHeader
},
tabBottom: {
    flex: 1
},
// header
iconBack:{
  height: 23,
  width: 13
},
searchContainer: {
    flex: 1,
    flexDirection: "row",
    paddingTop: 40
},
titleTabBottom: {
    color: "#fff",
    width: "100%",
    textAlign: "center",
    fontSize: 20,
    fontWeight: 'bold',
},
buttonBack: {
    width: 50,
    height: 50,
    position: "absolute",
    top: 35,
    left: 5,
    paddingTop: 5,
    paddingLeft: 10
}
});
  