// https://medium.com/@luisbajana/treating-the-picker-component-dynamically-2b8d8946f9fa
import React, { Component } from "react";
import SelectInput from 'react-native-select-input-ios';
import {
  Text,
  View,
  Image,
  Button,
  FlatList,
  StyleSheet,
  TouchableHighlight,
  ImageBackground,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  Alert,
  Platform
} from "react-native";
import Spinner from 'react-native-loading-spinner-overlay';
import LoadingComponent from "../../../../components/LoadingComponent";
import { Keyboard } from 'react-native';

import {
  rootPath,
  location,
  heightHeader
} from "../../../../config/enviroment";
import Icon from "react-native-vector-icons/FontAwesome";

// translate connect subcribe language change
import I18n from "../../../../translations/i18n";
import { connect } from "react-redux";

// axios
import axios from "axios";
var CancelToken = axios.CancelToken;
var cancelSearch, cancelRequestCollection, cancelRequestAuthor;
const source = CancelToken.source();

import {
  widthPercentageToDP,
  heightPercentageToDP
} from "../../../../theme/scale";

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

class SearchItemScreen extends React.Component {
  static navigationOptions = {
    header: null,
    tabBarVisible: false
  };

  constructor(props) {
    super(props);
    this.state = {
      textSearch: "",
      showPiker: false,
      arrAuthorEn: [{ value: "", label: "SEARCH IN ALL AUTHOR" }],
      arrAuthorVi: [{ value: "", label: "TÌM TRONG TÂT CẢ TÁC GIẢ" }],
      arrCollectionEn: [{ value: "", label: "SEARCH IN ALL COLLECTION" }],
      arrCollectionVi: [{ value: "", label: "TÌM TRONG TÂT CẢ BỘ SƯU TẬP" }],
      searchResult: [],
      searchResultNull: false,
      searchErr: false,
      searchWithAuthorId: "",
      searchWithCollectionId: "",
      visibleLoading: false,
      getAuthorSuccess: false,
      getCollectionSuccess: false,
      spinner: true
    };
  }

  _getAuthor() {
    const body = { code: "authornoimage", param: { isactive: true } };
    return axios({
      method: 'post',
      url: `${rootPath}public/search`,
      data: body,
      cancelToken: new CancelToken(function executor(c) {
        cancelRequestAuthor = c;
      })
    })
  }

  _getCollection() {
    const body = { code: "itemcollection", param: { isactive: true } };
    return axios({
      method: 'post',
      url: `${rootPath}public/search`,
      data: body,
      cancelToken: new CancelToken(function executor(c) {
        cancelRequestCollection = c;
      })
    })
  }

