import React, { Component } from 'react';
import {
  View,
  StyleSheet,
  Text,
  TextInput
} from 'react-native';
import * as firebase from 'firebase';

import Button from '../components/Button.js';
import globalStyles, { GREY } from '../config/styles.js';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingTop: 75
  },
  textInput: {
    height: 50,
    paddingHorizontal: 10,
    width: 350,
    marginBottom: 10,
    borderColor: GREY,
    borderWidth: 1
  },
  logo: {
    top: 20,
    marginBottom: 50,
    fontSize: 25
  }
});

class LoginScreen extends Component {

  state = {
    email: '',
    password: ''
  };

  componentDidMount() {
    firebase.auth().onAuthStateChanged(user => {
      if (user != null) {
        this.props.navigation.navigate('Home');
      }
    });
  }

  login = () => {
    firebase.auth()
      .signInWithEmailAndPassword(this.state.email, this.state.password)
      .catch(error => console.log(error));
  }

  onPressSignup = () => {
    this.props.navigation.navigate('SignUp')
  }

  render() {
    return (
      <View style={styles.container}>
        <Text style={{...globalStyles.text, fontSize: 24, marginBottom: 50}}>A Travel App</Text>
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
        <Button
          title='Log In'
          onPress={this.login}
        />
        <Button
          title='Sign Up for an account'
          onPress={this.onPressSignup}
        />
      </View>
    );
  }
}

export default LoginScreen;