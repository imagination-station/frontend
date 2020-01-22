import React, { Component } from 'react';
import {
  View,
  StyleSheet,
  Text,
  FlatList,
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
import { ACCENT, PRIMARY } from '../config/styles.js';

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
  return (
    <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10}}>
      <View style={{flexDirection: 'row', alignItems: 'center'}}>
        <Image style={{height: 50, width: 50, borderRadius: 25, marginRight: 20}} source={{uri: props.photoUrl}} />
        <Text style={{fontSize: 16}}>{props.fullName}</Text>
      </View>
      <TouchableOpacity onPress={props.onPress}>
        <View style={{backgroundColor: ACCENT, borderRadius: 5, flexDirection: 'row', alignItems: 'center', padding: 3}}>
          <Text style={{color: 'white'}}>ACCEPT</Text>
        </View>
      </TouchableOpacity>
    </View>
  );
}

class FriendRequests extends Component {

  static navigationOptions = () => {
    return {
      tabBarVisible: false,
      header: null
    };
  }

  onAcceptReq = from => {
    firebase.auth().currentUser.getIdToken()
      .then(token =>
        fetch(`${TEST_SERVER_ADDR}/api/users/${firebase.auth().currentUser.uid}/requests?from=${from}&action=ACCEPT`, {
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
    console.log('FriendRequests render()');
    return (
      <SafeAreaView style={{flex: 1}}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => this.props.navigation.goBack()}>
            <Icon name='keyboard-arrow-left' size={45} />
          </TouchableOpacity>
        </View>
        <View style={styles.container}>
          <View style={{marginVertical: 30}}>
            <Text style={{fontSize: 32, fontWeight: 'bold'}}>Friend Requests</Text>
          </View>
          <FlatList
            data={this.props.friendReqs.received}
            renderItem={({ item }) => <FriendItem	{...item} onPress={() => this.onAcceptReq(item._id)} />}
          />
        </View>
      </SafeAreaView>
    );
  }
}

const mapStateToProps = state => {
  return {
    friendReqs: state.friendReqs
  };
}

export default connect(mapStateToProps)(FriendRequests);