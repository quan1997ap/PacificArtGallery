import React, { Component } from "react";
import {
  createMaterialTopTabNavigator,
  createAppContainer,
  createStackNavigator
} from "react-navigation";
import ArtistTabHeader from "./artist_tab/ArtistTabHeader";
import FeatureTabHeader from "./feature_tab/FeatureTabHeader";
import CollectionTabHeader from "./collection_tab/CollectionTabHeader";
import TitleComponent from "../../../../components/TitleComponent";

import {
  View,
  Text,
  StyleSheet,
  ImageBackground,
  TouchableOpacity,
  Image,
  StatusBar
} from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";

// translate connect subcribe language change
import I18n from "../../../../translations/i18n";
import { connect } from "react-redux";
import { heightHeader } from "../../../../config/enviroment";


// tab Top FineArt

const TabTopNavigator = createMaterialTopTabNavigator(
  {
    CollectionTab: {
      screen: CollectionTabHeader,
      navigationOptions: props => ({
        header: null,
        tabBarLabel: ({focused, tintColor}) => ( <TitleComponent fontWeight = "bold" tabType = "top" Color = {tintColor} titleEn="COLLECTION" titleVi="BỘ SƯU TẬP" />)
      })

    },
    ArtistTab: {
      screen: ArtistTabHeader,
      navigationOptions: props => ({
        header: null,
        tabBarLabel: ({focused, tintColor}) => ( <TitleComponent fontWeight = "bold" tabType = "top" Color = {tintColor} titleEn="ARTIST" titleVi="HỌA SĨ" />)
      })
    },
    FeatureTab: {
      screen: FeatureTabHeader,
      navigationOptions: props => ({
        header: null,
        tabBarLabel: ({focused, tintColor}) => ( <TitleComponent fontWeight = "bold" tabType = "top" Color = {tintColor} titleEn="FEATURE" titleVi="NỔI BẬT" />)
      })
    }
  },
  {
    initialRouteName: "CollectionTab",
    swipeEnabled: false,
    animationEnabled: false,
    swipeEnabled: true,
    tabBarPosition: "top",
    lazy: true,
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
    order: ["CollectionTab", "ArtistTab", "FeatureTab"]
  }
);

// chú ý truyền props
//https://reactnavigation.org/docs/en/custom-navigators.html
//Tạo tabNavigator kết hợp với stack navigator

const TabTopFineArtTag = createAppContainer(TabTopNavigator);



class FineArtScreen extends React.Component {
  static router = TabTopFineArtTag.router;//1

  render() {
    I18n.locale = this.props.stateCurentLanguage;
    const { navigation } = this.props;//2 pass navigation
    return (
      <View style={styles.container}>
       <StatusBar translucent={true} backgroundColor="transparent" />
        {/* Kết hợp tab navigator và stack navigator */}
        <ImageBackground
          source={require("../../../../assets/image/backgroundHeader.png")}
          style={styles.searchContainer}
        >
          <Text style={styles.titleTabBottom}>{I18n.t("ARTWORKS")}</Text>
          <TouchableOpacity
            style={styles.buttonSearch}
            underlayColor="#fcfcfc"
            onPress={() => {
              this.props.navigation.navigate("SearchItem");
            }}
          >
            <Icon name="search" size={22} color="#fff" />
          </TouchableOpacity>
        </ImageBackground>

        <View style={styles.container}>
          <TabTopFineArtTag navigation={navigation} />
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
)(FineArtScreen);

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  tabBottom: {
    flex: 1
  },
  // header
  searchContainer: {
    height: heightHeader,
    flexDirection: "row",
    paddingTop: 25
  },
  titleTabBottom: {
    fontWeight: "bold",
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
    top: 35,
    right: 10,
    paddingTop: 5,
    paddingLeft: 10
  }
});
