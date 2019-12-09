import React, { Component } from "react";
import WebViewAutoHeight from 'react-native-webview-autoheight';
import {
  Text,
  View,
  Image,
  Button,
  FlatList,
  WebView,
  StyleSheet,
  TouchableHighlight,
  ScrollView, Platform
} from "react-native";
import axios from "axios";
import {
  widthPercentageToDP,
  heightPercentageToDP
} from "../../../../../theme/scale";
import HeaderComponent from "../../../../../components/HeaderComponent";
// translate connect subcribe language change
import I18n from "../../../../../translations/i18n";
import { connect } from "react-redux";
import { rootPath, heightHeader } from "../../../../../config/enviroment";
import LoadingComponent from "../../../../../components/LoadingComponent";


class ItemDetailClass {
  constructor() {
    this._id = "";
    this.authorNameVi = "";
    this.authorNameEn = "";
    this.titleVi = "";
    this.titleEn = "";
    (this.materialVi = ""), (this.materialEn = "");
    this.thumbnail = "";
    this.issued = "";
    this.descriptionAbstractEn = "",
      this.descriptionAbstractVi = ""
  }
}

class ItemDetail extends React.Component {
  static navigationOptions = ({ navigation }) => {
    return {
      title: "Detail item"
    };
  };

  constructor(props) {
    super(props);
    this.state = {
      currentItem: {},
      errLoadData: false,
      isLoading: true
    };
  }

  _getItemDetailWithId(itemId) {
    let currentItem = new ItemDetailClass();
    axios
      .get(
        `${rootPath}dspace/rest/items/${itemId}?expand=metadata,prevnext`
      )
      .then(response => {
        // map & convert data  : chỉ lấy các thuộc tính cần thiết
        let itemDetail = JSON.parse(JSON.stringify(response));

        if (itemDetail.data) {
          // create object CurrentItem
          currentItem._id = itemDetail.data.uuid; // id
          currentItem.thumbnail = itemDetail.data.thumbnail; // link img

          itemDetail.data.metadata.forEach(currentItemDetail => {
            if (
              currentItemDetail.key == true ||
              currentItemDetail.key == false
            ) {
              if (
                currentItemDetail.element == "author" &&
                currentItemDetail.language == "vi"
              ) {
                currentItem.authorNameVi = currentItemDetail.value;
              } else if (
                currentItemDetail.element == "author" &&
                currentItemDetail.language == "en"
              ) {
                currentItem.authorNameEn = currentItemDetail.value;
              } else if (
                currentItemDetail.element == "title" &&
                currentItemDetail.language == "vi"
              ) {
                currentItem.titleVi = currentItemDetail.value;
              } else if (
                currentItemDetail.element == "title" &&
                currentItemDetail.language == "en"
              ) {
                currentItem.titleEn = currentItemDetail.value;
              } else if (
                currentItemDetail.qualifier == "material" &&
                currentItemDetail.language == "vi"
              ) {
                currentItem.materialVi = currentItemDetail.value;
              } else if (
                currentItemDetail.qualifier == "material" &&
                currentItemDetail.language == "en"
              ) {
                currentItem.materialEn = currentItemDetail.value;
              }
            } else {
              if (
                currentItemDetail.key == "art.author" &&
                currentItemDetail.language == "vi"
              ) {
                currentItem.authorNameVi = currentItemDetail.value;
              } else if (
                currentItemDetail.key == "art.author" &&
                currentItemDetail.language == "en"
              ) {
                currentItem.authorNameEn = currentItemDetail.value;
              } else if (
                currentItemDetail.key == "art.title" &&
                currentItemDetail.language == "vi"
              ) {
                currentItem.titleVi = currentItemDetail.value;
              } else if (
                currentItemDetail.key == "art.title" &&
                currentItemDetail.language == "en"
              ) {
                currentItem.titleEn = currentItemDetail.value;
              } else if (
                currentItemDetail.key == "art.type.material" &&
                currentItemDetail.language == "vi"
              ) {
                currentItem.materialVi = currentItemDetail.value;
              } else if (
                currentItemDetail.key == "art.type.material" &&
                currentItemDetail.language == "en"
              ) {
                currentItem.materialEn = currentItemDetail.value;
              } else if (
                currentItemDetail.key == "art.date.issued" &&
                currentItemDetail.language == "vi"
              ) {
                currentItem.issued = currentItemDetail.value;
              } else if (
                currentItemDetail.key == "art.description.abstract" &&
                currentItemDetail.language == "vi"
              ) {
                currentItem.descriptionAbstractVi = currentItemDetail.value;
              } else if (
                currentItemDetail.key == "art.description.abstract" &&
                currentItemDetail.language == "en"
              ) {
                currentItem.descriptionAbstractEn = currentItemDetail.value;
              }
            }
          });
        }
      })
      .then(() => {
        // save data to state
        this.setState({ currentItem: currentItem }, () => {
          this.setState({isLoading : false})
        });
      })
      .catch(err => {
        this.setState({ errLoadData: true });
        // console.log(err);
      });
  }

