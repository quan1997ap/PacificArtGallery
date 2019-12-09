import React, { Component } from "react";
import {
  Text,
  View,
  StyleSheet
} from "react-native";

// translate connect subcribe language change
import I18n from "../translations/i18n";
import { connect } from "react-redux";


class TitleComponent extends Component {

  componentDidMount(){
  
  }

  render() {
    return (
      <Text style={{color: this.props.Color, width: "100%" ,textAlign : "center", fontSize: this.props.tabType == 'bottom' ? 9 : 14 , fontWeight: this.props.fontWeight }}>
        {this.props.stateCurentLanguage == "vi" ? this.props.titleVi :  this.props.titleEn }
      </Text>
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
)(TitleComponent);
