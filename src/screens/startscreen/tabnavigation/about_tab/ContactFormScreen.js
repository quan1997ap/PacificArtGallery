import React, { Component } from "react";
import {
  Text,
  View,
  Image,
  ScrollView,
  TextInput,
  StyleSheet,
  Alert,
  Button,
  TouchableHighlight
} from "react-native";
import HeaderComponent from "../../../../components/HeaderComponent";
import { heightHeader, rootPath } from "../../../../config/enviroment";

// axios & cancel reques
import axios from "axios";
var CancelToken = axios.CancelToken;
var cancel;

import { _validateEmail, _validatePhone } from "../../../../config/validate";
// translate
import I18n from "../../../../translations/i18n";
import { connect } from "react-redux";

class UselessTextInput extends Component {
  render() {
    return (
      <TextInput
        {...this.props} // Inherit any props passed to it; e.g., multiline, numberOfLines below
        editable={true}
        maxLength={200}
      />
    );
  }
}

class ContactFormScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      name: "",
      email: "",
      phoneNumber: "",
      address: "",
      company: "",
      message: "",

      nameInputFocus: false,
      emailInputFocus: false,
      phoneNumberFocus: false,
      addressInputFocus: false,
      companyInputFocus: false,
      messageInputFocus: false,

      nameInputLostFocus: false,
      emailInputLostFocus: false,
      phoneNumberInputLostFocus: false,
      addressInputLostFocus: false,
      companyInputLostFocus: false,
      messageInputLostFocus: false,

      formErr: false,
      contactInfoSubmitErr: false,
      isSending: false
    };
  }

  _hideSubmit(name, email, phoneNumber, address, company, message) {
    if (
      name == "" ||
      email == "" ||
      phoneNumber == "" ||
      address == "" ||
      company == "" ||
      message == "" ||
      _validateEmail(email) == false ||
      _validatePhone(phoneNumber) == false
      // this.state.nameInputFocus == true && this.state.emailInputFocus == true && this.state.phoneNumberInputFocus== true && this.state.addressInputFocus == true && this.state.companyInputFocus == true && this.state.messageInputFocus == true
    ) {
      return true;
    } else {
      return false;
    }
  }

  _submitContactInfo(name, email, phoneNumber, address, company, message) {
    if (
      this._hideSubmit(name, email, phoneNumber, address, company, message) ==
      true
    ) {
      this.setState({ formErr: true });
    } else {
      const body = {
        code: "contacts",
        param: {
          name: name,
          email: email,
          phone: phoneNumber,
          address: address,
          company: company,
          message: message
        }
      };
      // axios
      //   .post(`${rootPath}public/create`, body)

      this.setState({ isSending: true }, () => {
        this.setState({ contactInfoSubmitErr: false });
      });

      axios({
        method: "post",
        url: `${rootPath}public/create`,
        data: body,
        cancelToken: new CancelToken(function executor(c) {
          cancel = c;
        })
      })
        .then(response => {
          // console.log(response);
          if (
            response.data.PHHAPI.header.message == "success" &&
            response.data.PHHAPI.body.length > 0
          ) {
            this.setState({ isSending: false }, () => {
              Alert.alert("", I18n.t("SENDCONTACTSUCCESS"), [
                { text: "Ok", onPress: () => this.props.navigation.goBack() }
              ]);
            });
          }
        })
        .catch(err => {
          if (axios.isCancel(err)) {
            // console.log("im canceled");
          } else {
            this.setState({ isSending: false }, () => {
              this.setState({ contactInfoSubmitErr: true });
            });
          }
        });
    }

    setTimeout(() => {
      cancel();
      if (this.state.isSending == true) {
        this.setState({ isSending: false }, () => {
          this.setState({ contactInfoSubmitErr: true });
        });
      }
    }, 5000);
  }

  componentWillUnmount() {
    // cancel request
    if (
      this.state.contactInfoSubmitErr == false &&
      this.state.isSending == true
    ) {
      cancel();
    }
  }

  render() {
    return (
      <View style={{ flex: 1 }}>
        <View style={{ height: heightHeader }}>
          <HeaderComponent
            titleName={I18n.t("CONTACTUS")}
          />
        </View>

        <View style={{ flex: 1 }}>
          <ScrollView style={styles.Form}>
            {/* NAME */}
            <View style={styles.formControl}>
              <TextInput
                style={styles.textInputStyle}
                placeholder={I18n.t("YOURNAME")}
                onChangeText={name => {
                  this.setState({ name: name });
                }}
                // check input dirty
                onBlur={() => {
                  this.setState({ nameInputLostFocus: true });
                }}
                onFocus={() => {
                  this.setState({ nameInputFocus: true });
                }}
              />
              <Text
                style={[
                  styles.errInput,
                  {
                    height:
                      this.state.nameInputLostFocus == true &&
                      this.state.nameInputFocus == true &&
                      this.state.name == ""
                        ? 20
                        : 0
                  }
                ]}
              >
                {" "}
                {I18n.t("YOURNAME")} {I18n.t("REQUIRE")}
              </Text>
            </View>

            {/* EMAIL */}
            <View style={styles.formControl}>
              <TextInput
                style={styles.textInputStyle}
                placeholder={I18n.t("YOUREMAIL")}
                onChangeText={email => {
                  this.setState({ email: email });
                }}
                onBlur={() => {
                  this.setState({ emailInputLostFocus: true });
                }}
                onFocus={() => {
                  this.setState({ emailInputFocus: true });
                }}
              />

              {/* (TH1)dirty + "" ---- (TH2)dirty + invalid */}
              <Text
                style={[
                  styles.errInput,
                  {
                    height:
                      this.state.emailInputFocus == true &&
                      this.state.emailInputLostFocus == true &&
                      this.state.email == ""
                        ? 20
                        : 0
                  }
                ]}
              >
                {" "}
                {I18n.t("YOUREMAIL")} {I18n.t("REQUIRE")}
              </Text>
              <Text
                style={[
                  styles.errInput,
                  {
                    height:
                      this.state.emailInputFocus == true &&
                      this.state.emailInputLostFocus == true &&
                      this.state.email != "" &&
                      _validateEmail(this.state.email) == false
                        ? 20
                        : 0
                  }
                ]}
              >
                {" "}
                {I18n.t("YOUREMAIL")} {I18n.t("INVALID")}
              </Text>
            </View>

            {/* PHONE */}
            <View style={styles.formControl}>
              <TextInput
                style={styles.textInputStyle}
                placeholder={I18n.t("PHONENUMBER")}
                onChangeText={phoneNumber => {
                  this.setState({ phoneNumber: phoneNumber });
                }}
                // check input dirty
                onBlur={() => {
                  this.setState({ phoneNumberInputLostFocus: true });
                }}
                onFocus={() => {
                  this.setState({ phoneNumberInputFocus: true });
                }}
              />
              <Text
                style={[
                  styles.errInput,
                  {
                    height:
                      this.state.phoneNumberInputLostFocus == true &&
                      this.state.phoneNumberInputFocus == true &&
                      this.state.phoneNumber == ""
                        ? 20
                        : 0
                  }
                ]}
              >
                {" "}
                {I18n.t("PHONENUMBER")} {I18n.t("REQUIRE")}
              </Text>
              <Text
                style={[
                  styles.errInput,
                  {
                    height:
                      this.state.phoneNumberInputLostFocus == true &&
                      this.state.phoneNumberInputFocus == true &&
                      this.state.phoneNumber != "" &&
                      _validatePhone(this.state.phoneNumber) == false
                        ? 20
                        : 0
                  }
                ]}
              >
                {" "}
                {I18n.t("PHONENUMBER")} {I18n.t("INVALID")}
              </Text>
            </View>

            {/* ADDRESS */}
            <View style={styles.formControl}>
              <TextInput
                style={styles.textInputStyle}
                placeholder={I18n.t("ADDRESS")}
                onChangeText={address => {
                  this.setState({ address: address });
                }}
                onBlur={() => {
                  this.setState({ addressInputLostFocus: true });
                }}
                onFocus={() => {
                  this.setState({ addressInputFocus: true });
                }}
              />
              <Text
                style={[
                  styles.errInput,
                  {
                    height:
                      this.state.addressInputLostFocus == true &&
                      this.state.addressInputFocus == true &&
                      this.state.address == ""
                        ? 20
                        : 0
                  }
                ]}
              >
                {" "}
                {I18n.t("ADDRESS")} {I18n.t("REQUIRE")}
              </Text>
            </View>

            {/* COMPANY */}
            <View style={styles.formControl}>
              <TextInput
                style={styles.textInputStyle}
                placeholder={I18n.t("COMPANY")}
                onChangeText={company => {
                  this.setState({ company: company });
                }}
                onBlur={() => {
                  this.setState({ companyInputLostFocus: true });
                }}
                onFocus={() => {
                  this.setState({ companyInputFocus: true });
                }}
              />
              <Text
                style={[
                  styles.errInput,
                  {
                    height:
                      this.state.companyInputLostFocus == true &&
                      this.state.companyInputFocus == true &&
                      this.state.name == ""
                        ? 20
                        : 0
                  }
                ]}
              >
                {" "}
                {I18n.t("COMPANY")} {I18n.t("REQUIRE")}
              </Text>
            </View>

            {/* YOURMESSAGE  */}
            <View style={styles.formControl}>
              <UselessTextInput
                multiline={true}
                numberOfLines={4}
                placeholder={I18n.t("YOURMESSAGE")}
                scrollEnabled ={true}
                style={styles.UselessTextInput}
                onChangeText={message => {
                  this.setState({ message: message });
                }}
                onBlur={() => {
                  this.setState({ messageInputLostFocus: true });
                }}
                onFocus={() => {
                  this.setState({ messageInputFocus: true });
                }}
                
              />
              <Text
                style={[
                  styles.errInput,
                  {
                    height:
                      this.state.messageInputLostFocus == true &&
                      this.state.messageInputFocus == true &&
                      this.state.message == ""
                        ? 20
                        : 0
                  }
                ]}
              >
                {" "}
                {I18n.t("YOURMESSAGE")} {I18n.t("REQUIRE")}
              </Text>
            </View>

            {/* Submit ERR */}
            <Text
              style={[
                styles.errInput,
                { height: this.state.contactInfoSubmitErr == true ? 40 : 0 }
              ]}
            >
              {I18n.t("ERRSUBMITINFOCONTACT")}
            </Text>

            <TouchableHighlight
              disabled={
                this._hideSubmit(
                  this.state.name,
                  this.state.email,
                  this.state.phoneNumber,
                  this.state.address,
                  this.state.company,
                  this.state.message
                ) == true || this.state.isSending == true
              }
              style={[
                styles.buttonContact,
                {
                  opacity:
                    this._hideSubmit(
                      this.state.name,
                      this.state.email,
                      this.state.phoneNumber,
                      this.state.address,
                      this.state.company,
                      this.state.message
                    ) == true || this.state.isSending == true
                      ? 0.6
                      : 1
                }
              ]}
              underlayColor="#fcfcfc"
              onPress={() => {
                this._submitContactInfo(
                  this.state.name,
                  this.state.email,
                  this.state.phoneNumber,
                  this.state.address,
                  this.state.company,
                  this.state.message
                );
              }}
            >
              <Text style={styles.textContact}>{I18n.t("SUBMIT")}</Text>
            </TouchableHighlight>
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
)(ContactFormScreen);

const styles = StyleSheet.create({
  contentContainer: {
    backgroundColor: "#fff",
    flex: 1
  },
  Form: {
    flex: 1,
    paddingHorizontal: "5%",
    flexDirection: "column",
    paddingTop: 20
  },
  formControl: {
    paddingVertical: 10
  },
  errInput: {
    color: "#ff0000"
  },
  textInputStyle: {
    width: "100%",
    borderWidth: 1,
    borderColor: "#ddd",
    height: 40,
    borderRadius: 5,
    marginBottom: 5,
    paddingHorizontal: 15,
  },
  UselessTextInput :{
    width: "100%",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 5,
    paddingTop: 10,
    paddingBottom: 10,
    marginBottom: 5,
    paddingHorizontal: 15,
    minHeight: 40
  },
  buttonContact: {
    width: 100,
    height: 40,
    backgroundColor: "#b89d4f",
    marginTop: 20,
    marginBottom: 100
  },
  textContact: {
    paddingTop: 8,
    width: "100%",
    textAlign: "center",
    fontWeight: "bold",
    color: "#fff"
  }
});
