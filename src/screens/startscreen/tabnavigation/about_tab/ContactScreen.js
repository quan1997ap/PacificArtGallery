import React, { Component } from "react";
import {
  Text,
  View,
  Image,
  ScrollView,
  StyleSheet,
  TouchableHighlight,
  FlatList
} from "react-native";
import HeaderComponent from "../../../../components/HeaderComponent";
import { heightHeader } from "../../../../config/enviroment";
import {
  widthPercentageToDP,
  heightPercentageToDP
} from "../../../../theme/scale";

// translate
import I18n from "../../../../translations/i18n";
import { connect } from "react-redux";

class ContactScreen extends React.Component {
  // config tabTop_Contact title  --------------------------------------------------------------------------------------------------------------------
  static navigationOptions = ({ navigation, screenProps }) => {
    const { params = {} } = navigation.state;
    return {
      title: `${params.title}`,
      tabBarLabel: `${params.title}`,
      header: null
    };
  };

  componentWillMount() {
    // set tab title
    this.props.navigation.setParams({ title: I18n.t("CONTACTUS") });
  }

  _changeThisTitle = titleText => {
    const { setParams } = this.props.navigation;
    setParams({ title: titleText });
  };

  componentDidUpdate(prevProps) {
    // change tab title when language change
    if (this.props.stateCurentLanguage !== prevProps.stateCurentLanguage) {
      this._changeThisTitle(I18n.t("CONTACTUS"));
    }
    //console.log(this.props.navigation)
  }
  // config tabTop_Contact title  --------------------------------------------------------------------------------------------------------------------


  constructor(props) {
    super(props);
    this.state = {
      arrContact: [
        {
          ID: "0",
          NameEn: "Gallery One",
          NameVi: "Phòng tranh số 1",
          AddressEn:
            "9th Floor, 25 Ly Thuong Kiet St.(37 Ngo Quyen), Phan Chu Trinh Ward, Hoan Kiem Dist, Ha Noi, Viet Nam",
          AddressVi:
            "Tầng 9, 25 Lý Thường Kiệt (37 Ngô Quyền ), P. Phan Chu Trinh, Q. Hoàn Kiếm, Hà Nội, Việt Nam",
          Email: "artgallery@thaibinhduong.vn",
          Tel: "(0084 24) 3 941 3268",
          Fax: "(0084 24) 3 941 3269"
        }
      ]
    };
  }
  render() {
    I18n.locale = this.props.stateCurentLanguage;

    return (
      <View style={{ flex: 1 }}>
        <ScrollView
          contentContainerStyle={[styles.contentContainer, { flex: 0.9 }]}
        >
          <FlatList
            style={styles.styleFlatlist}
            data={this.state.arrContact}
            keyExtractor={item => item.ID}
            extraData={this.props.stateCurentLanguage}
            renderItem={({ item, index }) => {
              return (
                <View
                  style={{
                    paddingHorizontal: "5%",
                    paddingVertical: "7%",
                    backgroundColor: index % 2 == 0 ? "#fff" : "#f5f5f5"
                  }}
                >
                  <View style={styles.containerRow}>
                    <Image
                      source={require("../../../../assets/image/AboutUsImg.jpg")}
                      style={styles.newsImage}
                    />
                    <View style={styles.coverInfo}>
                      <Text style={[styles.title, {}]}>
                        {this.props.stateCurentLanguage == "vi"
                          ? item.NameVi
                          : item.NameEn}
                      </Text>

                      <Text style={styles.subTitleSummary}>
                        {this.props.stateCurentLanguage == "vi"
                          ? item.AddressVi
                          : item.AddressEn}
                      </Text>
                      <Text style={styles.subTitleSummary}>
                        Email :{" "}
                        <Text style={{ color: "#007bff" }}>{item.Email}</Text>
                      </Text>

                      <Text style={styles.subTitleSummary}>
                        Tel :{" "}
                        <Text style={{ color: "#007bff" }}>{item.Tel}</Text>
                      </Text>

                      <Text style={styles.subTitleSummary}>
                        Fax :{" "}
                        <Text style={{ color: "#007bff" }}>{item.Fax}</Text>
                      </Text>

                      <TouchableHighlight
                        style={styles.buttonContact}
                        underlayColor="#fcfcfc"
                        onPress={() => {
                          this.props.navigation.navigate("ContactForm", {
                            eventID: item._id
                          });
                        }}
                      > 
                        <Text style= {styles.textContact}> {I18n.t("CONTACTUS")} </Text>
                      </TouchableHighlight>
                    </View>
                  </View>
                </View>
              );
            }}
          />
        </ScrollView>
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
)(ContactScreen);

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
    paddingBottom: 100
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
    fontSize: 15,
    color: "#0882b0",
    textAlign: "justify",
    marginTop: "3%",
    marginBottom: "2%",
    fontWeight: "bold"
  },
  subTitleSummary: {
    width: "100%",
    fontSize: 13,
    lineHeight: 25,
    color: "#333333"
  },
  buttonContact: {
    width: 115,
    height: 35,
    backgroundColor: "#b89d4f",
    marginTop: 20
  },
  textContact: {
    paddingTop: 8,width: "100%", textAlign: "center", fontWeight: "bold", color:"#fff"
  }
});
