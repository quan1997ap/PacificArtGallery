import React, { Component } from "react";
import WebViewAutoHeight from 'react-native-webview-autoheight';
import {
  Text,
  View,
  Image,
  Alert,
  StyleSheet,
  WebView,
  ImageBackground,
  Platform
} from "react-native";

import {
  widthPercentageToDP,
  heightPercentageToDP
} from "../../../../../theme/scale";
import HeaderComponent from "../../../../../components/HeaderComponent";
import { rootPath, heightHeader } from "../../../../../config/enviroment";
import LoadingComponent from "../../../../../components/LoadingComponent";

import axios from "axios";
var CancelToken = axios.CancelToken;
var cancel;

// translate connect subcribe language change
import I18n from "../../../../../translations/i18n";
import { connect } from "react-redux";
import Dimensions from "Dimensions";
import { ScrollView } from "react-native-gesture-handler";


class NewsDetailClass {
  constructor() {
    this._id = "";
    this.authorNameVi = "";
    this.authorNameEn = "";
    this.titleVi = "";
    this.titleEn = "";
    (this.contentVi = ""), (this.contentEn = "");
    this.summaryVi = "";
    this.summaryEn = "";
  }
}

class NewDetailScreen extends React.Component {

  constructor(props) {
    super(props);
    let element = new NewsDetailClass();
    this.state = {
      currentNewsDetail: { element },
      getSuccessData: false,
      htmlVi: "",
      htmlEn: "",
      newsId: "",
      errLoadData: false,
      isLoading: true,
    };
  }

  // convert data for webView in NewDetailSceen
  _convertDataForWebView = (title, summary, content) => {
    if (title == undefined || summary == undefined || content == undefined) {
      return `
          <div style= "overflow-x: hidden;font-size: 15px;padding: 0 4%, flex:1">
              <p style="color: #0882b0 !important ;text-align: justify  !important;font-size: 18px;">.</p>
              <p style="text-align: justify  !important;" >.</p>
              <div  style="text-align: justify  !important;font-size: 14px;">
                ...
              </div>
          </div>
        `;
    } else {
      widthImg = `"` + (Dimensions.get("window").width * 0.88 - 3) + "px" + `"`;
      var regex = /<img/gi;
      contentStyleImage = content.replace(regex, `<img width = ${widthImg} `);
      return `<div style= "overflow-x: hidden;font-size: 15px;padding: 0 4%, flex:1">
              <p style="padding: 0 4%;color: #0882b0 !important ;text-align: justify  !important;font-size: 18px;"> ${title}</p>
              <p style="padding: 0 4%;text-align: justify  !important;" > ${summary}</p>
              <div  style="padding: 0 4%;text-align: justify  !important;font-size: 14px;">
                ${contentStyleImage}
              </div>
          </div>`;
    }
  }

