import React, { Component } from 'react';
import { Text, View, Button } from 'react-native';

import styles from '../config/styles.js';

class ExploreScreen extends Component {
  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.text}>This is the Explore screen :)</Text>
        <Button
          title='Press me'
        />
      </View>
    );
  }
}

export default ExploreScreen;
