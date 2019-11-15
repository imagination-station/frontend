import React from 'react';
import { StyleSheet, View, Image, Dimensions } from 'react-native';

// dimensions of the screen
const {width, height} = Dimensions.get('window');
console.log(width);

const IMG_WIDTH = Math.floor(width / 2.25);
const IMG_HEIGHT = Math.floor(IMG_WIDTH * (3.0 / 4.0));

const LEFT = 0;
const HORIZONTAL = 1;
const RIGHT = 2;

const styles = StyleSheet.create({
});

function ImageColumn(props) {
  return (
    <View>
      <Image source={{uri: props.uris[0]}} style={{width: IMG_WIDTH, height: IMG_HEIGHT, marginBottom: 10, borderRadius: 10}} />
      {props.uris.length > 1 ? <Image source={{uri: props.uris[1]}} style={{width: IMG_WIDTH, height: IMG_HEIGHT, borderRadius: 10}} /> : null}
    </View>
  );
}

function ImageTile(props) {
  let images;
  if (props.direction == LEFT) {
    images = [
      <ImageColumn uris={props.uris.slice(0, 2)} />,
      props.uris.length > 2 ? <Image source={{uri: props.uris[2]}} style={{width: IMG_WIDTH, height: IMG_HEIGHT * 2 + 10, borderRadius: 10, marginLeft: 10}} /> : null
    ];
  } else {
    images = [
      <Image source={{uri: props.uris[0]}} style={{width: IMG_WIDTH, height: IMG_HEIGHT * 2 + 10, borderRadius: 10, marginRight: 10}} />,
      props.uris.length > 1 ? <ImageColumn uris={props.uris.slice(1, 3)} /> : null
    ];
  }

  return (
    <View style={{flexDirection: 'row', marginBottom: 10}}>
      {images}
    </View>
  )
}

export default function ImageCarousel(props) {

  let tiles = [];

  for (let i = 0, type = LEFT; i < props.uris.length; type = (type + 1) % 3) {
    switch (type) {
      case LEFT:
      case RIGHT:
        tiles.push(<ImageTile direction={type} uris={props.uris.slice(i, i+3)} />);
        i += 3;
        break;
      default:
        tiles.push(<Image source={{uri: props.uris[i]}} style={{width: IMG_WIDTH * 2 + 10, height: IMG_HEIGHT, borderRadius: 10, marginBottom: 10}} />);
        i++;
        break;
    }
  }

  return (
    <View style={props.containerStyle}>
      {tiles}
    </View>
  );
}
