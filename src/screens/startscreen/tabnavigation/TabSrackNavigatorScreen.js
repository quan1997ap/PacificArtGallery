import React, { Component } from "react";
import { Text, View, StyleSheet, TouchableOpacity } from "react-native";
import {
  createBottomTabNavigator,
  createAppContainer,
  createStackNavigator
} from "react-navigation";

import TabNavigatorScreen from "./TabNavigatorScreen";
import VideoDetailScreen from "./media_tab/video_tab/VideoDetailScreen";
import IteamDetail from "./fine_art_tab/item_detail/IteamDetail";
import ArtistDetail from "./fine_art_tab/artist_tab/ArtistDetail";
import CollectionDetail from "./fine_art_tab/collection_tab/CollectionDetail";
import NewsDetailScreen from "./media_tab/news_tab/NewsDetailScreen";
import EventDetail from "./event_tab/EventDetail";
import ContactFormScreen from "./about_tab/ContactFormScreen";
import SearchItemScreen from "./search/SearchItemScreen";

// translate connect subcribe language change
import I18n from "../../../translations/i18n";
import { connect } from "react-redux";



// Tạo StackTabBottomNavigator
const StackTabBottomNavigator = createStackNavigator({
  TabNavigator: {
    screen: TabNavigatorScreen,
    navigationOptions: {
      header: null
    }
  },
  SearchItem: {
    screen: SearchItemScreen,
    navigationOptions: {
      header: null
    }
  },
  VideoDetail: {
    screen: VideoDetailScreen,
    navigationOptions: {
      header: null
    }
  },
  IteamDetail: {
    screen: IteamDetail,
    navigationOptions: {
      header: null
    }
  },
  ArtistDetail: {
    screen: ArtistDetail,
    navigationOptions: {
      header: null
    }
  },
  CollectionDetail: {
    screen: CollectionDetail,
    navigationOptions: {
      header: null
    }
  },
  EventDetail: {
    screen: EventDetail,
    navigationOptions: {
      header: null
    }
  },
  NewsDetail: {
    screen: NewsDetailScreen,
    navigationOptions: {
      header: null
    }
  },
  ContactForm: {
    screen: ContactFormScreen,
    navigationOptions: {
      header: null
    }
  },
});

const StackTabBottomScreenTag = createAppContainer(StackTabBottomNavigator);

class StackTabBottomScreen extends React.Component {
  static router = StackTabBottomScreenTag.router; //1

  constructor(props) {
    super(props);
  }

  render() {
    I18n.locale = this.props.stateCurentLanguage;
    const { navigation } = this.props; //2

    return (
      <View style={styles.container}>
        <StackTabBottomScreenTag navigation={navigation} />
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
)(StackTabBottomScreen);

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
