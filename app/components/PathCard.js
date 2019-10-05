import React from 'react';
import { Image, Text, Dimensions } from 'react-native';
import { Card } from 'react-native-elements';
import { MAPS_API_KEY } from '../config/settings.js';
import styles from '../config/styles.js';

export default function PathCard(props) {
  console.log(props);
  let pic = {
    uri: props.photoReference
  };
  return (
    <Card containerStyle={{padding: 0}}>
      <Text style={styles.text}>{props.name}</Text>
      <Image source={pic} style={{width: Dimensions.get('window').width, height: 150}}/>
      <Text style = {{marginTop: 5}}>This is really cool</Text>
    </Card>
  );
}