  _setDataAuthorAndCollectionToState(authorResponse, collectionResponse) {
    //author
    let responseListAuthor = JSON.parse(JSON.stringify(authorResponse));
    if (
      responseListAuthor &&
      responseListAuthor.data.PHHAPI.body.length > 0
    ) {
      this.setState({ errLoadData: false });
      let arrAuthorEn = [{ value: "", label: "SEARCH IN ALL AUTHOR" }];
      let arrAuthorVi = [{ value: "", label: "TÌM TRONG TÂT CẢ TÁC GIẢ" }];

      responseListAuthor.data.PHHAPI.body.forEach(author => {
        arrAuthorEn.push({ value: author._id.toString(), label: author.en.fullname.toString() });
        arrAuthorVi.push({ value: author._id.toString(), label: author.vi.fullname.toString() })
      });

      this.setState(
        {
          arrAuthorEn: arrAuthorEn,
          arrAuthorVi: arrAuthorVi,
          getAuthorSuccess: true
        },
        () => {
          // console.log(this.state.arrAuthorEn);
        }
      );
    }

    //collection
    let responseListCollection = JSON.parse(JSON.stringify(collectionResponse));
    if (
      responseListCollection &&
      responseListCollection.data.PHHAPI.body.length > 0
    ) {

      this.setState({ errLoadData: false });
      let arrCollectionEn = [{ value: "", label: "SEARCH IN ALL COLLECTION" }];
      let arrCollectionVi = [{ value: "", label: "TÌM TRONG TẤT CẢ BỘ SƯ TẬP" }];

      responseListCollection.data.PHHAPI.body.forEach(collection => {
        arrCollectionEn.push({ value: collection._id.toString(), label: collection.en.name.toString() });
        arrCollectionVi.push({ value: collection._id.toString(), label: collection.vi.name.toString() })
      });

      this.setState(
        {
          arrCollectionEn: arrCollectionEn,
          arrCollectionVi: arrCollectionVi,
          getCollectionSuccess: true
        },
        () => {
          // console.log(this.state.arrCollectionVi);
        }
      );
    }

  }
  _renderPiker(active, ) {
    //vi
    let platform = Platform.OS;
    if (this.props.stateCurentLanguage == "vi") {
      return (
        <View style={{ display: active == true ? 'flex' : "none", height: active == true ? 100 : 0, backgroundColor: "#00aeef" }}>

          <View style={{ position: "relative", height: active == true ? 50 : 0, backgroundColor: "#0882b0" }}>
            <Image source={require("../../../../assets/icon/DropDownArrow.png")}
              style={{ position: "absolute", top: 15, right: 20, width: platform === 'android' ? 0 : 15, height: 15, zIndex: 100 }} />

            <SelectInput
              labelStyle={{ color: "#fff", textAlign: "center" }}
              style={{ height: active == true ? 50 : 0, paddingVertical: platform === 'android' ? 0 : 15, borderBottomColor: "#fff", borderBottomWidth: 1 }}
              value={this.state.searchWithAuthorId} options={this.state.arrAuthorVi}
              onSubmitEditing={(authorID) => {
                this.setState({ searchWithAuthorId: authorID }, () => {
                  //Alert.alert(authorID.toString())
                });
              }}
            />
          </View>

          <View style={{ position: "relative", height: active == true ? 50 : 0, backgroundColor: "#0882b0" }}>
            <Image source={require("../../../../assets/icon/DropDownArrow.png")}
              style={{ position: "absolute", top: 15, right: 20, width: platform === 'android' ? 0 : 15, height: 15, zIndex: 100 }} />
            <SelectInput
              style={{ height: active == true ? 50 : 0, paddingVertical: platform === 'android' ? 0 : 15 }}
              labelStyle={{ color: "#fff", textAlign: "center" }}
              value={this.state.searchWithCollectionId} options={this.state.arrCollectionVi}
              onSubmitEditing={(collectionID) => {
                this.setState({ searchWithCollectionId: collectionID });
              }}
            />
          </View>

        </View>
      )
    }
    else {
      //en
      let platform = Platform.OS;
      return (
        <View style={{ display: active == true ? 'flex' : "none", height: active == true ? 100 : 0, backgroundColor: "#00aeef" }}>

          <View style={{ position: "relative", height: active == true ? 50 : 0, backgroundColor: "#0882b0" }}>
            <Image source={require("../../../../assets/icon/DropDownArrow.png")}
              style={{ position: "absolute", top: 15, right: 20, width: platform === 'android' ? 0 : 15, height: 15, zIndex: 100 }} />
            <SelectInput
              labelStyle={{ color: "#fff", textAlign: "center" }}
              style={{ height: active == true ? 50 : 0, paddingVertical: platform === 'android' ? 0 : 15, borderBottomColor: "#fff", borderBottomWidth: 1 }}
              value={this.state.searchWithAuthorId} options={this.state.arrAuthorEn}
              onSubmitEditing={(authorID) => {
                this.setState({ searchWithAuthorId: authorID });
              }}
            />
          </View>

          <View style={{ position: "relative", height: active == true ? 50 : 0, backgroundColor: "#0882b0" }}>
            <Image source={require("../../../../assets/icon/DropDownArrow.png")}
              style={{ position: "absolute", top: 15, right: 20, width: platform === 'android' ? 0 : 15, height: 15, zIndex: 100, display: platform === 'android' ? "none" : "" }} />

            <SelectInput
              style={{ paddingVertical: platform === 'android' ? 0 : 15, height: active == true ? 50 : 0 }}
              labelStyle={{ color: "#fff", textAlign: "center" }}
              value={this.state.searchWithCollectionId} options={this.state.arrCollectionEn}
              onSubmitEditing={(collectionID) => {
                this.setState({ searchWithCollectionId: collectionID });
              }}
            />
          </View>
        </View>
      )
    }
  }

