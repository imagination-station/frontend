import React, { Component, StyleSheet } from 'react';
import { Text, View } from 'react-native';
import * as firebase from 'firebase';

import Button from '../components/Button.js';
import globalStyles from '../config/styles.js';

const styles = ({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  }
});

class ProfileScreen extends Component {

  componentDidMount() {
    firebase.auth().onAuthStateChanged(user => {
      if (user == null) {
        this.props.navigation.navigate('Login');
      }
    });
  }

  render() {
    return (
      <View style={styles.container}>
        <Text style={globalStyles.text}>
            {firebase.auth().currentUser.email}
        </Text>
        <View style={{alignItems: 'center', marginTop: 30, height: 75, justifyContent: 'space-between'}}>
          <Button
            title='Create New Path'
            onPress={() => this.props.navigation.navigate('Map')}
          />
          <Button
            title='Sign Out'
            onPress={() => firebase.auth().signOut()}
          />
        </View>
      </View>
    );
  }
}

export default ProfileScreen;
