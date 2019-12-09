import React, { Component } from "react";
import {
  Text,
  View,
  Image,
  FlatList,
  StyleSheet,
  WebView,
  TouchableHighlight,
  TouchableOpacity,
  ScrollView
} from "react-native";
import HeaderComponent from "../../../../components/HeaderComponent";
import axios from "axios";
import {
  widthPercentageToDP,
  heightPercentageToDP
} from "../../../../theme/scale";
import moment from "moment";

// translate connect subcribe language change
import I18n from "../../../../translations/i18n";
import { connect } from "react-redux";
import { rootPath, heightHeader } from "../../../../config/enviroment";
import  LoadingComponent  from "../../../../components/LoadingComponent";

class EventScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      arrCollection: [],
      errLoadData: false,
      isLoading: true
    };
  }

  _getDataEvent() {
    const body = {
      code: "event",
      param: { isactive: true },
      sort: { enddate: -1 }
    };
    axios
      .post(`${rootPath}public/search`, body, {
        headers: { "Content-Type": "application/json" }
      })
      .then(response => {
        let responseListEvent = JSON.parse(JSON.stringify(response));
        // console.log(responseListEvent)
        if (
          responseListEvent &&
          responseListEvent.data.PHHAPI.body.length > 0
        ) {
          this.setState({ errLoadData: false });
          this.setState(
            { arrCollection: responseListEvent.data.PHHAPI.body },
            () => {
              this.setState({ isLoading: false });
              // console.log(this.state.arrCollection);
            }
          );
        }
      })
      .catch(err => {
        this.setState({ errLoadData: true });
        console.log(err);
      });
  }

  _parseMisecond(lang, numberOfMilisecond) {
    if (lang == "en") {
      return moment(numberOfMilisecond, "x").format("MMM - DD");
    } else if (lang == "vi") {
      return moment(numberOfMilisecond, "x").format("DD - MM");
    }
  }

  componentDidMount() {
    this._getDataEvent();
  }

  _renderFooter() {
    return <LoadingComponent Visible={this.state.isLoading} />;
  }

  render() {
    I18n.locale = this.props.stateCurentLanguage;
    const INJECTEDJAVASCRIPT = `const meta = document.createElement('meta'); meta.setAttribute('content', 'width=device-width, initial-scale=1 maximum-scale=1, user-scalable=0'); meta.setAttribute('name', 'viewport'); document.getElementsByTagName('head')[0].appendChild(meta); `;

    return (
      <View style={{ flex: 1 }}>
        <View style={{ height: heightHeader }}>
          <HeaderComponent
            hiddenButtonBack={true}
            titleName={I18n.t("EVENTS")}
          />
        </View>

        <View style={{ flex: 1 }}>
          <ScrollView
            contentContainerStyle={[styles.contentContainer, { flex: 0.9 }]}
          >
            <FlatList
              style={styles.styleFlatlist}
              data={this.state.arrCollection}
              keyExtractor={item => item._id}
              extraData={this.props.stateCurentLanguage}
              renderItem={({ item, index }) => {
                let urlimage =
                  `${rootPath}download?folder=event&file=` + item.image;

                return (
                  <TouchableHighlight
                    style={{
                      paddingHorizontal: "5%",
                      paddingVertical: "7%",
                      backgroundColor: index % 2 == 0 ? "#fff" : "#f5f5f5"
                    }}
                    underlayColor="#fcfcfc"
                    onPress={() => {
                      this.props.navigation.navigate("EventDetail", {
                        eventID: item._id
                      });
                    }}
                  >
                    <View style={styles.containerRow}>
                      <Image
                        source={{ uri: urlimage }}
                        style={styles.newsImage}
                      />
                      <View style={styles.coverInfo}>
                        <Text style={[styles.title, {}]}>
                          {this.props.stateCurentLanguage == "vi"
                            ? item.vi.name
                            : item.en.name}
                        </Text>

                        <Text style={styles.subTitleDate}>
                          {this.props.stateCurentLanguage == "vi"
                            ? this._parseMisecond("vi", item.begindate)
                            : this._parseMisecond("en", item.begindate)}
                          <Text
                            style={{
                              color: "#333",
                              fontFamily: 'Roboto',
                              fontSize: 12,
                              fontWeight: "200"
                            }}
                          >
                            {" "}
                            {this.props.stateCurentLanguage == "vi"
                              ? " đến "
                              : " to "}{" "}
                          </Text>
                          {this.props.stateCurentLanguage == "vi"
                            ? this._parseMisecond("vi", item.enddate)
                            : this._parseMisecond("en", item.enddate)}
                        </Text>

                        <Text style={styles.subTitleTime}>
                          {item.begintime} - {item.endtime}
                        </Text>

                        {/* <WebView
                          javaScriptEnabled={true}
                          scalesPageToFit={true}
                          scrollEnabled={false}
                          injectedJavaScript={INJECTEDJAVASCRIPT}
                          style={[styles.subTitleSummary, {backgroundColor: index % 2 == 0 ? "#fff" : "#f5f5f5"}]}
                            source={{
                              html: this.props.stateCurentLanguage == "vi" 
                                ? `<p style="text-align: justify;margin-left: -2%;font-size: 14px ; line-height: 20px; color: #333333; height: 50px;" >${item.vi.address}</p>`
                                : `<p style="text-align: justify;margin-left: -2%;font-size: 14px ; line-height: 20px; color: #333333; height: 50px;" >${item.en.address}</p>`,
                              baseUrl: ""
                            }}
                        /> */}
                          
                        <Text style={styles.subTitleSummaryText}>
                          {this.props.stateCurentLanguage == "vi" ? item.vi.summary : item.en.summary }
                        </Text>

                      </View>

                    </View>
                  </TouchableHighlight>
                );
              }}
              ListFooterComponent={this._renderFooter.bind(this)}
            />
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
)(EventScreen);

const styles = StyleSheet.create({
  contentContainer: {
    backgroundColor: "#fff",
    flex: 1
  },
  containerRow: {
    flex: 1,
    flexDirection: "column"
  },
  styleFlatlist: {
    paddingBottom: 0
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
    width: "90%",
    fontFamily: 'Roboto-Bold',
    fontSize: 16,
    color: "#0882b0",
    marginTop: "3%",
    marginBottom: "2%",
    fontWeight: "bold",
    lineHeight: 25
  },
  subTitleTime: {
    width: "90%",
    fontFamily: 'Roboto',
    fontSize: 13,
    color: "#999",
    marginBottom: 10,
    marginTop: 7,
    textAlign: "justify"
  },
  subTitleDate: {
    width: "90%",
    fontSize: 18,
    fontFamily: 'Roboto',
    color: "#b89d54",
    marginBottom: 5,
    fontWeight: "900"
  },
  subTitleSummaryText: {
    width: "100%",
    color: "#333",
    fontSize: 14,
    textAlign: 'justify',
    lineHeight: 25,
    fontFamily: 'Roboto'
  },
  subTitleSummary: {
    width: "100%",
    height: 80,
  }
});