  _searchForInput(textSearch, authorID = "", collectionID = "") {
    Keyboard.dismiss();
    // source.cancel('Operation canceled');
    this.setState({ visibleLoading: true, searchErr: false, searchResultNull: false });
    let arrHotItemTg = [];
    this.setState({ searchResult: arrHotItemTg }, () => {
      axios
        .get(
          `${rootPath}dspace/rest/items/search?policies=public&filter_field_1=authorID&filter_type_1=equals&filter_value_1=${authorID}&filter_field_2=collectionID&filter_type_2=equals&filter_value_2=${collectionID}&filter_field_3=title&filter_type_3=like&filter_value_3=${textSearch}&rpp=10&location=${location}`,
          {
            cancelToken: source.token
          }
        )
        .then(response => {
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
            // ket qua tra ve co ban ghi phu hop
            this.setState({ arrHotItem: arrHotItemTg }, () => {
              this.setState({ searchResultNull: false });
              this.setState({ visibleLoading: false });
            });
          } else {
            // loi,khong co ket qua tra ve
            this.setState({ arrHotItem: [] });
            this.setState({ searchResultNull: true });
            this.setState({ visibleLoading: false });
          }
        })
        .catch(err => {
          // loi,khong co ket qua tra ve
          source.cancel('Operation canceled by err internet.');
          this.setState({ visibleLoading: false, searchErr: true })
        });
    });
  }


  componentWillUnmount() {
    if (source && cancelRequestAuthor && cancelRequestCollection && this.state.getCollectionSuccess == false && this.state.getAuthorSuccess == false && this.state.spinner == true) {
      this.setState({ spinner: false }, () => {
        cancelRequestAuthor();
        cancelRequestCollection();
        source.cancel('Operation canceled');
        setTimeout(() => Alert.alert(I18n.t("SEARCHERR")), 100);
      });
    }
  }


  componentDidMount() {
    // lấy thông tin cho 2 piker
    setTimeout(() => {
      if (cancelRequestAuthor && cancelRequestCollection && this.state.getCollectionSuccess == false && this.state.getAuthorSuccess == false && this.state.spinner == true) {
        this.setState({ spinner: false }, () => {
          // console.log('mang cham')
          cancelRequestAuthor();
          cancelRequestCollection();
          setTimeout(() => Alert.alert(I18n.t("SEARCHERR")), 100);
        });
      }
    }, 5000)
    axios.all([this._getAuthor(), this._getCollection()])
      .then(
        data => {
          // console.log(data);
          if (data[0] != undefined && data[1] != undefined) {
            this._setDataAuthorAndCollectionToState(data[0], data[1]);
            setTimeout(() => this.setState({ spinner: false }), 200)
          }
        }
      )
      .then(
        axios.spread(function (acct, perms) {
          // console.log("load success");
        })
      )
      .catch(err => {
        // this.setState({ errLoadData: true , spinner: false });
        // console.log(err);
        if (cancelRequestAuthor && cancelRequestCollection && this.state.getCollectionSuccess == false && this.state.getAuthorSuccess == false && this.state.spinner == true) {
          this.setState({ spinner: false }, () => {
            cancelRequestAuthor();
            cancelRequestCollection();
            setTimeout(() => Alert.alert(I18n.t("SEARCHERR")), 100);
          });
        }
      });

  }


  render() {
    I18n.locale = this.props.stateCurentLanguage;
    return (

      <View style={{ flex: 1 }}>
        <Spinner
          visible={this.state.spinner}
          textContent={'Loading...'}
          textStyle={styles.spinnerTextStyle}
        />
        <View style={{ height: 70 }}>
          <ImageBackground
            source={require("../../../../assets/image/backgroundHeader.png")}
            style={styles.searchContainer}
          >
            <TouchableOpacity
              style={[styles.buttonBack]}
              underlayColor="#fcfcfc"
              onPress={() => {
                this.props.navigation.goBack(null);
              }}
            >
              <Image
                source={require("../../../../assets/icon/back.png")}
                style={styles.iconBack}
              />
            </TouchableOpacity>

            <View style={styles.wrapInputSearch}>

              <TextInput
                style={styles.inputSearch}
                placeholder={I18n.t("TYPETOSEARCH")}
                // editable ={(this.state.spinner == false && this.state.visibleLoading == false ) ? true : false}
                onChangeText={textSearch =>
                  this.setState({ textSearch: textSearch })
                }
                onBlur={() => {
                  setTimeout(() => {
                    if (this.state.visibleLoading == false) {
                      this._searchForInput(this.state.textSearch, this.state.searchWithAuthorId, this.state.searchWithCollectionId)
                    }
                  }, 200)
                }}
              />

              <TouchableOpacity
                style={{ width: 30, height: 30, marginLeft: 20, marginTop: 15 ,paddingLeft: 10, paddingRight: 10}}
                underlayColor="#fcfcfc"
                onPress={() =>
                  this._searchForInput(
                    this.state.textSearch,
                    this.state.searchWithAuthorId,
                    this.state.searchWithCollectionId
                  )
                }
              >
                <Image
                  source={require("../../../../assets/icon/search.png")}
                  style={{ width: 20, height: 20 }}
                />
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.buttonFilter]}
                underlayColor="#fcfcfc"
                onPress={() => {
                  this.setState({ showPiker: !this.state.showPiker });
                }}
              >
                <Image
                  source={require("../../../../assets/icon/filterActive.png")}
                  style={{
                    height: !this.state.showPiker == true ? 0 : 20,
                    width: !this.state.showPiker == true ? 0 : 20
                  }}
                />
                <Image
                  source={require("../../../../assets/icon/filterInactive.png")}
                  style={{
                    height: this.state.showPiker == true ? 0 : 20,
                    width: this.state.showPiker == true ? 0 : 20
                  }}
                />
              </TouchableOpacity>

            </View>
          </ImageBackground>
        </View>

        <View style={{ marginTop: 10, height: this.state.showPiker == true ? 100 : 0 }}>
          {this._renderPiker(this.state.showPiker)}
        </View>

        <View style={{ flex: 1 }}>

          <ScrollView style={[styles.scrollView, { flex: 1 }]}>
            <View style={{ display: this.state.visibleLoading ? 'flex' : 'none', marginTop: 10 }}>
              <LoadingComponent Visible={this.state.visibleLoading} />
            </View>
            <Text
              style={{
                display: this.state.searchResultNull ? 'flex' : 'none',
                paddingLeft: "5%"
              }}
            >
              {I18n.t("NORESULT")}
            </Text>
            <Text
              style={{
                display: this.state.searchErr ? 'flex' : 'none',
                paddingLeft: "5%"
              }}
            >
              {I18n.t("SEARCHERR")}
            </Text>

            <FlatList
              style={styles.styleFlatlist}
              data={this.state.arrHotItem}
              keyExtractor={item => item._id + "1"}
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
                      paddingVertical: "2%",
                      backgroundColor: index % 2 == 0 ? "#fff" : "#f5f5f5"
                    }}
                  >
                    <View
                      style={[
                        styles.containerRow,
                        // { paddingTop: index == 0 ? 40 : 0 }
                      ]}
                    >
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
)(SearchItemScreen);

