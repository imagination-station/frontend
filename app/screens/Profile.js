import React, { Component } from 'react';
import { Text, View, BackHandler } from 'react-native';
import * as firebase from 'firebase';

import Button from '../components/Button.js';
import globalStyles from '../config/styles.js';

class ProfileScreen extends Component {

  componentDidMount() {
    this.backHandler = BackHandler.addEventListener('hardwareBackPress', firebase.auth().signOut);
  }

  componentWillUnmount() {
    this.backHandler.remove();
  }

  render() {
    return (
      <View style={globalStyles.container}>
        <Text style={globalStyles.text}>
            {`logged in as ${firebase.auth().currentUser.email}`}
        </Text>
        <Button
          title='Create New'
          onPress={() => this.props.navigation.navigate('Map')}
        />
      </View>
    );
  }
}

export default ProfileScreen;
