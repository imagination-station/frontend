import React, { Component } from 'react';
import {
  View,
  StyleSheet,
  Image,
  StatusBar,
  Platform
} from 'react-native';
import * as firebase from 'firebase';
import { connect } from 'react-redux';

import { PRIMARY } from '../config/styles.js';
import { SERVER_ADDR, TEST_SERVER_ADDR } from '../config/settings.js';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    padding: Platform.OS === 'ios' ? 0 : StatusBar.currentHeight,
    backgroundColor: PRIMARY,
  },
  logo: {
    height: 125,
    marginTop: 100,
    marginBottom: 100,
    resizeMode: 'contain'
  },
});

class SplashScreen extends Component {

  componentDidMount() {
    this.firebaseListener = firebase.auth().onAuthStateChanged(async user => {
      if (user != null) {
        // // check if user logged in through facebook
        // console.log('auth provider', firebase.auth().currentUser.providerData[0].providerId);
        // // can use this in Facebook Graph API
        // console.log('facebook uid', firebase.auth().currentUser.providerData[0].uid);

        firebase.auth().currentUser.getIdToken()
          .then(token =>
            fetch(`${TEST_SERVER_ADDR}/api/users/friends`, {
              headers: {
                Authorization: `Bearer ${token}`
              }
            })
          )
          .then(response => response.json())
          .then(responseJson => this.props.setFriends(responseJson.data))
          .catch(error => console.error(error));

        // listener for friend requests & set requests number
        firebase.database().ref(`/requests/${user.uid}`).on('child_changed', snapshot => {
          console.log('child changed');
          user.getIdToken().then(token => {
            const headers = {
              Authorization: `Bearer ${token}`
            };

            return Promise.all(
              [fetch(`${TEST_SERVER_ADDR}/api/users/requests`, {headers: headers})
                .then(response => response.json()),
              fetch(`${TEST_SERVER_ADDR}/api/users/friends`, {headers: headers})
                .then(response => response.json())]
            );
          })
            .then(responsesJson => {
              this.props.setFriendReqs(responsesJson[0].data);
              this.props.setFriends(responsesJson[1].data);
            })
            .catch(error => console.error(error));	
        });

        firebase.database().ref(`/users/${user.uid}`).on('value', snapshot => {
          let val = snapshot.val();
          console.log(val);
          // TODO: update based on changes
        });

        firebase.auth().currentUser.getIdToken()
          .then(token =>
            fetch(`${TEST_SERVER_ADDR}/api/me`, {
              headers: {
                Accept: 'application/json',
                'Content-type': 'application/json',
                Authorization: `Bearer ${token}`
              },
            }))
          .then(response => response.json())
          .then(async responseJson => {
            this.props.setUser(responseJson);
            this.props.navigation.navigate('Home');
          });
      } else {
        this.props.navigation.navigate('Auth');
      }
    });
  }

  componentWillUnmount() {
    this.firebaseListener && this.firebaseListener();
  }

  render() {
    return (
      <View style={styles.container}>
        {/* don't worry, this is just a temporary logo. */}
        <Image
          style={styles.logo}
          source={require('../assets/logo.png')}
        />
      </View>
    );
  }
}

const mapStateToProps = state => {	
  return {	
    selected: state.selected,	
    user: state.user,	
    // flattened route	
    name: state.name,	
    creator: state.creator,	
    city: state.city,	
    pins: state.pins,	
    tags: state.tags,	
    _id: state._id,
    collaborators: state.collaborators	
  };	
}

const mapDispatchToProps = dispatch => {
  return {
    setUser: user => {
      dispatch({type: 'SET_USER', payload: {
        user: user
      }});
    },
    setFriendReqs: reqs => {
      dispatch({type: 'SET_FRIEND_REQS', payload: {
        reqs: reqs
      }});
    },
    setFriends: friends => {
      dispatch({type: 'SET_FRIENDS', payload: {
        friends: friends
      }});
    },
    setRefresh: () => {
      dispatch({type: 'SET_REFRESH', payload: {
        refresh: true
      }});
    }
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(SplashScreen);
