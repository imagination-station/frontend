import React, { Component } from 'react';
import { Text, View, Button } from 'react-native';
import PathCard from '../components/PathCard.js';
import { MAPS_API_KEY } from '../config/settings.js';
import styles from '../config/styles.js';

class HomeScreen extends Component {
  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.text}>This is the home screen :)</Text>
        <Button
          title='Press me'
          onPress={() => this.props.navigation.navigate('Map')}
        />
        <PathCard name='Australia' photoReference = 'https://maps.googleapis.com/maps/api/place/photo?maxwidth=1000&photoreference=CmRaAAAA8QEz1MPJ9ktiRwUUk2zsRo0ILSsAS4_IcBtBVUxr4f050oXxgBvoHsWwPttQf0Bu26utHdcZPsM3GRshun4p6EAe_jtorZxiz0b7wddLkidyzU-7OVG_jW335T99ZG5mEhB1SKvvX3sMH0B2YKxxYB7XGhTTwsXqNtldUYZ1-ykwDmDlkddKXQ&key=MAPS_API_KEY'/>
      </View>
    );
  }
}

export default HomeScreen;
