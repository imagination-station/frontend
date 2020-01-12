import React from 'react';
import {
  Image,
  Text,
  View,
  StyleSheet,
  TouchableWithoutFeedback,
  TouchableOpacity
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { LinearGradient } from 'expo-linear-gradient';

import{ GREY } from '../config/styles.js';

const styles = StyleSheet.create({
  card: {
    marginHorizontal: 10,
    marginVertical: 15,
    height: 250,
    width: 200,
    overflow: 'hidden',
    borderRadius: 10
  },
  cardHorizontal: {
    marginHorizontal: 10,
    marginVertical: 15,
    height: 200,
    width: 250,
    overflow: 'hidden',
    borderRadius: 10
  },
  gradient: {
    width: '100%',
    height: '100%',
    position: 'absolute'
  },
  cardImage: {
    width: '100%',
    height: '100%',
    alignSelf: 'center',
  },
  textContent: {
    paddingLeft: 20,
    paddingRight: 10,
    paddingBottom: 30,
    position: 'absolute',
    bottom: 0
  },
  cardtitle: {
    fontSize: 20,
    marginBottom: 5,
    color: 'white'
  },
  iconButtonBar: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    position: 'absolute',
    top: 5,
    right: 5,
    zIndex: 5
  },
  cityTitle: {
    fontSize: 10,
    marginTop: 5,
  }
});

export default function RouteCard(props) {
  let pic = {
    uri: props.photoRef
  };

  return (
    <TouchableWithoutFeedback onPress={props.onPress}>
      <View style={styles.card}>
        <View style={styles.iconButtonBar}>
          {'bookmarked' in props && <TouchableOpacity onPress={props.onBookmark}>
            <Icon
              name={props.bookmarked ? 'bookmark' : 'bookmark-border'}
              size={25}
              color={props.bookmarked ? '#f1c236': 'rgba(0,0,0,0.8)'}
            />
          </TouchableOpacity>}
          {'liked' in props && <TouchableOpacity onPress={props.onLike}>
            <Icon
              name={props.liked ? 'favorite' : 'favorite-border'}
              size={25}
              color={props.liked ? '#fd889c': 'rgba(0, 0, 0, 0.5)'}
            />
          </TouchableOpacity>}
        </View>
        <Image source={pic} style={styles.cardImage} resizeMode='cover' />
        <LinearGradient
          colors={['rgba(0,0,0,0.3)', 'transparent', 'rgba(0,0,0,0.8)']}
          style={styles.gradient}
        >
        </LinearGradient>
        <View style={styles.textContent}>
          <Text style={styles.cardtitle}>{props.title}
          </Text>
          {props.city && <Text numberOfLines={1} style={styles.cityTitle}>
            {props.city}
          </Text>}
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <Icon
              name='favorite'
              size={15}
              color='#e5446d'
              style={{marginRight: 3}}
            />
            <Text style={{color: 'black', fontSize: 12}}>{props.numLikes}</Text>
          </View>
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
}
