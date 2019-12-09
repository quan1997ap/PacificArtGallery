import React, { Component } from "react";
import {
  Text,
  View,
  Image,
  Button,
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
import HeaderComponent from "../../../../../components/HeaderComponent";
import LoadingComponent from "../../../../../components/LoadingComponent";

// translate connect subcribe language change
import I18n from "../../../../../translations/i18n";
import { connect } from "react-redux";

import { rootPath , heightHeader } from "../../../../../config/enviroment";

class ColectionDetail {
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

class CollectionDetail extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      arrCollection: [],
      errLoadData: false,
      collectionId: "",
      itemNameViCollection: "",
      itemNameEnCollection: "",
      itemNameViNote: "",
      itemNameEnNote:"",
      pageIndex: 0,
      isLoading: true
    };
  }

  _renderFooter() {
    return <LoadingComponent Visible={this.state.isLoading} />;
  }
  
  _getCollectionDetailWithId(colectionId, _pageindex) {
    let arrColectionDetailTg = [];
    nextNumberItem = _pageindex * 6;
    axios
      .get(
        `${rootPath}dspace/rest/items/search?policies=public&filter_field_1=collectionID&filter_type_1=equals&filter_value_1=${colectionId}&rpp=6&start=${nextNumberItem}&location=d41afc56-0830-4a73-aed2-29334bf9499b`
      )
      .then(response => {
        // map & convert data  : chỉ lấy các thuộc tính cần thiết
        let responseColectionDetail = JSON.parse(JSON.stringify(response));

        if (
          responseColectionDetail.data &&
          responseColectionDetail.data.length > 0 &&
          responseColectionDetail.data[0].listItems.length > 0
        ) {
          // create object collectionItem
          let listCollectionDetail = responseColectionDetail.data[0].listItems;

          listCollectionDetail.forEach(collectionItem => {
            let _infoColectionDetail = new ColectionDetail();

            _infoColectionDetail._id = collectionItem.uuid; //id
            _infoColectionDetail.thumbnail = collectionItem.thumbnail; // link img

            collectionItem.metadata.forEach(colectionDetail => {
              if (colectionDetail.key == true || colectionDetail.key == false) {
                if (
                  colectionDetail.element == "author" &&
                  colectionDetail.language == "vi"
                ) {
                  _infoColectionDetail.authorNameVi = colectionDetail.value;
                } else if (
                  colectionDetail.element == "author" &&
                  colectionDetail.language == "en"
                ) {
                  _infoColectionDetail.authorNameEn = colectionDetail.value;
                } else if (
                  colectionDetail.element == "title" &&
                  colectionDetail.language == "vi"
                ) {
                  _infoColectionDetail.titleVi = colectionDetail.value;
                } else if (
                  colectionDetail.element == "title" &&
                  colectionDetail.language == "en"
                ) {
                  _infoColectionDetail.titleEn = colectionDetail.value;
                } else if (
                  colectionDetail.qualifier == "material" &&
                  colectionDetail.language == "vi"
                ) {
                  _infoColectionDetail.materialVi = colectionDetail.value;
                } else if (
                  colectionDetail.qualifier == "material" &&
                  colectionDetail.language == "en"
                ) {
                  _infoColectionDetail.materialEn = colectionDetail.value;
                }
              } else {
                if (
                  colectionDetail.key == "art.author" &&
                  colectionDetail.language == "vi"
                ) {
                  _infoColectionDetail.authorNameVi = colectionDetail.value;
                } else if (
                  colectionDetail.key == "art.author" &&
                  colectionDetail.language == "en"
                ) {
                  _infoColectionDetail.authorNameEn = colectionDetail.value;
                } else if (
                  colectionDetail.key == "art.title" &&
                  colectionDetail.language == "vi"
                ) {
                  _infoColectionDetail.titleVi = colectionDetail.value;
                } else if (
                  colectionDetail.key == "art.title" &&
                  colectionDetail.language == "en"
                ) {
                  _infoColectionDetail.titleEn = colectionDetail.value;
                } else if (
                  colectionDetail.key == "art.type.material" &&
                  colectionDetail.language == "vi"
                ) {
                  _infoColectionDetail.materialVi = colectionDetail.value;
                } else if (
                  colectionDetail.key == "art.type.material" &&
                  colectionDetail.language == "en"
                ) {
                  _infoColectionDetail.materialEn = colectionDetail.value;
                }
              }
            });

            arrColectionDetailTg.push(_infoColectionDetail);
          });
        }
        else{
          // end list
          this.setState({ isLoading: false });
        }
      })
      .then(() => {
        // load more
        if (this.state.pageIndex == 0) {
          this.setState({ pageIndex: _pageindex + 1 }); // increase page index
          this.setState({ arrCollection: arrColectionDetailTg }, () =>{}
     
          );
        } else if (this.state.pageIndex >= 1) {
          // Tăng pageIndex => Tải dữ liệu mới về => gán vao mảng ban đầu
          this.setState({ pageIndex: _pageindex }); // increase page index
          this.setState({
            arrCollection: this.state.arrCollection.concat(arrColectionDetailTg)
          });
        }
        arrColectionDetailTg = [];
      })
      .catch(err => {
        this.setState({ errLoadData: true });
        // console.log(err);
      });
  }

  componentDidMount() {
    // get data for title
    const collectionId = this.props.navigation.getParam(
      "itemIdCollection",
      "NO-ID"
    );
    const itemNameViCollection = this.props.navigation.getParam(
      "itemNameViCollection",
      "NO-Vi-Name"
    );
    const itemNameEnCollection = this.props.navigation.getParam(
      "itemNameEnCollection",
      "NO-En-Name"
    );
    const itemNameViNote = this.props.navigation.getParam(
      "itemNameViNote",
      "NO-Vi-Note"
    );
    const itemNameEnNote = this.props.navigation.getParam(
      "itemNameEnNote",
      "NO-En-Note"
    );

    this.setState({ collectionId: collectionId }, () => {
      this._getCollectionDetailWithId(
        this.state.collectionId,
        this.state.pageIndex
      );
    });

    this.setState({ itemNameViCollection: itemNameViCollection , itemNameEnCollection: itemNameEnCollection });
    this.setState({ itemNameViNote: itemNameViNote, itemNameEnNote: itemNameEnNote });
  }

  _upperCaseTitle(string) {
    return string.toUpperCase();
  }

  render() {
    I18n.locale = this.props.stateCurentLanguage;
    return (
      <View style={{ flex: 1 }}>
        <View style={{ height: heightHeader + 50 , justifyContent: "flex-start" }}>
          <HeaderComponent
            titleName={I18n.t("COLLECTIONTABTOP")}
          />
          <View style={styles.styleCoverTitle}>
            <Text style={[styles.tytleTextTitle]}>
              {this.props.stateCurentLanguage == "vi"
                ? this._upperCaseTitle(this.state.itemNameViCollection)
                : this._upperCaseTitle(this.state.itemNameEnCollection)}
            </Text>
          </View>
        </View>

        <Text style={styles.styleTextNote}>
          {this.props.stateCurentLanguage == "vi" ? this.state.itemNameViNote  : this.state.itemNameEnNote }
        </Text>

        <View style={{ flex: 1 }}>
          {/* <ScrollView contentContainerStyle={styles.contentContainer}> */}
          <FlatList
            style={styles.styleFlatlist}
            data={this.state.arrCollection}
            keyExtractor={item => (item._id + "key")}
            onEndReached={() => {
              this._getCollectionDetailWithId(
                this.state.collectionId,
                this.state.pageIndex + 1
              );
            }}
            onEndReachedThreshold={0.5} // xuong gan day cách đáy 1 khoang = chiều cao 1 phần tử thi load tiep
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
                  <View style={styles.containerRow}>
                    <Image
                      source={{
                        uri: urlImage
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
                          {I18n.t("MEDIUM")} :
                        </Text>{" "}
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
)(CollectionDetail);

const styles = StyleSheet.create({
  contentContainer: {
    backgroundColor: "#fff"
  },
  styleCoverTitle: {
    backgroundColor: "#0882b0",
    height: 50,
    marginBottom: 0
  },
  styleTextNote:{
    paddingHorizontal: "5%",
    paddingVertical: 20,
    textAlign:"center"
  },
  tytleTextTitle: {
    fontWeight: "700",
    flex: 1,
    color: "#fff",
    fontSize: 15,
    paddingTop: 15,
    textAlign: "center"
  },
  containerRow: {
    flex: 1,
    flexDirection: "row"
  },
  styleFlatlist: {
     marginBottom: 0
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
