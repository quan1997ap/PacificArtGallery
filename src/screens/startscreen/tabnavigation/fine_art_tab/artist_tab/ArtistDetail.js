import React, { Component } from "react";
import WebViewAutoHeight from 'react-native-webview-autoheight';
import {
  Image,
  Button,
  StyleSheet,
  ScrollView,
  View,
  WebView,
  Platform
} from "react-native";
import axios from "axios";
import HeaderComponent from "../../../../../components/HeaderComponent";
import {
  widthPercentageToDP,
  heightPercentageToDP
} from "../../../../../theme/scale";
import { Dimensions } from "react-native";

// translate connect subcribe language change
import I18n from "../../../../../translations/i18n";
import { connect } from "react-redux";
import { rootPath, heightHeader } from "../../../../../config/enviroment";
import LoadingComponent from "../../../../../components/LoadingComponent";


class ArtistDetail extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      currentArtist: {},
      errLoadData: false,
      widthImg : Dimensions.get('window').width*0.6,
      heightImg : Dimensions.get('window').width*0.8,
      marginLeftImg: Dimensions.get('window').width*0.2,
      isLoading: true
    };
  }

  _getArtistDetailWithId(artistId) {
    axios
      .post(
        "https://pacificartgallery.com/artgallery/public/search",
        {
          code: "author",
          param: { _id: artistId }
        },
        {
          headers: { "Content-Type": "application/json" }
        }
      )
      .then(response => {
        // map & convert data  : chỉ lấy các thuộc tính cần thiết
        let responseArtistDetail = JSON.parse(JSON.stringify(response));
        if (
          responseArtistDetail &&
          responseArtistDetail.data.PHHAPI.body.length > 0
        ) {
          let originDataArtist = responseArtistDetail.data.PHHAPI.body[0];
          let currentArtist = new Object(); // create object to fix err when reder data

          currentArtist._id = originDataArtist._id;
          currentArtist.image = originDataArtist.image;
          currentArtist.birthdate = originDataArtist.birthdate;
          currentArtist.deathdate = originDataArtist.deathdate;
          currentArtist.gender = originDataArtist.gender;

          currentArtist.viArtistName = originDataArtist.vi.fullname;
          currentArtist.enArtistName = originDataArtist.en.fullname;
          currentArtist.viDescription = originDataArtist.vi.description;
          currentArtist.enDescription = originDataArtist.en.description;

          this.setState({ currentArtist: currentArtist }, () => {
            this.setState({isLoading : false})
          });
        }
      })
      .catch(err => {
        this.setState({ errLoadData: true });
        // console.log(err);
      });
  }

  _countHeightContent(text) {
    if (text != undefined) {
      converToStringText = `${text}`;
      sumLine =
        converToStringText.length /
        ((Dimensions.get("window").width * 90) / 520);// * 90% / 52 px = width / do dai 1 ki tu
   //   return 33 * sumLine + this.state.heightImg + this.state.heightImg+ 0.2;

      if (Dimensions.get('window').width < 600){
        return 33 * sumLine + this.state.heightImg + this.state.heightImg+ 0.1;
      } 
      else{
        return 33 * sumLine + this.state.heightImg + this.state.heightImg+ 0.2;
      }
    }
  }

  componentDidMount() {
    const artistID = this.props.navigation.getParam("artistID", "NO-ID");
    this._getArtistDetailWithId(artistID);
  }

  render() {
    I18n.locale = this.props.stateCurentLanguage;
    imglink = this.state.currentArtist.image;

    const INJECTEDJAVASCRIPT = `const meta = document.createElement('meta'); meta.setAttribute('content', 'width=device-width, initial-scale=1 maximum-scale=1, user-scalable=0'); meta.setAttribute('name', 'viewport'); document.getElementsByTagName('head')[0].appendChild(meta); `;
    uri = `${rootPath}download?folder=author&file=${imglink}`
    return (
      <View style={{ flex: 1 }}>
        <View style={{ height: heightHeader }}>
          <HeaderComponent
            titleName={I18n.t("ARTISTTABTOP")}
          />
        </View>

        <View style={{ flex: 1 }}>
          <View style={{ height: this.state.isLoading ? 100 : 0 }}>
            <LoadingComponent Visible={this.state.isLoading} />
          </View>
          <ScrollView style={styles.containerRow}>
            {/* <WebView
              javaScriptEnabled={true}
              scalesPageToFit={true}
              scrollEnabled={false}
              style={[
                styles.styleWebView,
                {
                  height: this._countHeightContent(
                    this.state.currentArtist.viDescription ||
                      this.state.currentArtist.enDescription
                  )
                }
              ]}
              injectedJavaScript={INJECTEDJAVASCRIPT}
              source={{
                html:
                  this.props.stateCurentLanguage == "vi" && this.state.currentArtist != undefined
                    ? `<div  style= "overflow-x: hidden;padding-top: 20px; display: flex; flex-direction: column ;justify-content:"center">
                       
                          <img alt="" style="margin-left: ${this.state.marginLeftImg}px; width: ${this.state.widthImg}px; height:${this.state.heightImg}px" src="${uri}">
                          <div style="padding: 0 4%;font-size: 14px;text-align: justify ;margin-top: 20px;">
                                ${ this.state.currentArtist.viDescription}
                          </div>
                      </div>`

                    : `<div  style= "overflow-x: hidden;padding-top: 20px">
                          <div style="margin-left: ${this.state.marginLeftImg}px;width: ${this.state.widthImg}px; height:${this.state.heightImg}px">
                            <div class="crop" style=" position: relative; overflow: hidden;width: 60%;padding-bottom: 80%;margin-bottom: 15px;">
                              <img alt="" style="position: absolute;left: -100%;right: -100%;width: 100%;" src="${uri}">
                            </div>
                          </div>

                          <div style="padding: 0 4%;font-size: 14px;text-align: justify ;margin-top: 20px;">
                                ${ this.state.currentArtist.enDescription}
                          </div>
                      </div>`,
                baseUrl: ""
              }}
            /> */}
            <WebViewAutoHeight 
              defaultHeight={100}
              scalesPageToFit={ Platform.OS == 'ios' ? false : true}
              source={{
                html: this.props.stateCurentLanguage == "vi" && this.state.currentArtist != undefined
                ? `<div  style= "overflow-x: hidden;padding-top: 20px; display: flex; flex-direction: column ;justify-content:"center">
                   
                      <img alt="" style="margin-left: ${this.state.marginLeftImg}px; width: ${this.state.widthImg}px; height:${this.state.heightImg}px" src="${uri}">
                      <div style="padding: 0 4%;font-size: 14px; font-family: 'Roboto'; text-align: justify ;margin-top: 20px;">
                            ${ this.state.currentArtist.viDescription}
                      </div>
                  </div>`

                : `<div  style= "overflow-x: hidden;padding-top: 20px">
                      <div style="margin-left: ${this.state.marginLeftImg}px;width: ${this.state.widthImg}px; height:${this.state.heightImg}px">
                        <div class="crop" style=" position: relative; overflow: hidden;width: 60%;padding-bottom: 80%;margin-bottom: 15px;">
                          <img alt="" style="position: absolute;left: -100%;right: -100%;width: 100%;" src="${uri}">
                        </div>
                      </div>

                      <div style="padding: 0 4%;font-size: 14px;font-family: 'Roboto';text-align: justify ;margin-top: 20px;">
                            ${ this.state.currentArtist.enDescription}
                      </div>
                  </div>`
              }} />
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
)(ArtistDetail);

const styles = StyleSheet.create({
  containerRow: {
    flexDirection: "column",
    width: "100%",
    flex: 1,
    paddingBottom: 70
  },
  centerImage: {
    width: "100%",
    marginLeft: "20%",
    height: widthPercentageToDP("75%"),
    marginTop: 30,
    marginBottom: 25
  },
  styleWebView: {
    width: "100%",
    minHeight: 500,
    paddingVertical: "4%"
  },
  title: {
    width: "90%",
    fontSize: 15,
    paddingLeft: "5%",
    color: "#0882b0",
    textAlign: "justify",
    marginTop: "-1%",
    fontWeight: "900"
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
  displayNone: {
    height: 0,
    opacity: 0
  },
  displayBlock: {
    height: 30,
    opacity: 1
  }
});
