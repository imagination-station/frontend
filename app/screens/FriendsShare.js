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
  FlatList,
  Image
} from 'react-native';
import { connect } from 'react-redux';
import Icon from 'react-native-vector-icons/MaterialIcons';
import * as firebase from 'firebase';

import { TEST_SERVER_ADDR } from '../config/settings.js';
import { DARKER_GREY, ACCENT, GREY } from '../config/styles.js';

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
  },
  sectionHeader: {
    borderBottomWidth: 1,
    borderBottomColor: GREY,
    marginVertical: 10,
  },
});

function FriendItem(props) {
  let action;

  if (props.shared) {
    action = (
      <TouchableOpacity onPress={props.onRemove}>
        <View style={{backgroundColor: '#fc6c85', borderRadius: 14, flexDirection: 'row', alignItems: 'center', padding: 3, marginRight: 20}}>
          <Icon name='remove' size={14} color='white' />
        </View>
      </TouchableOpacity>
    );
  } else {
    action = (
      <TouchableOpacity onPress={props.onAdd}>
        <View style={{backgroundColor: ACCENT, borderRadius: 14, flexDirection: 'row', alignItems: 'center', padding: 3, marginRight: 20}}>
          <Icon name='add' size={14} color='white' />
        </View>
      </TouchableOpacity>
    );
  }

  return (
    <View style={{flexDirection: 'row', alignItems: 'center', marginVertical: 5}}>
      {action}
      <View style={{flexDirection: 'row', alignItems: 'center'}}>
        <Image style={{height: 50, width: 50, borderRadius: 25, marginRight: 20}} source={{uri: props.photoUrl}} />
        <Text style={{fontSize: 16}}>{props.fullName}</Text>
      </View>
    </View>
  );
}

class FriendsShare extends Component {

  static navigationOptions = () => {
    return {
      tabBarVisible: false,
      header: null
    };
  }

  renderItem = ({ item, index }) => {
    if (item.header) {
      return <View style={styles.sectionHeader} />;
    }

    return (
      <FriendItem
        {...item}
        shared={index < this.props.collaboratorsSet.size}
        onAdd={() => this.onAdd(item)}
        onRemove={() => this.props.removeCollaborator(item._id)}
      />
    );
  }

  onAdd = collaborator => {
    firebase.auth().currentUser.getIdToken()
      .then(token =>
        fetch(`${TEST_SERVER_ADDR}/api/users/${firebase.auth().currentUser.uid}/routes/shared?routeid=${this.props.routeId}&to=${collaborator._id}`, {
          method: 'POST',
          headers: {
            Accept: 'application/json',	
            'Content-type': 'application/json',	
            Authorization: `Bearer ${token}`
          }
        })
      )
      .then(response => {
        if (response.status == 200) {
          this.props.addCollaborator(collaborator);
        }
      })
      .catch(error => console.error(error));	
  }

  render() {
    const items = [
      ...this.props.collaborators.filter(elem => elem._id != this.props.user._id && elem._id != this.props.creator._id),
      {header: true},
      ...this.props.friends.filter(elem => !this.props.collaboratorsSet.has(elem._id) && elem._id != this.props.user._id && elem._id != this.props.creator._id)
    ];

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
          <View style={{flexDirection: 'row', alignItems: 'center', marginBottom: 15}}>
            <TextInput
              autoFocus
              style={styles.textBox}
              placeholder='Search'
            />
            <Icon name='search' size={30} />
          </View>
          <FlatList
            data={items}
            renderItem={this.renderItem}
          />
        </View>
      </SafeAreaView>
    );
  }
}

const mapStateToProps = state => {
  return {
    collaborators: state.collaborators,
    collaboratorsSet: state.collaboratorsSet,
    friends: state.friends,
    routeId: state._id,
    creator: state.creator,
    user: state.user
  };
}

const mapDispatchToProps = dispatch => {	
  return {	
    addCollaborator: collaborator => dispatch({type: 'ADD_COLLABORATOR', payload: {	
      collaborator: collaborator	
    }}),
    removeCollaborator: id => dispatch({type: 'REMOVE_COLLABORATOR', payload: {	
      id: id	
    }})
  };	
}

export default connect(mapStateToProps, mapDispatchToProps)(FriendsShare);