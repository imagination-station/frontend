import React from 'react';
import { TouchableOpacity, Text } from 'react-native';

import styles from '../config/styles.js';

function Button(props) {
  let style = styles.button;
  if (props.small) {
    style = {...style, fontSize: 14};
  }

  return (
    <TouchableOpacity onPress={props.onPress}>
      <Text style={style}>{props.title}</Text>
    </TouchableOpacity>
  );
}

export default Button;