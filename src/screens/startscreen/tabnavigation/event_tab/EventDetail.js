import React, { Component } from "react";
import WebViewAutoHeight from 'react-native-webview-autoheight';
import {
  Text,
  View,
  Image,
  Button,
  FlatList,
  StyleSheet,
  TouchableHighlight,
  WebView,
  ScrollView,
  Platform,
  Dimensions
} from "react-native";

import HeaderComponent from "../../../../components/HeaderComponent";
import LoadingComponent from "../../../../components/LoadingComponent";

// axios & cancel reques
import axios from "axios";
var CancelToken = axios.CancelToken;
var cancel;

import {
  widthPercentageToDP,
  heightPercentageToDP
} from "../../../../theme/scale";
import { rootPath, heightHeader } from "../../../../config/enviroment";
import moment from "moment";

// translate connect subcribe language change
import I18n from "../../../../translations/i18n";
import { connect } from "react-redux";


class EventDetail extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      currentEvent: {},
      errLoadData: false,
      isLoading: true
    };
  }

  getData(eventId) {
    const body = { code: "event", param: { _id: eventId } };
    axios({
      method: "post",
      url: `${rootPath}public/search`,
      data: { code: "event", param: { _id: eventId } },
      cancelToken: new CancelToken(function executor(c) {
        cancel = c;
      })
    })
      .then(response => {
        let responseListCollection = JSON.parse(JSON.stringify(response));
        if (
          responseListCollection &&
          responseListCollection.data.PHHAPI.body.length > 0
        ) {
          let currentEvent = new Object(); // create object to fix err when reder data
          currentEvent.image = responseListCollection.data.PHHAPI.body[0].image;
          currentEvent.begindate =
            responseListCollection.data.PHHAPI.body[0].begindate;
          currentEvent.enddate =
            responseListCollection.data.PHHAPI.body[0].enddate;
          currentEvent.begintime =
            responseListCollection.data.PHHAPI.body[0].begintime;
          currentEvent.endtime =
            responseListCollection.data.PHHAPI.body[0].endtime;
          currentEvent.viEventName =
            responseListCollection.data.PHHAPI.body[0].vi.name;
          currentEvent.enEventName =
            responseListCollection.data.PHHAPI.body[0].en.name;
          currentEvent.viAddress =
            responseListCollection.data.PHHAPI.body[0].vi.address;
          currentEvent.enAddress =
            responseListCollection.data.PHHAPI.body[0].en.address;
          currentEvent.visummary =
            responseListCollection.data.PHHAPI.body[0].vi.summary;
          currentEvent.ensummary =
            responseListCollection.data.PHHAPI.body[0].en.summary;
          currentEvent.begindate =
            responseListCollection.data.PHHAPI.body[0].begindate;
          currentEvent.enddate =
            responseListCollection.data.PHHAPI.body[0].enddate;
          currentEvent.viContent =
            responseListCollection.data.PHHAPI.body[0].vi.content;
          currentEvent.enContent =
            responseListCollection.data.PHHAPI.body[0].en.content;
          // console.log(currentEvent)
          this.setState(
            { currentEvent: currentEvent },
            // huy loadding || destroy loadding => lay du lieu thanh cong
            () => {
              // console.log(this.setState.currentEvent)
              this.setState({ isLoading: false }, () => {
                this.setState({ errLoadData: false });
              });
            }
          );
        }
      })
      .catch(err => {
        // huy loadding || destroy loadding => lay dl that bai
        if (axios.isCancel(err)) {
          // console.log("im canceled");
        } else {
          this.setState({ isLoading: false }, () => {
            this.setState({ errLoadData: true });
          });
        }
      });

    setTimeout(() => {
      cancel();
      if (this.state.isLoading == true) {
        this.setState({ errLoadData: true });
        this.setState({ isLoading: false });
      }
    }, 8000);
  }

  _parseMisecond(lang, numberOfMilisecond) {
    if (lang == "en" && numberOfMilisecond != undefined) {
      return moment(numberOfMilisecond, "x").format("MMM - DD");
    } else if (lang == "vi" && numberOfMilisecond != undefined) {
      return moment(numberOfMilisecond, "x").format("DD - MM");
    } else {
      return "___";
    }
  }

  componentDidMount() {
    const eventID = this.props.navigation.getParam("eventID", "NO-ID");
    this.getData(eventID);
  }

  
  _countHeightContent(text) {
    if (text != undefined) {
      converToStringText = `${text}`;
      sumLine = converToStringText.length / ((Dimensions.get("window").width * 90) / 750);
      return 25 * sumLine;
    }
  }

  _renderWebView() {
    const customStyle = "<style>* {max-width: 100%; font-family: 'Roboto'; font-size: 14px; text-align: justify!important; color: #000000!important;} html{ margin-left: 5%; margin-right: 5%;} body{ margin:0 } </style>";
      return (
        <WebViewAutoHeight 
            defaultHeight={100}
            scalesPageToFit={ Platform.OS == 'ios' ? false : true}
            source={{html: customStyle + 
            (this.props.stateCurentLanguage == "vi" && this.state.currentEvent != undefined ? this.state.currentEvent.viContent :  this.state.currentEvent.ensummary + '<br>' + this.state.currentEvent.enContent)
            }} />
                
      )
  }

  componentWillUnmount() {
    // cancel request
    if (this.state.errLoadData == false && this.state.isLoading == true) {
      cancel();
    }
  }

  render() {
    I18n.locale = this.props.stateCurentLanguage;
    const INJECTEDJAVASCRIPT = `const meta = document.createElement('meta'); meta.setAttribute('content', 'width=device-width, initial-scale=1 maximum-scale=1, user-scalable=0'); meta.setAttribute('name', 'viewport'); document.getElementsByTagName('head')[0].appendChild(meta); `;
    return (
      <View style={{ flex: 1 }}>
        <View style={{ height: heightHeader }}>
          <HeaderComponent
            titleName={I18n.t("EVENTS")}
          />
        </View>

        <View style={{ flex: 1 }}>
          <View style={{ height: this.state.isLoading ? 100 : 0 }}>
            <LoadingComponent Visible={this.state.isLoading} />
          </View>

          <View style={{ display: this.state.errLoadData ? 'flex' : 'none' }}>
            <Text style={{ width: "100%", marginTop: 40, fontSize: 14, color: "red", textAlign: "center" }}>
              {I18n.t("ERRLOADDATA")}
            </Text>
          </View>

          <ScrollView style={styles.styleScroll}> 
            <Image
              source={{
                uri:
                  `${rootPath}download?folder=event&file=` +
                  this.state.currentEvent.image
              }}
              style={styles.Image}
            />

            <Text style={[styles.title]}>
              {this.props.stateCurentLanguage == "vi"
                ? this.state.currentEvent.viEventName
                : this.state.currentEvent.enEventName}
            </Text>
            
            <Text style={styles.subTitleDate}>
              {this.props.stateCurentLanguage == "vi"
                ? this._parseMisecond("vi", this.state.currentEvent.begindate)
                : this._parseMisecond("en", this.state.currentEvent.begindate)}
              <Text style={{ color: "#333", fontSize: 14, fontWeight: "400" }}>
                {" "}
                {this.props.stateCurentLanguage == "vi" ? " đến " : " to "}{" "}
              </Text>
              {this.props.stateCurentLanguage == "vi"
                ? this._parseMisecond("vi", this.state.currentEvent.enddate)
                : this._parseMisecond("en", this.state.currentEvent.enddate)}
            </Text>

            <Text style={styles.subTitleTime}>
              {this.state.currentEvent.begintime} -{" "}
              {this.state.currentEvent.endtime}
            </Text>

            {this._renderWebView()}
          </ScrollView>
        </View>
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
)(EventDetail);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
    marginBottom: 100
  },
  styleScroll: {
    flex: 1,
    backgroundColor: "#fff",
    width: "100%"
  },
  left: {
    width: widthPercentageToDP("30%")
  },
  Image: {
    width: "90%",
    marginLeft: "5%",
    height: widthPercentageToDP("60%"),
    marginHorizontal: "2%",
    marginVertical: "4%"
  },
  rightInfo: {
    width: widthPercentageToDP("69%"),
    alignContent: "flex-start"
  },
  title: {
    width: "90%",
    fontSize: 18,
    fontFamily: 'Roboto-Regular',
    paddingLeft: "5%",
    color: "#0882b0",
    textAlign: "justify",
    fontWeight: "bold",
    lineHeight: 30
  },
  subTitleTime: {
    width: "90%",
    fontFamily: 'Roboto-Regular',
    fontSize: 13,
    color: "#999",
    textAlign: "justify",
    marginLeft: "5%",
    marginBottom: 10,
    lineHeight: 30
  },
  subTitleDate: {
    width: "90%",
    fontFamily: 'Roboto-Regular',
    fontSize: 18,
    color: "#b89d54",
    textAlign: "justify",
    marginBottom: 5,
    fontWeight: "900",
    marginLeft: "5%"
  },
  subTitleSummary: {
    width: "95%",
    height: 1400, marginLeft: "1%"
  },
  subTitleSummaryText: {
    width: "90%",
    marginLeft: "5%",
    color: "#333",
    fontSize: 13,
    textAlign: 'justify',
    lineHeight: 25
  },
  subTitleAdress: {
    width: "95%",
    height: 80, marginLeft: "1%"
  },
  displayNone: {
    height: 0,
    opacity: 0
  },
  displayBlock: {
    height: 30,
    opacity: 1
  }
});
