import React from "react";
import {
  Text,
  View,
  Image,
  Button,
  Alert,
  FlatList,
  StyleSheet,
  ScrollView,
  TouchableHighlight
} from "react-native";
import axios from "axios";
import {
  widthPercentageToDP,
  heightPercentageToDP
} from "../../../../../theme/scale";
import LoadingComponent from "../../../../../components/LoadingComponent";

// translate connect subcribe language change
import I18n from "../../../../../translations/i18n";
import { connect } from "react-redux";
import { rootPath, heightHeader } from "../../../../../config/enviroment";


class HotItem {
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

class FeatureTabHeader extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      arrHotItem: [],
      errLoadData: false,
      language: "",
      pageIndex: 0,
      isLoading: true
    };
  }

  
  _getDataFeature(_pageindex) {
  // this.setState({isLoading : true});
    if (this.state.isLoading == true) {
      let arrHotItemTg = [];
      nextNumberItem = _pageindex * 6;
      axios
        .get(
          `${rootPath}dspace/rest/items/search?policies=public&filter_field_1=HotItem&filter_type_1=equals&filter_value_1=1&rpp=6&start=${nextNumberItem}&location=d41afc56-0830-4a73-aed2-29334bf9499b&sort_by=art.order_sort&order=asc`
        )
        .then(response => {
          // console.log(response);
          // map & convert data  : chỉ lấy các thuộc tính cần thiết
          let responseListHotItem = JSON.parse(JSON.stringify(response));

          if (
            responseListHotItem.data &&
            responseListHotItem.data.length > 0 &&
            responseListHotItem.data[0].listItems.length > 0
          ) {
            // create object hotItem
            let listHotItem = responseListHotItem.data[0].listItems;
            listHotItem.forEach(hotItem => {
              let _infoHotItem = new HotItem();

              _infoHotItem._id = hotItem.uuid;
              _infoHotItem.thumbnail = hotItem.thumbnail; // link img

              hotItem.metadata.forEach(hotItemInfoDetail => {
                if (
                  hotItemInfoDetail.key == true ||
                  hotItemInfoDetail.key == false
                ) {
                  if (
                    hotItemInfoDetail.element == "author" &&
                    hotItemInfoDetail.language == "vi"
                  ) {
                    _infoHotItem.authorNameVi = hotItemInfoDetail.value;
                  } else if (
                    hotItemInfoDetail.element == "author" &&
                    hotItemInfoDetail.language == "en"
                  ) {
                    _infoHotItem.authorNameEn = hotItemInfoDetail.value;
                  } else if (
                    hotItemInfoDetail.element == "title" &&
                    hotItemInfoDetail.language == "vi"
                  ) {
                    _infoHotItem.titleVi = hotItemInfoDetail.value;
                  } else if (
                    hotItemInfoDetail.element == "title" &&
                    hotItemInfoDetail.language == "en"
                  ) {
                    _infoHotItem.titleEn = hotItemInfoDetail.value;
                  } else if (
                    hotItemInfoDetail.qualifier == "material" &&
                    hotItemInfoDetail.language == "vi"
                  ) {
                    _infoHotItem.materialVi = hotItemInfoDetail.value;
                  } else if (
                    hotItemInfoDetail.qualifier == "material" &&
                    hotItemInfoDetail.language == "en"
                  ) {
                    _infoHotItem.materialEn = hotItemInfoDetail.value;
                  }
                } else {
                  if (
                    hotItemInfoDetail.key == "art.author" &&
                    hotItemInfoDetail.language == "vi"
                  ) {
                    _infoHotItem.authorNameVi = hotItemInfoDetail.value;
                  } else if (
                    hotItemInfoDetail.key == "art.author" &&
                    hotItemInfoDetail.language == "en"
                  ) {
                    _infoHotItem.authorNameEn = hotItemInfoDetail.value;
                  } else if (
                    hotItemInfoDetail.key == "art.title" &&
                    hotItemInfoDetail.language == "vi"
                  ) {
                    _infoHotItem.titleVi = hotItemInfoDetail.value;
                  } else if (
                    hotItemInfoDetail.key == "art.title" &&
                    hotItemInfoDetail.language == "en"
                  ) {
                    _infoHotItem.titleEn = hotItemInfoDetail.value;
                  } else if (
                    hotItemInfoDetail.key == "art.type.material" &&
                    hotItemInfoDetail.language == "vi"
                  ) {
                    _infoHotItem.materialVi = hotItemInfoDetail.value;
                  } else if (
                    hotItemInfoDetail.key == "art.type.material" &&
                    hotItemInfoDetail.language == "en"
                  ) {
                    _infoHotItem.materialEn = hotItemInfoDetail.value;
                  }
                }
              });
              arrHotItemTg.push(_infoHotItem);
            });

            // load more
            if (this.state.pageIndex == 0) {
              this.setState({ pageIndex: _pageindex }, () => {});
              this.setState({ arrHotItem: arrHotItemTg }, () => {
                //console.log(this.state.arrHotItem);
              });
            } else if (this.state.pageIndex >= 1) {
              // Tăng pageIndex => Tải dữ liệu mới về => gán vao mảng ban đầu
              this.setState({ pageIndex: _pageindex }); // increase page index
              this.setState({
                arrHotItem: this.state.arrHotItem.concat(arrHotItemTg)
              });
            }
          
            arrHotItemTg = [];
          } else {
         
            this.setState({isLoading : false});
          }
        })
        .catch(err => {
          this.setState({ errLoadData: true });
          // console.log(err);
        });
    } else {
    }
  }

  componentDidMount() {
    this._getDataFeature(this.state.pageIndex + 1);
  }

  _showPopUpEndList() {
    Alert.alert(I18n.t("ENDOFLIST"));
  }

  _renderFooter() {
    return (
      <LoadingComponent Visible={this.state.isLoading} />
    );
  }


  render() {
    I18n.locale = this.props.stateCurentLanguage;
    return (
      <ScrollView contentContainerStyle={styles.contentContainer}>
        <FlatList
          style={styles.styleFlatlist}
          data={this.state.arrHotItem}
          keyExtractor={item => item._id + "key"}
          onEndReached={() => {
            this._getDataFeature(this.state.pageIndex + 1);
          }}
          onEndReachedThreshold={1} // xuong gan day cách đáy 1 khoang = chiều cao 1 phần tử thi load tiep
          extraData={this.props.stateCurentLanguage}
          renderItem={({ item, index }) => {
            let urlImage = "https://pacificartgallery.com" + item.thumbnail;

            return (
              <TouchableHighlight
                underlayColor="#fcfcfc"
                onPress={() => {
                  this.props.navigation.navigate("IteamDetail", {
                    itemID: item._id
                  });
                }}
                style={{
                  paddingHorizontal: "5%",
                  paddingVertical: "4%",
                  backgroundColor: index % 2 == 0 ? "#fff" : "#f5f5f5"
                }}
              >
                <View
                  style={[
                    styles.containerRow
                  ]}
                >
                  <Image
                    source={{
                      uri: urlImage,
                      cache: 'force-cache',
                    }}
                    style={styles.leftImage}
                  />
                  <View style={styles.rightInfo}>
                    <Text style={[styles.title]}>
                      {this.props.stateCurentLanguage == "vi"
                        ? item.titleVi
                        : item.titleEn}
                    </Text>
                    <Text style={[styles.subTitleDate]}>
                      {this.props.stateCurentLanguage == "vi"
                        ? item.authorNameVi
                        : item.authorNameEn}
                    </Text>
                    <Text style={styles.subTitleSummary}>
                      <Text style={{ color: "#999" }}>
                        {I18n.t("MEDIUM")}<Text> : </Text>
                      </Text>
                      {this.props.stateCurentLanguage == "vi"
                        ? item.materialVi
                        : item.materialEn}{" "}
                    </Text>
                  </View>
                </View>
              </TouchableHighlight>
            );
          }}
          ListFooterComponent={this._renderFooter.bind(this)}
        />
       
      </ScrollView>
      // </View>
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
)(FeatureTabHeader);

const styles = StyleSheet.create({
  contentContainer: {
    backgroundColor: "#fff",
    flex: 1
  },
  containerRow: {
    flex: 1,
    flexDirection: "row"
  },
  styleFlatlist: {
    //paddingBottom: 60,
    // marginBottom: 50
  },
  left: {
    width: widthPercentageToDP("30%")
  },
  leftImage: {
    width: widthPercentageToDP("27%"),
    height: widthPercentageToDP("27%"),
    paddingTop: "1%"
  },
  rightInfo: {
    width: widthPercentageToDP("69%"),
    alignContent: "flex-start"
  },
  title: {
    width: "90%",
    fontSize: 16,
    fontFamily: 'Roboto-Bold',
    paddingLeft: "5%",
    color: "#0882b0",
    fontWeight: "900",
    textAlign: "justify",
    marginTop: "-1%"
  },
  subTitleDate: {
    width: "90%",
    fontSize: 13,
    color: "#b89d54",
    paddingLeft: "5%",
    textAlign: "justify",
    marginVertical: 5
  },
  subTitleSummary: {
    width: "90%",
    fontSize: 13,
    color: "#333",
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
