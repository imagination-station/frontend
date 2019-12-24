import React, { Component } from 'react';
import {
  View,
  StyleSheet,
  Text,
  SafeAreaView,
  Dimensions,
  TouchableOpacity
} from 'react-native';
import { connect } from 'react-redux';
import Icon from 'react-native-vector-icons/MaterialIcons';

import { GREY, DARKER_GREY, PRIMARY, ACCENT } from '../config/styles.js';

const {width, height} = Dimensions.get('window');
const CARD_WIDTH = Math.floor(width / 1.5);

const styles = StyleSheet.create({
  safeArea: {
    flex: 1
  },
  container: {
    flex: 1
  },
  sectionContainer: {
    padding: 10,
    paddingBottom: 15,
    backgroundColor: 'white',
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomColor: GREY,
    borderBottomWidth: 1
  },
  sectionHeader: {
    fontSize: 12,
    marginBottom: 5,
    color: PRIMARY
  }
});

class PhotoRemoverScreen extends Component {
  render() {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View>
          <Text>Hello :)</Text>     
        </View>        
      </SafeAreaView>
    );
  }
}

class PlaceEditorScreen extends Component {

  static navigationOptions = ({ navigation }) => {
    return {
      tabBarVisible: false,
      headerTitle: () => <Text style={{fontSize: 20}}>Edit Place</Text>,
      headerRight: () =>
        <TouchableOpacity onPress={() => console.log('Save')}>
          <Icon name='save' size={30} color={ACCENT} style={{marginRight: 10}} />
        </TouchableOpacity>
    };
  }

  onEditTitle = () => {
    this.props.navigation.navigate('TextEditor', {
      initialText: this.props.pins[this.props.selected].properties.mainText,
      maxLength: 280,
      placeholder: 'New title',
      onDone: () => console.log('DONE!')
    });
  }

  onEditNote = () => {
    this.props.navigation.navigate('TextEditor', {
      initialText: this.props.pins[this.props.selected].properties.note,
      maxLength: 280,
      placeholder: 'New note',
      onDone: () => console.log('DONE!')
    });
  }

  render() {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.sectionContainer}>
          <View>
            <Text style={styles.sectionHeader}>TITLE</Text>
            <Text
              numberOfLines={1}
              ellipsizeMode='tail' 
              style={{width: 300}}  
            >
              {this.props.pins[this.props.selected].properties.mainText}
            </Text>
          </View>
          <TouchableOpacity onPress={this.onEditTitle}>
            <Icon name='edit' size={30} color={DARKER_GREY} />
          </TouchableOpacity>
        </View>
        <View style={styles.sectionContainer}>
          <View>
            <Text style={styles.sectionHeader}>NOTE</Text>
            <Text
              numberOfLines={5}
              ellipsizeMode='tail'
              style={{width: 300}}
            >
              {this.props.pins[this.props.selected].properties.note}
            </Text>
          </View>
          <TouchableOpacity onPress={this.onEditNote}>
            <Icon name='edit' size={30} color={DARKER_GREY} />
          </TouchableOpacity>
        </View>
        <View style={styles.sectionContainer}>
          <View>
            <Text style={styles.sectionHeader}>PHOTOS</Text>
            <Text
              numberOfLines={5}
              ellipsizeMode='tail'
              style={{width: 300}}
            >
              {`${this.props.pins[this.props.selected].properties.photoRefs.length} photos`}
            </Text>
          </View>
          <View>
            <Icon name='add' size={30} color={DARKER_GREY} />
            <Icon name='remove' size={30} color={DARKER_GREY} />
          </View>
        </View>
      </SafeAreaView>
    );
  }
}

const mapStateToProps = state => {
  return {
    pins: state.pins,
    selected: state.selected
  };
}

export default connect(mapStateToProps)(PlaceEditorScreen);