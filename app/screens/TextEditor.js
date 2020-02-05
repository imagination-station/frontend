import React, { Component } from 'react';
import {
  View,
  TextInput,
  Text,
  StyleSheet,
  TouchableOpacity,
  Platform,
  StatusBar,
  SafeAreaView
} from 'react-native';

import Icon from 'react-native-vector-icons/MaterialIcons';
import { ACCENT, GREY, DARKER_GREY } from '../config/styles.js';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 15,
    marginTop: 30,
    alignItems: 'center'
  },
  header: {
    marginTop: Platform.OS === 'ios' ? 0 : StatusBar.currentHeight,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 5,
    backgroundColor: 'transparent',
    width: '100%',
    height: 45
  },
  editor: {
    width: '100%',
    // shadowColor: 'black',
    // shadowOffset: {
    //   width: 0,
    //   height: 1,
    // },
    // shadowOpacity: 0.20,
    // shadowRadius: 1.41,
    // elevation: 2,
    // backgroundColor: 'white',
    // borderRadius: 10,
    borderBottomWidth: 1,
    paddingBottom: 10,
    marginBottom: 20,
  },
  textInput: {
    alignSelf: 'flex-start',
    textAlignVertical: 'top',
    width: '100%'
  },
  charCount: {
    alignSelf: 'flex-start'
  },
  saveButton: {
    color: ACCENT,
    fontSize: 18,
    paddingHorizontal: 7
  }
});

class TextEditor extends Component {

  static navigationOptions = {
    tabBarVisible: false,
    header: null
  };

  state = {
    text: this.props.initialText,
    maxLength: this.props.maxLength
  };
  
  render() {
    return (
      <SafeAreaView style={{flex: 1}}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => this.props.navigation.goBack()}>
            <Icon name='keyboard-arrow-left' size={45} />
          </TouchableOpacity>
        </View>
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
          <TouchableOpacity onPress={() => {
              this.props.onDone(this.state.text);
              this.props.navigation.goBack();
            }}
          >
            <Text style={styles.saveButton}>SAVE</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }
}

export default TextEditor;