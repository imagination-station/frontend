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

const styles = StyleSheet.create({
  card: {
    backgroundColor: 'white',
    marginHorizontal: 10,
    marginVertical: 15,
    height: 200,
    width: 250,
    overflow: 'hidden',
    elevation: 0.5,
    borderRadius: 10
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
    fontSize: 16,
    marginTop: 5,
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

export default function PathCard(props) {
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
              color={props.bookmarked ? '#f1c236': 'rgba(0, 0, 0, 0.5)'}
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
        <View style={styles.textContent}>
          <Text numberOfLines={1} style={styles.cardtitle}>
            {props.title}
          </Text>
          {props.city && <Text numberOfLines={1} style={styles.cityTitle}>
            {props.city}
          </Text>}
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
}
