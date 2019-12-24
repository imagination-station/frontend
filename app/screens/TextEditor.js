import React, { Component } from 'react';
import {
  View,
  TextInput,
  Text,
  PixelRatio,
  StyleSheet
} from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { Header } from 'react-navigation-stack';
import * as firebase from 'firebase';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { connect } from 'react-redux';
import MapViewDirections from 'react-native-maps-directions';
// import resolveAssetSource from 'resolveAssetSource';

const pin =  require('../assets/pin.png');

import Button from '../components/Buttons.js';
import globalStyles, { GREY, DARKER_GREY, PRIMARY, ACCENT } from '../config/styles.js';
import {
  MAPS_API_KEY,
  SERVER_ADDR,
  INIT_LOCATION,
  PLACE_ID,
  TAGS,
  PLACEHOLDER_IMG
} from '../config/settings.js';

const styles = StyleSheet.create({
    container: {
      flex: 1,
      paddingVertical: 10,
      paddingHorizontal: 15,
      alignItems: 'center'
    },
    editor: {
      width: '100%',
      shadowColor: 'black',
      shadowOffset: {
        width: 0,
        height: 1,
      },
      shadowOpacity: 0.20,
      shadowRadius: 1.41,
      elevation: 2,
      backgroundColor: 'white',
      borderRadius: 10,
      padding: 10,
      marginBottom: 20,
    },
    textInput: {
      alignSelf: 'flex-start',
      textAlignVertical: 'top',
      width: '100%'
    },
    charCount: {
      alignSelf: 'flex-start',
      color: DARKER_GREY
    }
  });

class TextEditor extends Component {
    state = {
      text: this.props.initialText,
      maxLength: this.props.maxLength
    };
  
    render() {
      return (
        <View style={styles.container}>
          <View style={styles.editor}>
            <TextInput
              autoFocus
              multiline
              numberOfLines={10}
              maxLength={this.state.maxLength}
              onChangeText={text => this.setState({text: text})}
              placeholder={this.props.placeholder}
              value={this.state.text}
              style={styles.textInput}
            />
            <Text
              style={styles.charCount}
            >
              {`${this.state.text ? this.state.text.length : 0}/${this.props.maxLength}`}
            </Text>
          </View>
          <Button
            title='DONE'
            onPress={() => {
              this.props.onDone();
              this.props.navigation.goBack();
            }}
          />
        </View>
      );
    }
  }

export default TextEditor;