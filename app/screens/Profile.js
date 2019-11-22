import React, { Component, Fragment } from 'react';
import { Text, View, Image, StyleSheet, TouchableOpacity, StatusBar, SafeAreaView, Platform } from 'react-native';
import * as firebase from 'firebase';
import Icon from 'react-native-vector-icons/MaterialIcons';

import { DARKER_GREY, GREY, PRIMARY, ACCENT } from '../config/styles.js';

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
  headerTextContainer: {
    flex: 1,
    marginLeft: 25
  },
  headerMainText: {
    fontSize: 20,
    fontWeight: 'bold'
  },
  headerSecondaryText: {
    fontSize: 14,
    color: PRIMARY
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

const NAME = 'Matias Sanders';
const BIO = "Hello! I'm a professor of art history at Georgia State. I have lived in Atlanta for about 10 years."

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
    firebase.auth().onAuthStateChanged(user => {
      if (user == null) {
        this.props.navigation.navigate('Login');
      }
    });
  }

  logout = () => {
    firebase.auth().signOut();
  }

  tutorial = () => {
    this.props.navigation.navigate('Tutorial');
  }

  render() {
    return (
      <Fragment>
        <SafeAreaView style={styles.safeStatusArea} />
        <SafeAreaView style={styles.safeArea}>
          <View style={styles.container}>
            <View style={styles.header}>
              <Image style={{width: 70, height: 70, borderRadius: 70 / 2}} source={require('../assets/profile-pic.jpg')} />
              <View style={styles.headerTextContainer}>
                <Text style={styles.headerMainText}>{NAME}</Text>
                <Text style={styles.headerSecondaryText}>{firebase.auth().currentUser.email}</Text>
              </View>
            </View>
            <View style={styles.sectionContainer}>
              <Text style={styles.sectionHeader}>BIO</Text>
              <Text style={{lineHeight: 20}}>{BIO}</Text>
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
      </Fragment>
    );
  }
}

export default ProfileScreen;