const styles = StyleSheet.create({
  contentContainer: {
    backgroundColor: "#fff"
  },
  containerRow: {
    flex: 1,
    flexDirection: "row"
  },
  buttonFilter: {
    width: 30,
    height: 30,
    position: "absolute",
    right: 30,
    top: 15
  },
  wrapInputSearch: {
    width: Dimensions.get("window").width - 70,
    flexDirection: "row",
    marginLeft: 0,
    height: 40,
    marginTop: 10,
    marginLeft: 50
  },
  inputSearch: {
    flex: 1,
    borderBottomColor: "#fff",
    color: "#fff",
    marginLeft: 0,
    marginTop: 2,
    height: 40,
    borderBottomWidth: 1,
    paddingLeft: 10,
    paddingRight: 30,
    marginRight: 20
  },
  styleFlatlist: {
    marginBottom: 30,
    marginTop: 5
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
  },
  // header
  iconBack: {
    height: 23,
    width: 13
  },
  iconDropDown: {
    position: "absolute", right: 20, top: 13, width: 13, height: 13, zIndex: 100
  },
  searchContainer: {
    height: heightHeader,
    flexDirection: "row",
    paddingTop: 15
  },
  titleTabBottom: {
    fontWeight: "bold",
    color: "#fff",
    width: "100%",
    paddingTop: 15,
    textAlign: "center",
    fontSize: 20
  },
  buttonSearch: {
    width: 45,
    height: 45,
    position: "absolute",
    top: 25,
    right: 10,
    paddingTop: 5,
    paddingLeft: 10
  },
  buttonBack: {
    width: 50,
    height: 50,
    position: "absolute",
    top: 35,
    left: 5,
    paddingTop: 5,
    paddingLeft: 10
  },
  spinnerTextStyle: {
    color: '#FFF'
  },
});
