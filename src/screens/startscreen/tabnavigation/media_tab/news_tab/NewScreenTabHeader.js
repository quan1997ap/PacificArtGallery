import React, { Component } from "react";
import {
  Text,
  View,
  Image,
  Button,
  Alert,
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
import { rootPath, heightHeader } from "../../../../../config/enviroment";
import Spinner from "react-native-loading-spinner-overlay";
import Dimensions from "Dimensions";
import LoadingComponent from "../../../../../components/LoadingComponent";
// translate connect subcribe language change
import I18n from "../../../../../translations/i18n";
import { connect } from "react-redux";


class NewsScreenTabHeader extends React.Component {
 
  constructor(props) {
    super(props);
    this.state = {
      listNew: [],
      errLoadData: false,
      spinner: false,
      isLoading: true,
      htmlContent: '<h1>Hello World</h1><p>HTML Content</p>'
    };
    this.viewabilityConfig = {
      waitForInteraction: true
    }
  }


  // lay danh sach tin tuc
  _getListNew() {
    arrNews=[]
    body = {
      code: "newsnocontent",
      param: { isactive: true, type: "0" },
      sort: { createddate: -1 },
      pagesize: "10",
      pageindex: "1"
    };
    axios
      .post(`${rootPath}public/search`, body, {
        headers: { "Content-Type": "application/json" }
      })
      .then(newsResponse => {
        if (newsResponse && newsResponse.data.PHHAPI.body.length > 0) {
          this.setState({ listNew: arrNews.concat(newsResponse.data.PHHAPI.body) }, () => {
            this.setState({ isLoading: false })
          });
        }
      })
      .catch(err => {
        this.setState({ errLoadData: true });
        // console.log(err);
      });
  }

  // them dau ... vao summary
  _subSummaryNew(string) {
    if (string != undefined) {
      if (string.length > 200) {
        return string.slice(0, 200) + "...";
      } else {
        return string;
      }
    }
    else{
      return "...";
    }
  }

  _renderFooter() {
    return <LoadingComponent Visible={this.state.isLoading} />;
  }

  componentDidMount() {
    this._getListNew();
  }

  _renderItem(item,index,urlimage){
    const INJECTEDJAVASCRIPT = `const meta = document.createElement('meta'); meta.setAttribute('content', 'width=device-width, initial-scale=1 maximum-scale=1, user-scalable=0'); meta.setAttribute('name', 'viewport'); document.getElementsByTagName('head')[0].appendChild(meta); `;
    if (item != undefined){
      return(
        <TouchableHighlight
        style={{
          paddingHorizontal: "5%",
          paddingVertical: "7%",
          backgroundColor: index % 2 == 0 ? "#fff" : "#f5f5f5",
          // flex: index <= 1 ? 0 : 1,
        }}
        underlayColor="#fcfcfc"
        onPress={() => {
          this.props.navigation.navigate("NewsDetail", {newsId: item._id});
        }}
      >
        <View style={styles.containerRow}>
          <Image source={{ uri: urlimage }} style={styles.newsImage} />
          <View style={styles.coverInfo}>
            <Text style={[styles.title]}>
              {this.props.stateCurentLanguage == "vi"
                ? item.vi.title
                : item.en.title}
            </Text>
  
            <Text style={styles.subTitleSummaryText}>
              {this.props.stateCurentLanguage == "vi"
                ? this._subSummaryNew(item.vi.summary)
                : this._subSummaryNew(item.en.summary)}
            </Text>
  
            {/* <WebView
              javaScriptEnabled={true}
              scalesPageToFit={true}
              scrollEnabled={false}
              injectedJavaScript={INJECTEDJAVASCRIPT}
              style={[styles.subTitleSummary, { backgroundColor: index % 2 == 0 ? "#fff" : "#f5f5f5"}]}
                source={{
                  html: this.props.stateCurentLanguage == "vi" 
                    ? `<p style="text-align: justify;font-size: 14px ; line-height: 20px; color: #333333; height: 70px;margin-left: -2%" >${item.vi.summary}</p>`
                    : `<p style="text-align: justify;font-size: 14px ; line-height: 20px;color: #333333; height: 70px;margin-left: -2%" >${item.en.summary}</p>`,
                  baseUrl: ""
                }}
            /> */}
            
          </View>
        </View>
      </TouchableHighlight>
      )
    }
  }

  render() {
    I18n.locale = this.props.stateCurentLanguage;

    return (
      <ScrollView contentContainerStyle={styles.contentContainer}>
        <Spinner
          visible={this.state.spinner}
          textStyle={styles.spinnerTextStyle}
        />
        <FlatList
          viewabilityConfig={this.viewabilityConfig}
          minimumViewTime={1000}
          data={this.state.listNew}
          style={styles.styleFlatlist}
          keyExtractor={item => item._id + "key"}
          extraData={this.props.stateCurentLanguage}
          removeClippedSubviews={false}
          renderItem={({ item, index }) => {
            let urlimage = `${rootPath}download?folder=news&file=` + item.image;
            return (
              this._renderItem(item,index,urlimage)
            )
          }}
          ListFooterComponent={this._renderFooter.bind(this)}
        />
      </ScrollView>
    );
  }
}

// translate connect subscribe language change
const mapStateToProps = state => {
  return {
    stateCurentLanguage: state.stateCurentLanguage
  };
};

export default connect(
  mapStateToProps,
  null
)(NewsScreenTabHeader);

const styles = StyleSheet.create({
  contentContainer: {
    backgroundColor: "#fff",
    flex:1
  },
  containerRow: {
    flexDirection: "column"
  },
  styleFlatlist: {
    paddingBottom: 60
  },
  newsImage: {
    width: "100%",
    height: widthPercentageToDP("60%")
  },
  coverInfo: {
    width: "100%",
    flexDirection: "column"
  },
  title: {
    width: "100%",
    fontSize: 15,
    color: "#0882b0",
    textAlign: "justify",
    marginTop: "3%",
    marginBottom: "2%",
    fontWeight: "bold",
    lineHeight: 25
  },
  subTitleDate: {
    width: "100%",
    fontSize: 13,
    color: "#b89d54",
    textAlign: "justify"
  },
  subTitleSummaryText: {
    width: "100%",
    fontSize: 13,
    color: "#333333",
    textAlign: "justify",
    lineHeight: 25
  },
  subTitleSummary: {
    width: "95%",
    height: 150
  },
});
