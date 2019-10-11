import React from 'react';
import { Image, Text, View, StyleSheet, Dimensions } from 'react-native';

const {width, height} = Dimensions.get('window');
const CARD_HEIGHT = height / 4;

const styles = StyleSheet.create({
  card: {
    backgroundColor: 'white',
    marginHorizontal: 10,
    marginVertical: 15,
    height: CARD_HEIGHT * 1.4,
    width: 350,
    overflow: 'hidden',
    elevation: 1
  },
  cardImage: {
    flex: 3,
    width: '100%',
    height: '100%',
    alignSelf: 'center'
  },
  textContent: {
    paddingLeft: 10,
    paddingRight: 10,
    paddingBottom: 5,
    flex: 1
  },
  cardtitle: {
    fontSize: 12,
    marginTop: 5,
    fontWeight: 'bold'
  }
});

export default function PathCard(props) {
  let pic = {
    uri: props.photoReference
  };

  return (
    <View style={styles.card}>
      <Image source={pic} style={styles.cardImage} resizeMode='cover' />
      <View style={styles.textContent}>
        <Text numberOfLines={1} style={styles.cardtitle}>
          {props.title}
        </Text>
      </View>
    </View>
  );
}
