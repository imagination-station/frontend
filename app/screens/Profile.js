import React, { Component, Fragment } from 'react';
import {
  Text,
  View,
  Image,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
  SafeAreaView,
  Platform
} from 'react-native';
import * as firebase from 'firebase';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { connect } from 'react-redux';

import { DARKER_GREY, GREY, ACCENT } from '../config/styles.js';

const PROFILE_PIC_SIZE = 70;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    paddingTop: Platform.OS === 'ios' ? 0 : StatusBar.currentHeight
  },
  header: {
    flexDirection: 'row',
    width: '100%',
    paddingHorizontal: 20,
    paddingVertical: 10,
    elevation: 0.5,
    backgroundColor: 'white'
  },
  profilePic: {
    width: PROFILE_PIC_SIZE,
    height: PROFILE_PIC_SIZE,
    borderRadius: PROFILE_PIC_SIZE / 2
  },
  headerTextContainer: {
    flex: 1,
    marginLeft: 25,
    justifyContent: 'center'
  },
  headerMainText: {
    fontSize: 24,
    fontWeight: 'bold'
  },
  sectionContainer: {
    padding: 20,
    backgroundColor: 'white',
    width: '100%'
  },
  sectionHeader: {
    fontSize: 12,
    marginBottom: 5,
    color: DARKER_GREY
  },
  buttonStyle: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: GREY,
    paddingVertical: 15
  },
  buttonTextStyle: {
    fontSize: 16
  },
  safeArea: {
    flex: 1,
    backgroundColor: '#fff'
  },
  safeStatusArea: {
    flex: 0,
    backgroundColor: '#fff'
  }
});

function ActionButton(props) {
  return (
    <TouchableOpacity onPress={props.onPress}>
      <View style={styles.buttonStyle}>
        <Text style={props.textStyle}>{props.title}</Text>
        {props.icon && <Icon name={props.icon} size={25} />}
      </View>
    </TouchableOpacity>
  );
}

class ProfileScreen extends Component {

  componentDidMount() {
    this.firebaseListener = firebase.auth().onAuthStateChanged(user => {
      if (user == null) {
        this.props.navigation.navigate('Auth');
      }
    });
  }

  componentWillUnmount() {
    this.firebaseListener && this.firebaseListener();
  }

  logout = () => {
    firebase.auth().signOut();
  }

  tutorial = () => {
    this.props.navigation.navigate('Tutorial');
  }

  render() {
    const bio = this.props.user.bio ? this.props.user.bio : `Hello! My name is ${this.props.user.fullName}.`;

    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.container}>
          <View style={styles.header}>
            <Image style={{width: 70, height: 70, borderRadius: 70 / 2}} source={{uri: this.props.user.photoUrl}} />
            <View style={styles.headerTextContainer}>
              <Text style={styles.headerMainText}>{this.props.user.fullName}</Text>
            </View>
          </View>
          <View style={styles.sectionContainer}>
            <Text style={styles.sectionHeader}>BIO</Text>
            <Text style={{lineHeight: 20}}>{bio}</Text>
          </View>
          <View style={styles.sectionContainer}>
            <Text style={styles.sectionHeader}>ACTIONS</Text>
            <ActionButton
              title='Tutorial'
              onPress={this.tutorial}
              textStyle={{...styles.textStyle, color: ACCENT}}
            />
            <ActionButton
              title='Log out'
              onPress={this.logout}
              textStyle={{...styles.textStyle, color: ACCENT}}
            />
          </View>
        </View>
      </SafeAreaView>
    );
  }
}

const mapStateToProps = state => {
  return {
    user: state.user
  };
}

export default connect(mapStateToProps)(ProfileScreen);
