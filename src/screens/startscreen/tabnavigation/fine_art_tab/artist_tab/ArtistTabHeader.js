import React, { Component } from "react";
import {
  Text,
  View,
  Image,
  Button,
  FlatList,
  StyleSheet,
  TouchableHighlight,
  Alert,
  ScrollView
} from "react-native";
import axios from "axios";
import {
  widthPercentageToDP,
  heightPercentageToDP
} from "../../../../../theme/scale";
import _ from "lodash";
import LoadingComponent from "../../../../../components/LoadingComponent";
import { subStringWord } from "../../../../../config/function";

// translate connect subcribe language change
import I18n from "../../../../../translations/i18n";
import { connect } from "react-redux";
import { rootPath } from "../../../../../config/enviroment";


class ArtistTabHeader extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      arrArtist: [],
      errLoadData: false,
      language: "",
      pageIndex: 0,
      isLoading: true
    };
  }

  _getDataArtist(_pageindex) {
    if (this.state.isLoading == true) {
      const body = {
        code: "author",
        param: { isactive: true },
        sort: { serial: 1 },
        pagesize: "9",
        pageindex: _pageindex
      };
      axios
        .post(`${rootPath}public/search`, body, {
          headers: { "Content-Type": "application/json" }
        })
        .then(response => {
          let responseListArtist = JSON.parse(JSON.stringify(response));

          if (
            responseListArtist &&
            responseListArtist.data.PHHAPI.body.length > 0
          ) {
            if (this.state.pageIndex == 0) {
              // Tăng pageIndex => Tải dữ liệu mới về lần đầu tiên
              this.setState({ pageIndex: _pageindex });
              this.setState(
                { arrArtist: responseListArtist.data.PHHAPI.body },
                () => {
                  // console.log(this.state.arrArtist);
                }
              );
            } else {
              // Tăng pageIndex => Tải dữ liệu mới về => gán vao mảng ban đầu
              this.setState({ pageIndex: _pageindex }); // increase page index
              let currentArr = this.state.arrArtist.concat(
                responseListArtist.data.PHHAPI.body
              );
              this.setState({ arrArtist: currentArr }, () => {
                // console.log(this.state.arrArtist);
              });
            }
            this.setState({ errLoadData: false });
          } else if (
            // End Data
            responseListArtist &&
            responseListArtist.data.PHHAPI.body.length == 0
          ) {
            this.setState({ isLoading: false });
            // console.log(this.state.isLoading);
          } else {
            // console.log("err");
          }
        })
        .catch(err => {
          this.setState({ errLoadData: true });
          // console.log(err);
        });
    }
  }

  _SubWordCollectionSubTitle(string) {
    if (widthPercentageToDP("100%") < 400) {
      return subStringWord(string, 30);
    } else {
      return string;
    }
  }

  _renderFooter() {
    return <LoadingComponent Visible={this.state.isLoading} />;
  }

  componentDidMount() {
    this._getDataArtist(this.state.pageIndex + 1);
  }

  render() {
    I18n.locale = this.props.stateCurentLanguage;

    return (
      <View contentContainerStyle={styles.contentContainer}>
        <FlatList
          data={this.state.arrArtist}
          style={styles.styleFlatlist}
          keyExtractor={(item, index) => item._id + index}
          onEndReached={() => {
            this._getDataArtist(this.state.pageIndex + 1);
          }}
          onEndReachedThreshold={1} // xuong gan day cách đáy 1 khoang = chiều cao 1 phần tử thi load tiep
          extraData={this.props.stateCurentLanguage}
          renderItem={({ item, index }) => {
            let urlimage =
              "https://pacificartgallery.com/artgallery/download?folder=author&file=" +
              item.image;
            return (
              <TouchableHighlight
                style={{
                  paddingHorizontal: "5%",
                  paddingVertical: "4%",
                  backgroundColor: index % 2 == 0 ? "#fff" : "#f5f5f5"
                }}
                underlayColor="#fcfcfc"
                onPress={() => {
                  this.props.navigation.navigate("ArtistDetail", {
                    artistID: item._id
                  });
                }}
              >
                <View
                  style={[
                    styles.containerRow
                  ]}
                >
                  <Image
                    source={{
                      uri: urlimage,
                      cache: 'force-cache',
                    }}
                    style={styles.leftImage}
                  />
                  <View style={styles.rightInfo}>
                    <Text style={[styles.title, {}]}>
                      {this.props.stateCurentLanguage == "vi"
                        ? item.vi.fullname
                        : item.en.fullname}
                    </Text>
                    <Text style={styles.subTitleDate}>
                      {item.birthdate} - {item.deathdate}
                    </Text>
                    <Text style={styles.subTitleSummary}>
                      {this.props.stateCurentLanguage == "vi"
                        ? this._SubWordCollectionSubTitle(item.vi.summary)
                        : this._SubWordCollectionSubTitle(item.en.summary)}
                    </Text>
                  </View>
                </View>
              </TouchableHighlight>
            );
          }}
          ListFooterComponent={this._renderFooter.bind(this)}
        />
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
)(ArtistTabHeader);

const styles = StyleSheet.create({
  contentContainer: {
    backgroundColor: "#fff"
  },
  containerRow: {
    flex: 1,
    flexDirection: "row"
  },
  styleFlatlist: {
    // paddingBottom: 60
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
