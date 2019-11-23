import React, { Component } from 'react';
import {
  View,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  StatusBar,
  Platform
} from 'react-native';
import * as firebase from 'firebase';
import * as Facebook from 'expo-facebook';

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

  logInWithEmail = () => {
    firebase.auth()
      .signInWithEmailAndPassword(this.state.email, this.state.password)
      .catch(error => console.log(error));
  }

  logInWithFacebook = async () => {
    try {
      const {
        type,
        token
      } = await Facebook.logInWithReadPermissionsAsync('2873476886029892', {
        permissions: ['public_profile'],
      });

      switch (type) {
        case 'success':
          await firebase.auth().setPersistence(firebase.auth.Auth.Persistence.LOCAL);
          const credential = firebase.auth.FacebookAuthProvider.credential(token);
          firebase.auth().signInWithCredential(credential)
            .then(cred => {
              console.log('logged in with facebook!');
              if (!cred.additionalUserInfo.isNewUser) {
                this.props.navigation.navigate('Home');
              } else {
                console.log('new user!');
                // TODO: POST request to API server
                this.props.navigation.navigate('Location');
              }
            }
          ); 

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
          source={require('../assets/logo.png')}
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
          <Text style={{color: DARKER_GREY}}>{"Don't have an account? "}</Text>
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

export default LoginScreen;