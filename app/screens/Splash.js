import React, { Component } from 'react';
import {
  View,
  StyleSheet,
  Image,
  StatusBar,
  Platform
} from 'react-native';
import * as firebase from 'firebase';
import { connect } from 'react-redux';

import { PRIMARY } from '../config/styles.js';
import { SERVER_ADDR, TEST_SERVER_ADDR } from '../config/settings.js';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    padding: Platform.OS === 'ios' ? 0 : StatusBar.currentHeight,
    backgroundColor: PRIMARY,
  },
  logo: {
    height: 125,
    marginTop: 100,
    marginBottom: 100,
    resizeMode: 'contain'
  },
});

class SplashScreen extends Component {

  componentDidMount() {
    this.firebaseListener = firebase.auth().onAuthStateChanged(user => {
      if (user != null) {
        // // check if user logged in through facebook
        // console.log('auth provider', firebase.auth().currentUser.providerData[0].providerId);
        // // can use this in Facebook Graph API
        // console.log('facebook uid', firebase.auth().currentUser.providerData[0].uid);

        firebase.auth().currentUser.getIdToken()
          .then(token =>
            fetch(`${TEST_SERVER_ADDR}/api/users/${firebase.auth().currentUser.uid}`, {
              headers: {
                Accept: 'application/json',
                'Content-type': 'application/json',
                Authorization: `Bearer ${token}`
              },
            }))
          .then(response => response.json())
          .then(responseJson => {
            console.log(responseJson);
            this.props.setUser(responseJson);
            this.props.navigation.navigate('Home');
          });
      } else {
        this.props.navigation.navigate('Auth');
      }
    });
  }

  componentWillUnmount() {
    this.firebaseListener && this.firebaseListener();
  }

  render() {
    return (
      <View style={styles.container}>
        {/* don't worry, this is just a temporary logo. */}
        <Image
          style={styles.logo}
          source={require('../assets/logo.png')}
        />
      </View>
    );
  }
}

const mapDispatchToProps = dispatch => {
  return {
    setUser: user => {
      dispatch({type: 'SET_USER', payload: {
        user: user
      }});
    }
  };
}

export default connect(null, mapDispatchToProps)(SplashScreen);
