import React, { Component } from 'react';
import {
  View,
  StyleSheet,
  Text,
  TextInput
} from 'react-native';
import * as firebase from 'firebase';
import { SERVER_ADDR, PLACE_ID, MAPS_API_KEY } from '../config/settings.js';

import Button from '../components/Buttons.js';
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

class SignUpScreen extends Component {

    state = {
        name: '',
        username: '',
        email: '',
        password: '',
        bio: '',
        location: ''
    }

    componentDidMount() {
        firebase.auth().onAuthStateChanged(user => {
            if (user != null) {
                this.props.navigation.navigate('Home');
            }
        });
    }

    signUp = () => {
        fetch(`${SERVER_ADDR}/users/email`, {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-type': 'application/json'
            },
            body: JSON.stringify({
                name: this.state.name,
                username: this.state.username,
                email: this.state.email,
                password: this.state.password,
                bio: this.state.bio,
                location: PLACE_ID
            })
        })
        .then(this.props.navigation.navigate('Login'))
        .catch(error => console.error(error));
    }

    render() {
        return (
          <View style={styles.container}>
            <Text style={{...globalStyles.text, fontSize: 24, marginBottom: 50}}>A Travel App</Text>
            <TextInput
              style={styles.textInput}
              placeholder={'Full Name'}
              onChangeText={text => this.setState({name: text})}
              value={this.state.name}
            />
            <TextInput
              style={styles.textInput}
              placeholder={'Username'}
              onChangeText={text => this.setState({username: text})}
              value={this.state.username}
            />
            <TextInput
              style={styles.textInput}
              placeholder={'Email'}
              onChangeText={text => this.setState({email: text})}
              value={this.state.email}
            />
            <TextInput
              style={styles.textInput}
              placeholder={'Password (Must be at least 6 characters)'}
              onChangeText={text => this.setState({password: text})}
              value={this.state.password}
              textContentType={'password'}
              secureTextEntry
            />
            <TextInput
              style={styles.textInput}
              placeholder={'Bio'}
              onChangeText={text => this.setState({bio: text})}
              value={this.state.bio}
            />
            <TextInput
              style={styles.textInput}
              placeholder={'Location (City, State)'}
              onChangeText={text => this.setState({location: text})}
              value={this.state.location}
            />
            <Button
              title='Sign Up'
              onPress={this.signUp}
            />
          </View>
        );
      }
}

export default SignUpScreen;