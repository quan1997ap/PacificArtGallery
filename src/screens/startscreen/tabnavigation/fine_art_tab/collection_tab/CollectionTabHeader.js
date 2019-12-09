import React, { Component } from "react";
import {
  Text,
  View,
  Image,
  WebView,
  FlatList,
  StyleSheet,
  ScrollView,
  TouchableHighlight,
  NetInfo
} from "react-native";
import axios from "axios";
import {
  widthPercentageToDP,
  heightPercentageToDP
} from "../../../../../theme/scale";
import LoadingComponent from "../../../../../components/LoadingComponent";
import { AsyncStorage } from "react-native";
import { rootPath } from "../../../../../config/enviroment";
import { subStringWord } from "../../../../../config/function";

// translate connect subcribe language change
import I18n from "../../../../../translations/i18n";
import { connect } from "react-redux";

class CollectionTabHeader extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      arrCollection: [],
      errLoadData: false,
      isLoading: true
    };
  }

  getData() {
    const body = {
      code: "itemcollection",
      param: { isactive: true },
      sort: { serial: 1 },
      pagesize: "26",
      pageindex: "1"
    };
    axios
      .post(`${rootPath}public/search`, body, {
        headers: { "Content-Type": "application/json" }
      })
      .then(response => {
        let responseListCollection = JSON.parse(JSON.stringify(response));
        if (
          responseListCollection &&
          responseListCollection.data.PHHAPI.body.length > 0
        ) {
          // this.setState({ errLoadData: false });
          this.setState({ isLoading: false });
          this.setState(
            { arrCollection: responseListCollection.data.PHHAPI.body },
            () => {
              // console.log(this.state.arrCollection);
             
            }
          );
        }
      })
      .catch(err => {
        // this.setState({ errLoadData: true });
        // console.log(err/);
      });
  }

  _renderFooter() {
    return <LoadingComponent Visible={this.state.isLoading} />;
  }

  componentDidMount() {
    this.getData();
  }

  _SubWordCollectionSubTitle(string) {
    if (widthPercentageToDP("100%") < 400) {
      return subStringWord(string, 30);
    } 
    else if(string = undefined){
      return "";
    }
    else {
      return string;
    }
  }

  render() {
    I18n.locale = this.props.stateCurentLanguage;
   const INJECTEDJAVASCRIPT = `const meta = document.createElement('meta'); meta.setAttribute('content', 'width=device-width, initial-scale=1 maximum-scale=1, user-scalable=0'); meta.setAttribute('name', 'viewport'); document.getElementsByTagName('head')[0].appendChild(meta); `;
    return (
      <ScrollView contentContainerStyle={styles.contentContainer}>
        <FlatList
          style={styles.styleFlatlist}
          data={this.state.arrCollection}
          keyExtractor={item => item._id+"key"}
          extraData={this.props.stateCurentLanguage}
          renderItem={({ item, index }) => {
            let urlimage =
              "https://pacificartgallery.com/artgallery/download?folder=collections&file=" +
              item.image;
            return (
              <TouchableHighlight
                underlayColor="#fcfcfc"
                onPress={() => {
                  this.props.navigation.navigate("CollectionDetail", {
                    itemIdCollection: item._id,
                    itemNameViCollection: item.vi.name,
                    itemNameEnCollection: item.en.name,
                    itemNameViNote: item.vi.note,
                    itemNameEnNote: item.en.note,
                  });
                }}
                style={{
                  paddingHorizontal: "4%",
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
                      uri: urlimage,
                      cache: 'force-cache',
                    }}
                    style={styles.leftImage}
                  />
                  <View style={styles.rightInfo}>
                    <Text style={[styles.title, {}]}>
                      {this.props.stateCurentLanguage == "vi"
                        ? item.vi.name
                        : item.en.name}
                    </Text>
                       
                    <Text style={styles.subTitleSummaryText}>
                      {this.props.stateCurentLanguage == "vi" ? this._SubWordCollectionSubTitle(item.vi.note) : this._SubWordCollectionSubTitle(item.en.note) }
                    </Text> 

                  </View>
                </View>
              </TouchableHighlight>
            );
          }}
          ListFooterComponent={this._renderFooter.bind(this)}
        />
      </ScrollView>
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
)(CollectionTabHeader);

const styles = StyleSheet.create({
  contentContainer: {
    backgroundColor: "#fff"
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
    fontSize: 16,
    fontFamily: 'Roboto-Bold',
    paddingLeft: "5%",
    color: "#0882b0",
    textAlign: "justify",
    marginTop: "-1%",
    fontWeight: "900",
    lineHeight: 25
  },
  subTitleDate: {
    width: "90%",
    fontSize: 13,
    color: "#b89d54",
    paddingLeft: "5%",
    textAlign: "justify"
  },
  subTitleSummaryText: {
    width: "100%",
    color: "#333",
    fontSize: 13,
    textAlign: 'justify',
    paddingHorizontal: "5%"
  },
  subTitleSummary: {
    width: "94%",
    marginLeft: "1%",
    paddingLeft: "5%",
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
