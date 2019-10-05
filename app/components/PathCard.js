import React from 'react';
import { Image, Text, View, Dimensions } from 'react-native'
import { Card } from 'react-native-elements'
import { mapsAPIKey } from '../config/settings.js'
import styles from '../config/styles.js';

export default function PathCard(props) {
	console.log(props)
	let pic = {
		uri: props.photo_reference
	}
	return (
		<Card containerStyle={{padding: 0}}>
			<Text style={styles.text}>{props.name}</Text>
			<Image source={pic} style={{width: Dimensions.get('window').width, height: 150}}/>
			<Text style = {{marginTop: 5}}>This is really cool</Text>
		</Card>
	)
}
