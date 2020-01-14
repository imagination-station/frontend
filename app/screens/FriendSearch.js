import React, { Component } from 'react';
import {
  View,
  StyleSheet,
  Text,
  TextInput,
  SafeAreaView,
  Platform,
  StatusBar,
  Dimensions,
  TouchableOpacity,
  Image
} from 'react-native';
import { connect } from 'react-redux';
import Icon from 'react-native-vector-icons/MaterialIcons';
import * as firebase from 'firebase';

import { TEST_SERVER_ADDR } from '../config/settings.js';
import { ACCENT } from '../config/styles.js';

// dimensions of the screen
const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
  header: {
    marginTop: Platform.OS === 'ios' ? 0 : StatusBar.currentHeight,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 5
  },
  container: {
    flex: 1,
    paddingHorizontal: 20
  },
  textBox: {
    height: 45,
    width: width - 70, // 70 = width of paddingHorizontal + width of icon
    borderBottomWidth: 2,
    borderBottomColor: 'grey'
  }
});

function Friend(props) {
  return (
    <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between'}}>
      <View style={{flexDirection: 'row', alignItems: 'center'}}>
        <Image style={{height: 50, width: 50, borderRadius: 25, marginRight: 20}} source={{uri: props.url}} />
        <Text style={{fontSize: 16}}>{props.name}</Text>
      </View>
      <TouchableOpacity onPress={props.onAdd}>
        <View style={{backgroundColor: ACCENT, borderRadius: 5, flexDirection: 'row', alignItems: 'center', padding: 3}}>
          <Icon name='add' color='white' size={18} />
          <Text style={{color: 'white'}}>ADD</Text>
        </View>
      </TouchableOpacity>
    </View>
  )
}

class FriendSearch extends Component {

  static navigationOptions = () => {
    return {
      tabBarVisible: false,
      header: null
    };
  }

  state = {
    input: '',
    result: null,
    state: 'NOT_SEARCHED'
  }

  onChangeInput = text => {
    if (this.state.result) {
      this.setState({input: text, result: null, state: 'NOT_SEARCHED'});
    } else {
      this.setState({input: text, state: 'NOT_SEARCHED'});
    }
  }

  searchFriend = () => {
    fetch(`${TEST_SERVER_ADDR}/api/users/search?fingerprint=${this.state.input}`)
      .then(response => response.json())
      .then(responseJson => {
        if (responseJson.status == 'OK') {
          this.setState({result: responseJson.data, state: 'FOUND'});
        } else {
          this.setState({state: 'NOT_FOUND'});
        }
      });
  }

  render() {
    let content;

    switch (this.state.state) {
      case 'FOUND':
        content = <Friend
          url={this.state.result.photoUrl}
          name={this.state.result.fullName}
          onAdd={() => console.log('onAdd')}
        />;
        break;
      case 'NOT_FOUND':
        content = <Text style={{alignSelf: 'center'}}>User not found :(</Text>;
        break;
      default:
        content = null;
    }

    return (
      <SafeAreaView style={{flex: 1}}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => this.props.navigation.goBack()}>
            <Icon name='keyboard-arrow-left' size={45} />
          </TouchableOpacity>
        </View>
        <View style={styles.container}>
          <View style={{paddingTop: 30, marginBottom: 5}}>
            <Text style={{fontSize: 32, fontWeight: 'bold', marginBottom: 10}}>
              Search friends{'\n'}
              by their fingerprints.
            </Text>
            <Text style={{fontSize: 14}}>
              Fingerprints can be viewed in the Profile page.
            </Text>
          </View>
          <View style={{flexDirection: 'row', alignItems: 'center', marginBottom: 30}}>
            <TextInput
              autoFocus
              style={styles.textBox}
              placeholder='Search'
              value={this.state.input}
              onChangeText={this.onChangeInput}
            />
            <TouchableOpacity onPress={this.searchFriend}>
              <Icon name='search' size={30} />
            </TouchableOpacity>
          </View>
          <View>
            {content}
          </View>
        </View>
      </SafeAreaView>
    );
  }
}

const mapStateToProps = state => {
  return {
    accessToken: state.accessToken
  };
}

export default connect(mapStateToProps)(FriendSearch);