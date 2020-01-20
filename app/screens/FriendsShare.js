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
  TouchableOpacity
} from 'react-native';
import { connect } from 'react-redux';
import Icon from 'react-native-vector-icons/MaterialIcons';
import * as firebase from 'firebase';

import { TEST_SERVER_ADDR } from '../config/settings.js';

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

class FriendsShare extends Component {

  static navigationOptions = () => {
    return {
      tabBarVisible: false,
      header: null
    };
  }

  state = {
    friends: null
  }

  componentDidMount() {
    this.fetchFriends();
  }

  fetchFriends = () => {
    firebase.auth().currentUser.getIdToken()
      .then(token => 
        fetch(`${TEST_SERVER_ADDR}/api/users/${firebase.auth().currentUser.uid}/friends`, {
          method: 'GET',
          headers: {
            Accept: 'application/json',
            'Content-type': 'application/json',
            Authorization: `Bearer ${token}`
          }
        })
      )
      .then(response => response.json())
      .then(responseJson => this.setState({friends: responseJson.data}))
  }

  render() {
    return (
      <SafeAreaView style={{flex: 1}}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => this.props.navigation.goBack()}>
            <Icon name='keyboard-arrow-left' size={45} />
          </TouchableOpacity>
        </View>
        <View style={styles.container}>
          <View style={{paddingTop: 30, marginBottom: 5}}>
            <Text style={{fontSize: 32, fontWeight: 'bold', marginBottom: 5}}>Travel with your{'\n'}Friends.</Text>
            <Text style={{fontSize: 14}}>
              People you share with will be able to view{'\n'}
              and edit your trip.{'\n'}
            </Text>
          </View>
          <View style={{flexDirection: 'row', alignItems: 'center', marginBottom: 30}}>
            <TextInput
              autoFocus
              style={styles.textBox}
              placeholder='Search'
            />
            <Icon name='search' size={30} />
          </View>
          <View>
            <Text>{`${JSON.stringify(this.state.friends)}`}</Text>
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

export default connect(mapStateToProps)(FriendsShare);