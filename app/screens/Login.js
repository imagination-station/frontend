import React, { Component } from 'react';
import {
  View,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  StatusBar,
  Platform,
  AsyncStorage
} from 'react-native';
import * as firebase from 'firebase';
import * as Facebook from 'expo-facebook';
import { connect } from 'react-redux';

import { SERVER_ADDR, TEST_SERVER_ADDR } from '../config/settings.js';
import { GREY, DARKER_GREY, ACCENT, PRIMARY, FACEBOOK } from '../config/styles.js';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    padding: Platform.OS === 'ios' ? 0 : StatusBar.currentHeight,
    backgroundColor: 'white',
  },
  logo: {
    height: 125,
    marginTop: 100,
    marginBottom: 100,
    resizeMode: 'contain'
  },
  textInput: {
    height: 50,
    paddingHorizontal: 10, 
    width: 350,
    marginBottom: 10,
    borderColor: GREY, 
    borderWidth: 2,
    borderRadius: 20,
    backgroundColor: 'white'
  },
  logInButtton: {
    color: 'white',
    fontSize: 16,
    width: 275,
    fontWeight: 'bold',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
    textAlign: 'center',
  },
});

function LogInButton(props) {
  return (
    <TouchableOpacity onPress={props.onPress} style={{alignItems: 'center', marginVertical: 5}}>
      <Text style={props.textStyle}>{props.title}</Text>
    </TouchableOpacity>
  );
}

function SignUpButton(props) {
  return (
    <TouchableOpacity onPress={props.onPress}>
      <Text style={props.textStyle}>{props.title}</Text>
    </TouchableOpacity>
  );
}

class LoginScreen extends Component {

  static navigationOptions = {
    header: null
  };

  state = {
    email: '',
    password: ''
  };

  // componentDidMount() {
  //   fetch(`${TEST_SERVER_ADDR}/ping`)
  //     .then(response => console.log(response));
  // }

  logInWithEmail = () => {
    firebase.auth().signInWithEmailAndPassword(this.state.email, this.state.password)
      .then(cred => {
        return cred.user.getIdToken();
      })
      .then(token => {
        return fetch(`${SERVER_ADDR}/users?firebaseId=${firebase.auth().currentUser.uid}`, {
          headers: {
            Accept: 'application/json',
            'Content-type': 'application/json',
            Authorization: `Bearer ${token}`
          },
        });
      })
      .then(response => response.json())
      .then(responseJson => {
        console.log('uid', responseJson._id);
        this.props.logIn(responseJson._id);
        this.props.navigation.navigate('Home');
      })
      .catch(error => console.log(error));
  }

  logInWithFacebook = async () => {
    try {
      await Facebook.initializeAsync('2873476886029892');
      const {
        type,
        token
      } = await Facebook.logInWithReadPermissionsAsync('2873476886029892', {
        permissions: ['public_profile', 'email', 'user_friends'],
      });

      switch (type) {
        case 'success':
          let location;
          
          await firebase.auth().setPersistence(firebase.auth.Auth.Persistence.LOCAL);
          const credential = firebase.auth.FacebookAuthProvider.credential(token);
          firebase.auth().signInWithCredential(credential)
            .then(cred => {
              if (!cred.additionalUserInfo.isNewUser) {
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
                    this.props.setUser(responseJson);
                    this.props.navigation.navigate('Home');
                  });
                return;
              }

              fetch(`${TEST_SERVER_ADDR}/api/users`, {
                method: 'POST',
                headers: {
                  Accept: 'application/json',
                  'Content-type': 'application/json',
                },
                body: JSON.stringify({
                  fullName: cred.additionalUserInfo.profile.name,
                  email: cred.additionalUserInfo.profile.email,
                  authProvider: cred.additionalUserInfo.providerId,
                  photoUrl: cred.additionalUserInfo.profile.picture.data.url,
                  interests: [],
                  _id: firebase.auth().currentUser.uid
                })
              })
                .then(response => {
                  location = response.headers.map.location;
                  return firebase.auth().currentUser.getIdToken();
                })
                .then(token =>
                  fetch(`${TEST_SERVER_ADDR}${location}`, {
                    headers: {
                      Accept: 'application/json',
                      'Content-type': 'application/json',
                      Authorization: `Bearer ${token}`
                    },
                  }))
                .then(response => response.json())
                .then(async responseJson => {
                  this.props.setUser(responseJson);
                  this.props.navigation.navigate('Location', {
                    purpose: 'UPDATE_USER'
                  });
                  return;
                })
                .catch(error => console.error(error));
            }); 

          return Promise.resolve({type: 'success'});
        case 'cancel':
          return Promise.reject({type: 'cancel'});
        default:
          return Promise.reject({type: 'cancel'});
      }
    } catch ({ message }) {
      alert(`Facebook Login Error: ${message}`);
    }
  }

  onPressSignup = () => {
    this.props.navigation.navigate('SignUp')
  }

  render() {
    return (
      <View style={styles.container}>
        {/* don't worry, this is just a temporary logo. */}
        <Image
          style={styles.logo}
          source={require('../assets/logo-solid.png')}
        />
        <TextInput
          style={styles.textInput}
          placeholder={'Email'}
          onChangeText={text => this.setState({email: text})}
          value={this.state.email}
        />
        <TextInput
          style={styles.textInput}
          placeholder={'Password'}
          onChangeText={text => this.setState({password: text})}
          value={this.state.password}
          textContentType={'password'}
          secureTextEntry
        />
        <LogInButton 
          title='Log In'
          onPress={this.logInWithEmail}
          textStyle={{...styles.logInButtton, marginTop: 20, borderWidth: 2, borderColor: PRIMARY, color: PRIMARY}}
        />
        <LogInButton 
          title='Continue with Facebook'
          onPress={this.logInWithFacebook}
          textStyle={{...styles.logInButtton, backgroundColor: FACEBOOK}}
        />
        <View style={{marginTop: 40, flexDirection: 'row', alignItems: 'center'}}>
          <Text style>{"Don't have an account? "}</Text>
          <SignUpButton
            title='Sign up.'
            onPress={this.onPressSignup}
            textStyle={{color: ACCENT, textDecorationLine: 'underline'}}
          />
        </View>
      </View>
    );
  }
}

const mapDispatchToProps = dispatch => {
  return {
    setUser: user => {
      dispatch({type: 'SET_USER', payload: {
        user: user,
      }});
    }
  };
}

export default connect(null, mapDispatchToProps)(LoginScreen);