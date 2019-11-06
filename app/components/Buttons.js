import React from 'react';
import { TouchableOpacity, Text, View } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

import styles, { ACCENT } from '../config/styles.js';

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

export function LongButton(props) {
  return (
    <TouchableOpacity onPress={props.onPress}>
      <View style={props.style}>
        {props.icon && <Icon name={props.icon} size={30} color={ACCENT} />}
        <Text style={props.textStyle}>{props.title}</Text>
      </View>
    </TouchableOpacity>
  );
}

export default Button;