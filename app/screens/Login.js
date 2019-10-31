import React, { Component } from 'react';
import {
  View,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  StatusBar
} from 'react-native';
import * as firebase from 'firebase';
import * as Facebook from 'expo-facebook';

import { GREY, DARKER_GREY, ACCENT, PRIMARY, FACEBOOK } from '../config/styles.js';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    padding: StatusBar.currentHeight
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
    borderRadius: 20
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

  state = {
    email: '',
    password: ''
  };

  componentDidMount() {
    firebase.auth().onAuthStateChanged(user => {
      if (user != null) {
        console.log('logged in with facebook!');
        this.props.navigation.navigate('Home');
      }
    });
  }

  logInWithEmail = () => {
    firebase.auth()
      .signInWithEmailAndPassword(this.state.email, this.state.password)
      .catch(error => console.log(error));
  }

  async logInWithFacebook() {
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
          const facebookProfileData = await firebase.auth().signInAndRetrieveDataWithCredential(credential); 

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
          source={require('../assets/logo.jpg')}
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
          textStyle={{...styles.logInButtton, backgroundColor: ACCENT, marginTop: 20}}
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
            textStyle={{color: PRIMARY, textDecorationLine: 'underline'}}
          />
        </View>
      </View>
    );
  }
}

export default LoginScreen;