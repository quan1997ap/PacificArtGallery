import React, { Component } from "react";
import {
  Text,
  View,
  Image,
  Button,
  ScrollView,
  FlatList,
  StyleSheet,
  WebView,
  TouchableHighlight
} from "react-native";
import axios from "axios";
import {
  widthPercentageToDP,
  heightPercentageToDP
} from "../../../../../theme/scale";
// monent.js
import moment from "moment";

// translate connect subcribe language change
import I18n from "../../../../../translations/i18n";
import { connect } from "react-redux";
import { rootPath, apiKeyYoutube } from "../../../../../config/enviroment";
import { AsyncStorage } from "react-native";
import LoadingComponent from "../../../../../components/LoadingComponent";
import subStringWord from "../../../../../config/function"

class VideoClass {
  constructor() {
    this._id = "";
    this.authorNameVi = "";
    this.authorNameEn = "";
    this.titleVi = "";
    this.titleEn = "";
    (this.materialVi = ""), (this.materialEn = "");
    this.thumbnail = "";
  }
}

class VideoScreenTabHeader extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      listVideo: [],
      errLoadData: false,
      errorLoadVideo: false,
      navigationState: {},
      isLoading: true
    };
  }

  _getVideo() {
    body = {
      code: "newsnocontent",
      param: { isactive: true, type: "1" },
      sort: { createddate: -1 },
      pagesize: "10",
      pageindex: "1"
    };
    axios
      .post(`${rootPath}public/search`, body, {
        headers: { "Content-Type": "application/json" }
      })
      .then(videoResponse => {
        if (videoResponse && videoResponse.data.PHHAPI.body.length > 0) {
          this.setState({ listVideo: videoResponse.data.PHHAPI.body }, () => {
            this.setState({ isLoading: false });
           // console.log(this.state.listVideo);
          });
        }
      })
      .catch(err => {
        this.setState({ errLoadData: true });
        // console.log(err);
      });
  }

  _YouTubeGetID(url) {
    let ID = "";
    url = url
      .replace(/(>|<)/gi, "")
      .split(/(vi\/|v=|\/v\/|youtu\.be\/|\/embed\/)/);
    if (url[2] !== undefined) {
      ID = url[2].split(/[^0-9a-z_\-]/i);
      ID = ID[0];
    } else {
      ID = url;
    }
    return ID;
  }

  _renderFooter() {
    return <LoadingComponent Visible={this.state.isLoading} />;
  }

  componentDidMount() {
    this._getVideo();
  }

  render() {
    I18n.locale = this.props.stateCurentLanguage;
    const INJECTEDJAVASCRIPT = `const meta = document.createElement('meta'); meta.setAttribute('content', 'width=device-width, initial-scale=1 maximum-scale=1, user-scalable=0'); meta.setAttribute('name', 'viewport'); document.getElementsByTagName('head')[0].appendChild(meta); `;
    return (
      <ScrollView contentContainerStyle={styles.contentContainer}>
        <FlatList
          data={this.state.listVideo}
          style={styles.styleFlatlist}
          keyExtractor={item => item._id + "key"}
          extraData={this.props.stateCurentLanguage}
          renderItem={({ item, index }) => {
            let videoId = this._YouTubeGetID(item.video);
            return (
              <TouchableHighlight
                underlayColor="#fcfcfc"
                onPress={() => {
                  
                  this.props.navigation.navigate("VideoDetail", {
                    hideTabBar: true, videoId: videoId
                  });
                 
                }}
                style={[
                  styles.containerColumn,
                  { backgroundColor: index % 2 == 0 ? "#fff" : "#f5f5f5" }
                ]}
              >
                <View style={{ flex: 1 }}>
                  <View style={styles.backgroundVideoImage}>
                    <Image
                      source={{
                        uri: `https://img.youtube.com/vi/${videoId}/mqdefault.jpg`
                      }}
                      style={{ width: "100%", height: widthPercentageToDP("60%") }}
                    />
                    <Image
                      source={require("../../../../../assets/icon/play-button.png")}
                      style={styles.styleButtonPlayVideo}
                    />
                  </View>
                  <View style={styles.detailInfo}>
                    <Text style={[styles.title, {}]}>
                      {this.props.stateCurentLanguage == "vi"
                        ? item.vi.title
                        : item.en.title}
                    </Text>


                    {/* <WebView
                      javaScriptEnabled={true}
                      scalesPageToFit={true}
                      scrollEnabled={false}
                      injectedJavaScript={INJECTEDJAVASCRIPT}
                      style={[styles.subTitleSummary, {flex:1,backgroundColor: index % 2 == 0 ? "#fff" : "#f5f5f5"}]}
                        source={{
                          html: this.props.stateCurentLanguage == "vi" 
                            ? `<p style="text-align: justify;font-size: 14px ; line-height: 20px; color: #333333; height: 70px;margin-left: -2%" >${item.vi.summary}</p>`
                            : `<p style="text-align: justify;font-size: 14px ; line-height: 20px;color: #333333; height: 70px;margin-left: -2%" >${item.en.summary}</p>`,
                          baseUrl: ""
                        }}
                    /> */}

                    <Text style={styles.subTitleSummaryText}>
                      {this.props.stateCurentLanguage == "vi" ?  item.vi.summary :  item.en.summary}
                    </Text>


                  </View>
                </View>
              </TouchableHighlight>
            );
          }}
          ListFooterComponent={this._renderFooter.bind(this)}
        />
      </ScrollView>
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
)(VideoScreenTabHeader);

const styles = StyleSheet.create({
  contentContainer: {
    backgroundColor: "#fff"
  },
  styleButtonPlayVideo: {
    position: "absolute",
    width: widthPercentageToDP("20%"),
    height: widthPercentageToDP("20%"),
    top: widthPercentageToDP("20%"),
    left: widthPercentageToDP("35%")
  },
  containerColumn: {
    flex: 1,
    flexDirection: "column",
    paddingTop: 25,
    paddingVertical: "5%",

  },
  backgroundVideoImage: {
    width: "90%",
    marginLeft: "5%",
    backgroundColor: "#fcfcfc"
  },
  styleFlatlist: {
    paddingBottom: 0
  },
  detailInfo: {
    paddingLeft: "5%",
    marginTop:10
  },
  newsImage: {
    width: "100%",
    height: 300
  },
  title: {
    width: "90%",
    fontSize: 15,
    color: "#0882b0",
    textAlign: "justify",
    marginVertical: 5,
    fontWeight: "bold",
    lineHeight: 25
  },
  subTitleDate: {
    width: "90%",
    fontSize: 13,
    color: "#b89d54",
    textAlign: "justify",
    lineHeight: 25
  },
  subTitleSummary: {
    width: "95%",
    height: 100
  },
  subTitleSummaryText: {
    width: "95%",
    fontSize: 13,
    color: "#333333",
    textAlign: "justify",
    lineHeight: 25,
    marginBottom: 20
  }
});
