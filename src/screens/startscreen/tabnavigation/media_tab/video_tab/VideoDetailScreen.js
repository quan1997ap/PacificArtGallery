import React, { Component } from "react";
import {
  View,
  StyleSheet,
  TouchableHighlight,
  Text,
  WebView,
  Image
} from "react-native";
import {
  widthPercentageToDP,
  heightPercentageToDP
} from "../../../../../theme/scale";
import Icon from "react-native-vector-icons/FontAwesome";
// allowsInlineMediaPlayback
// youtube
import YouTube from "react-native-youtube";
import { rootPath, apiKeyYoutube } from "../../../../../config/enviroment";

// translate connect subcribe language change
import I18n from "../../../../../translations/i18n";
import { connect } from "react-redux";

class VideoDetailScreen extends React.Component {
  static navigationOptions = {
    header: null
  };

  constructor(props) {
    super(props);
    this.state = {
      videoId: "",
      height: (widthPercentageToDP("90%") * 3) / 4
    };
  }

  componentDidMount() {
    const videoId = this.props.navigation.getParam("videoId", "NO-ID");
    this.setState({ videoId: videoId }, () => {});
  }

  handleReady = () => {
    setTimeout(() => this.setState({ height: (widthPercentageToDP("90%") * 3) / 4 + 2  }), 1000);
  }


  render() {
    I18n.locale = this.props.stateCurentLanguage;
    return (
      <View style={styles.contentContainer}>
        <TouchableHighlight
          style={styles.backButton}
          onPress={() => {
            this.props.navigation.goBack(null);
          }}
        >
          <Image
            style={styles.backIcon}
            source={require("../../../../../assets/icon/iconExit.png")}
          />
        </TouchableHighlight>

        <YouTube
         showFullscreenButton ={false}
          videoId={this.state.videoId}
          play={true}
          fullscreen={false}
          loop={false}

          apiKey= {apiKeyYoutube}
          onError={e => this.setState({ errorLoadVideo: e.error })}
          onReady  = {this.handleReady}
          style={[styles.backgroundVideo, {height: this.state.height}]}
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
)(VideoDetailScreen);

const styles = StyleSheet.create({
  contentContainer: {
    backgroundColor: "#000",
    flex: 1,
    justifyContent: "center",
    alignItems: "center"
  },
  containerColumn: {
    flex: 1,
    flexDirection: "column",
    paddingTop: 25,
    paddingVertical: "5%"
  },
  backgroundVideo: {
    width: widthPercentageToDP("90%"),
    height: (widthPercentageToDP("90%") * 3) / 4
  },
  styleFlatlist: {
    paddingBottom: 60
  },
  backButton: {
    width: 50,
    height: 50,
    backgroundColor: "#000",
    position: "absolute",
    top: 40,
    left: "5%"
  },
  backIcon: {
    width: widthPercentageToDP("7%"),
    height: widthPercentageToDP("7%")
  }
});