  // get data event detail
  _getNewsDetailWithId = (itemId) =>  {
    let currentNewsDetail = new NewsDetailClass();
    body = { code: "news", param: { _id: itemId } };
    axios({
        method: 'post',
        url: `${rootPath}public/search`,
        data: { code: "news", param: { _id: itemId } },
        cancelToken: new CancelToken(function executor(c) {
          cancel = c;
        })
      })
      .then(response => {
        // console.log(response)
        // map & convert data  : chỉ lấy các thuộc tính cần thiết
        let newsDetailConvert = JSON.parse(JSON.stringify(response));
        let currentNewsDetail = new Object();
        if (
          newsDetailConvert &&
          newsDetailConvert.data &&
          newsDetailConvert.data.PHHAPI
        ) {
          let newsDetail = newsDetailConvert.data.PHHAPI.body[0];
          currentNewsDetail._id = newsDetail._id;
          // currentNewsDetail.authorNameVi = newsDetail.vi.author;
          // currentNewsDetail.authorNameEn = newsDetail.en.author;
          currentNewsDetail.titleVi = newsDetail.vi.title;
          currentNewsDetail.titleEn = newsDetail.en.title;
          currentNewsDetail.contentVi = newsDetail.vi.content;
          currentNewsDetail.contentEn = newsDetail.vi.content;
          currentNewsDetail.summaryVi = newsDetail.vi.summary;
          currentNewsDetail.summaryEn = newsDetail.vi.summary;
        }
        return currentNewsDetail;
      })
      .then((currNewsDetail) => {
        if (currNewsDetail != null && currNewsDetail != undefined) {
          // convert data  for web view
          let htmlVi_ = this._convertDataForWebView(
            currNewsDetail.titleVi,
            currNewsDetail.summaryVi,
            currNewsDetail.contentVi
          );
          let htmlEn_ = this._convertDataForWebView(
            currNewsDetail.titleEn,
            currNewsDetail.summaryEn,
            currNewsDetail.contentEn
          );

          // if (
          //   htmlEn.length > 0 &&
          //   htmlVi.length > 0 &&
          //   htmlEn.length != undefined &&
          //   htmlVi.length != undefined &&
          //   this.state.isLoading == true
          // ) {
            this.setState({
                htmlVi: htmlVi_,
                htmlEn: htmlEn_,
                isLoading: false,
                errLoadData: false
              });
          // }
        }
      })
      .catch(err => {
        if(axios.isCancel(err)){
          console.log('im canceled');
        }
        else{
          this.setState({ isLoading: false } , ()=> {
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
    }, 25000);
  }

  componentDidMount() {
    let newsId = this.props.navigation.getParam("newsId", "NO-Data");
    if (newsId != "" && newsId != "NO-Data") {
      this._getNewsDetailWithId(newsId)
    }
  }

  componentWillUnmount(){
    // cancel request
    if(this.state.errLoadData == false && this.state.isLoading == true){
      cancel();
    }
  }

  _renderWebView(){
    const customStyle = "<style>* {max-width: 100%; font-family: 'Roboto'; font-size: 14px; text-align: justify!important;} body{ margin:0 } </style>";
    const INJECTEDJAVASCRIPT = `const meta = document.createElement('meta'); meta.setAttribute('content', 'width=device-width, initial-scale=1 maximum-scale=1, user-scalable=0'); meta.setAttribute('name', 'viewport'); document.getElementsByTagName('head')[0].appendChild(meta); `;
    if (Platform.OS == 'ios') {
      return (
      <WebViewAutoHeight
        defaultHeight={100}
        scalesPageToFit={false}
        source={{
          html: customStyle+ (this.props.stateCurentLanguage == "vi" ? this.state.htmlVi : this.state.htmlEn)
        }}
      />
      )
    } else {
      return (
      <WebView
        originWhitelist={["*"]}
        javaScriptEnabled={true}
        scalesPageToFit={true}
        scrollEnabled={true}
        injectedJavaScript={INJECTEDJAVASCRIPT}
        style={[styles.styleWebView]}
        source={{
          html:
            this.props.stateCurentLanguage == "vi"
              ? this.state.htmlVi
              : this.state.htmlEn,
          baseUrl: ""
        }}
      />
      )
    }
  }


  render() {
    I18n.locale = this.props.stateCurentLanguage;
    return (
      <View style={{ flex: 1 }}>
        <View style={{  height: 80, width: "100%" }}>
          <HeaderComponent
            style={{ height: 80 }}
            titleName={I18n.t("NEWSDETAIL")}
          />
        </View>
        <View style={{ height: this.state.isLoading ? 100 : 0 }}>
          <LoadingComponent Visible={this.state.isLoading} />
        </View>

        <View style={{ height: this.state.errLoadData ? heightHeader : 0 }}>
          <Text style={{ width: "100%", marginTop: 40,fontSize: 14, color : "red", textAlign: "center" }}>
            {I18n.t("ERRLOADDATA")}
          </Text>
        </View>
        <View style={{ flex: 1 }}>
          <ScrollView>
          
            {this._renderWebView()}
          </ScrollView>
        </View>
      </View>
    );
  }
};



// translate connect subcribe language change
const mapStateToProps = state => {
  return {
    stateCurentLanguage: state.stateCurentLanguage
  };
};

export default connect(
  mapStateToProps,
  null
)(NewDetailScreen);

const styles = StyleSheet.create({
  containerRow: {
    width: "100%",
    paddingBottom: 70
  },
  styleWebView: {
    width: "100%",
    minHeight: Dimensions.get('window').height - 80,
    flex: 1,
    paddingVertical: "4%"
  },
  title: {
    width: "90%",
    fontSize: 15,
    paddingLeft: "5%",
    color: "#0882b0",
    textAlign: "justify",
    marginTop: "-1%",
    fontWeight: "bold"
  },
  subTitleDate: {
    width: "90%",
    fontSize: 13,
    color: "#b89d54",
    paddingLeft: "5%",
    textAlign: "justify"
  },
  subTitleSummary: {
    width: "90%",
    fontSize: 13,
    color: "#333333",
    paddingLeft: "5%",
    textAlign: "justify"
  },
  spinnerStyle: {
    position: "absolute",
    top: heightPercentageToDP("50%"),
    left: widthPercentageToDP("30%"),
    width: widthPercentageToDP("30%")
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