  _renderDescription() {
    // text justify
    // const INJECTEDJAVASCRIPT = `const meta = document.createElement('meta'); meta.setAttribute('content', 'width=device-width, initial-scale=1 maximum-scale=1, user-scalable=0'); meta.setAttribute('name', 'viewport'); document.getElementsByTagName('head')[0].appendChild(meta); `;
    // if (Platform.OS === 'ios' && this.state.currentItem != undefined) {
    //   return (
    //     <Text style={styles.subTitleSummary}>
    //       <Text style={{ color: "#999" }}>{I18n.t("DESCRIPTION")} :</Text>{" "}
    //       {this.props.stateCurentLanguage == "vi"
    //         ? this.state.currentItem.descriptionAbstractVi
    //         : this.state.currentItem.descriptionAbstractEn}
    //     </Text>
        
    //   )
    // }
    // else {
    //   return (
    //     <WebView
    //       originWhitelist={["*"]}
    //       javaScriptEnabled={true}
    //       scalesPageToFit={true}
    //       scrollEnabled={false}
    //       style={[styles.subSummary]}
    //       injectedJavaScript={INJECTEDJAVASCRIPT}
    //       source={{
    //         html: this.props.stateCurentLanguage == "vi" && this.state.currentItem.descriptionAbstractVi != undefined && this.state.currentItem.descriptionAbstractEn != undefined
    //           ? `<p style="text-align: justify; font-size: 13px;height: 250px; line-height: 25px !important; color: #333 ; overflow: hidden"> <span style="color: #999;line-height: 25px"> ${I18n.t("DESCRIPTION")} </span>: ${this.state.currentItem.descriptionAbstractVi} </p>`
    //           : `<p style="text-align: justify; font-size: 13px;height: 250px; line-height: 25px !important; color: #333 ; overflow: hidden"> <span style="color: #999; line-height: 25px"> ${I18n.t("DESCRIPTION")} </span>: ${this.state.currentItem.descriptionAbstractEn}</p>`,
    //         baseUrl: ""
    //       }}
    //     />
    //   )
    // }

    const customStyle = "<style>* {max-width: 100%; font-family: 'Roboto'; font-size: 14px; text-align: justify!important;} html{ margin-left: 5%; margin-right: 5%;} body{ margin:0 } </style>";
      return (
        <WebViewAutoHeight 
            defaultHeight={100}
            scalesPageToFit={ Platform.OS == 'ios' ? false : true}
            source={{html: customStyle + 
            '<span style="color: #999;">'+ I18n.t("DESCRIPTION") +' : </span>' + 
            (this.props.stateCurentLanguage == "vi" ? this.state.currentItem.descriptionAbstractVi : this.state.currentItem.descriptionAbstractEn)
            }} />
                
      )
  }

  componentDidMount() {
    const itemID = this.props.navigation.getParam("itemID", "NO-ID");
    if (itemID != "null" && itemID != "NO-ID") {
      this._getItemDetailWithId(itemID);
    }
  }


  render() {
    I18n.locale = this.props.stateCurentLanguage;
    const INJECTEDJAVASCRIPT = `const meta = document.createElement('meta'); meta.setAttribute('content', 'width=device-width, initial-scale=1 maximum-scale=1, user-scalable=0'); meta.setAttribute('name', 'viewport'); document.getElementsByTagName('head')[0].appendChild(meta); `;
    return (
      <View style={{ flex: 1 }}>
        <View style={{ height: heightHeader }}>
          <HeaderComponent
            titleName={I18n.t("DETAILITEAM")}
          />
        </View>

        <View style={{ flex: 1 }}>
          <View style={{ height: this.state.isLoading ? 100 : 0 }}>
            <LoadingComponent Visible={this.state.isLoading} />
          </View>
          <ScrollView style={styles.scrollView}>
            <Image
              source={{
                uri:
                  "https://pacificartgallery.com" +
                  this.state.currentItem.thumbnail
              }}
              style={styles.centerImage}
            />

            <Text style={[styles.title, { marginTop: "2%" }]}>
              {this.props.stateCurentLanguage == "vi"
                ? this.state.currentItem.titleVi
                : this.state.currentItem.titleEn}
            </Text>

            <Text style={styles.subTitleSummary}>
              <Text style={{ color: "#999" }}>{I18n.t("AUTHOR")} :</Text>{" "}
              {this.props.stateCurentLanguage == "vi"
                ? this.state.currentItem.authorNameVi
                : this.state.currentItem.authorNameEn}
            </Text>

            <Text style={styles.subTitleSummary}>
              <Text style={{ color: "#999" }}>{I18n.t("MEDIUM")} :</Text>{" "}
              {this.props.stateCurentLanguage == "vi"
                ? this.state.currentItem.materialVi
                : this.state.currentItem.materialEn}
            </Text>
            <Text style={styles.subTitleSummary}>
              <Text style={{ color: "#999" }}>{I18n.t("DATEISSUED")} :</Text>{" "}
              {this.state.currentItem.issued}
            </Text>

            {this._renderDescription()}

            <Text style={{ marginBottom: 50 }} > </Text>

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
)(ItemDetail);

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
    backgroundColor: "#fff",
    width: "100%",
    flexDirection: "column",
  },
  containerRow: {
    flexDirection: "column",
    width: "100%",
    flex: 1
  },
  centerImage: {
    height: widthPercentageToDP('60%'),
    width: widthPercentageToDP('90%'),
    marginLeft: "5%",
    marginTop: "3%",
    marginBottom: 15
  },
  title: {
    width: "90%",
    fontSize: 15,
    paddingLeft: "5%",
    color: "#0882b0",
    textAlign: "justify",
    fontWeight: "900",
    fontWeight: "bold",
    lineHeight: 30
  },
  subTitleDate: {
    width: "100%",
    fontSize: 13,
    color: "#b89d54",
    paddingLeft: "5%",
    textAlign: "justify",
    marginVertical: "2%"
  },
  subTitleSummary: {
    width: "96%",
    fontSize: 13,
    color: "#333333",
    lineHeight: 25,
    paddingLeft: "5%",
    marginVertical: "2%",
  },
  subSummary: {
    width: "93%",
    marginLeft: "3%",
    marginVertical: "2%",
    height: 300
  }
  ,
  displayNone: {
    height: 0,
    opacity: 0
  },
  displayBlock: {
    height: 30,
    opacity: 1
  }
});
