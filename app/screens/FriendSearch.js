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
import { ACCENT, GREY, PRIMARY } from '../config/styles.js';

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

function FriendItem(props) {
  let action;

  switch (props.status) {
    case 'SELF':
      action = null;
      break;
    case 'ADDED':
      action = (
        <TouchableOpacity>
          <View style={{backgroundColor: GREY, borderRadius: 5, flexDirection: 'row', alignItems: 'center', padding: 3}}>
            <Text>ADDED</Text>
          </View>
        </TouchableOpacity>
      );
      break;
    case 'SENT':
      action = (
        <TouchableOpacity>
          <View style={{backgroundColor: PRIMARY, borderRadius: 5, flexDirection: 'row', alignItems: 'center', padding: 3}}>
            <Text style={{color: 'white'}}>SENT</Text>
          </View>
        </TouchableOpacity>
      );
      break;
    case 'RECEIVED':
      action = (
        <TouchableOpacity onPress={props.onAcceptReq}>
          <View style={{backgroundColor: ACCENT, borderRadius: 5, flexDirection: 'row', alignItems: 'center', padding: 3}}>
            <Text style={{color: 'white'}}>ACCEPT</Text>
          </View>
        </TouchableOpacity>
      );
      break;
    default:
      action = (
        <TouchableOpacity onPress={props.onMakeReq}>
          <View style={{backgroundColor: ACCENT, borderRadius: 5, flexDirection: 'row', alignItems: 'center', padding: 3}}>
            <Icon name='add' color='white' size={18} />
            <Text style={{color: 'white'}}>ADD</Text>
          </View>
        </TouchableOpacity>
      );
      break;
  }

  return (
    <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between'}}>
      <View style={{flexDirection: 'row', alignItems: 'center'}}>
        <Image style={{height: 50, width: 50, borderRadius: 25, marginRight: 20}} source={{uri: props.photoUrl}} />
        <Text style={{fontSize: 16}}>{props.fullName}</Text>
      </View>
      {action}
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
    firebase.auth().currentUser.getIdToken()
      .then(token =>
        fetch(`${TEST_SERVER_ADDR}/api/users?fingerprint=${this.state.input}`, {
          headers: {	
            Authorization: `Bearer ${token}`	
          }
        })
      )
      .then(response => response.json())
      .then(responseJson => {
        if (responseJson.status == 'OK') {
          this.setState({result: responseJson.data, state: 'FOUND'});
        } else {
          this.setState({state: 'NOT_FOUND'});
        }
      });
  }

  onMakeReq = () => {
    firebase.auth().currentUser.getIdToken()
      .then(token =>
        fetch(`${TEST_SERVER_ADDR}/api/users/requests?to=${this.state.result._id}`, {
          method: 'POST',
          headers: {
            Accept: 'application/json',	
            'Content-type': 'application/json',	
            Authorization: `Bearer ${token}`
          }
        })
      )
      .catch(error => console.error(error));	
  }

  onAcceptReq = () => {
    firebase.auth().currentUser.getIdToken()
      .then(token => 
        fetch(`${TEST_SERVER_ADDR}/api/users/requests?from=${this.state.result._id}&action=ACCEPT`, {
          method: 'DELETE',
          headers: {
            Accept: 'application/json',	
            'Content-type': 'application/json',	
            Authorization: `Bearer ${token}`
          }
        })
      )
      .catch(error => console.error(error));	
  }

  render() {
    let content;

    switch (this.state.state) {
      case 'FOUND':
        content = <FriendItem
          {...this.state.result}
          onMakeReq={this.onMakeReq}
          onAcceptReq={this.onAcceptReq}
          status={this.props.people[this.state.result._id]}
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
    people: state.people
  };
}

const mapDispatchToProps = dispatch => {
  return {
    setFriends: friends => {
      dispatch({type: 'SET_FRIENDS', payload: {
        friends: friends
      }});
    },
    setFriendReqs: reqs => {
      dispatch({type: 'SET_FRIEND_REQS', payload: {
        reqs: reqs
      }});
    }
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(FriendSearch);