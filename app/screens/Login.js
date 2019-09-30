import React, { Component } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { accentColor } from '../config/styles.js';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center'
  },
  text: {
    backgroundColor: 'whitesmoke',
    color: accentColor,
    fontSize: 24,
    padding: 10,
  }
});

class LoginScreen extends Component {

  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.text}>This is the login screen.</Text>
      </View>
    )
  }
}

export default LoginScreen;