import React, { Component } from 'react';
import { Text, View, Button } from 'react-native';

import styles from '../config/styles.js';

class LoginScreen extends Component {

  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.text}>This is the login screen.</Text>
        <Button
          title='Press me'
          onPress={() => this.props.navigation.navigate('Home')}
        />
      </View>
    );
  }
}

export default LoginScreen;