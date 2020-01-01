
import React, { Component } from 'react';
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  FlatList
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { connect } from 'react-redux';
import * as firebase from 'firebase';

import { PRIMARY, ACCENT, BABY_POWDER } from '../config/styles.js';
import { TAGS, TEST_SERVER_ADDR } from '../config/settings.js';

const styles = StyleSheet.create({
  button: { 
    color: ACCENT,
    fontSize: 18,
    paddingHorizontal: 7,
    marginRight: 10,
    opacity: 1
  },
  container: {
    flex: 1,
    alignItems: 'center'
  },
  box: {
    width: 170,
    height: 170,
    backgroundColor: BABY_POWDER,
    justifyContent: 'center',
    marginLeft: 15,
    marginBottom: 15,
    elevation: 1
  },
  highlighted: {
    width: 170,
    height: 170,
    backgroundColor: ACCENT,
    justifyContent: 'center',
    marginLeft: 15,
    marginBottom: 15,
  }
});

class Interests extends Component {

  static navigationOptions = ({ navigation }) => {
    return {
      headerTitle: () => <Text style={{fontSize: 20, marginLeft: 10}}>Interests</Text>,
      headerRight: () => (
        <TouchableOpacity
          onPress={navigation.getParam('onPressNext')}
        >
          {/* make Next button opaque until city is chosen */}
          <Text style={{...styles.button, opacity: 1}}>Done!</Text>
        </TouchableOpacity>
      )
    }
  }

  state = {
    interests: []
  };

  componentDidMount() {
    this.props.navigation.setParams({onPressNext: this.onPressNext});
  }

  onToggleInterestBox = item => {
    if (this.state.interests.includes(item)) {
      this.setState({
        interests: this.state.interests.filter(elem => item != elem)
      });
    } else {
      this.setState({
        interests: [...this.state.interests, item]
      });
    }
  }

  onPressNext = () => {
    firebase.auth().currentUser.getIdToken()
      .then(token =>
        fetch(`${TEST_SERVER_ADDR}/api/users/${this.props.user._id}`, {
          method: 'PUT',
          headers: {
            Accept: 'application/json',
            'Content-type': 'application/json',
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify({
            interests: this.state.interests
          })
        })
      )
      .then(response => {
        if (response.ok) {
          return firebase.auth().currentUser.getIdToken();
        }
      })
      .then(token =>
        fetch(`${TEST_SERVER_ADDR}/api/users/${this.props.user._id}`, {
          headers: {
            Accept: 'application/json',
            'Content-type': 'application/json',
            Authorization: `Bearer ${token}`
          },
        })
      )
      .then(response => response.json())
      .then(responseJson => {
        this.props.setUser(responseJson);
        this.props.navigation.navigate('Home');
      })
      .catch(error => console.error(error));
  }

  render() {
    return (
      <View style={styles.container}>
        <View style={{width: '90%', marginVertical: 10, marginHorizontal: '5%'}}>
          <Text style={{fontSize: 32, color: 'grey'}}>What are</Text>
          <Text style={{fontSize: 32, color: 'grey'}}>you interested in?</Text>
          <View style={{flexDirection: 'row', marginTop: 10}}>
            <Icon name='help-outline' size={20} color={PRIMARY} style={{marginRight: 5}}/>
            <Text>This helps us better individualize content.</Text>
          </View>
        </View>
        <FlatList
          style={{padding: 10, width: '100%'}}
          data={TAGS}
          renderItem={({ item }) => <TouchableOpacity onPress={() => this.onToggleInterestBox(item)}>
            <View style={this.state.interests.includes(item) ? styles.highlighted : styles.box}>
              <Text style={{fontSize: 18, textAlign: 'center', color: this.state.interests.includes(item) ? 'white' : 'grey'}}>{item}</Text>
            </View>
          </TouchableOpacity>}
          numColumns={2}
          keyExtractor={item => item}
        />
      </View>
    );
  }
}

const mapStateToProps = state => {
  return {
    user: state.user
  };
}

const mapDispatchToProps = dispatch => {
  return {
    setUser: user => {
      dispatch({type: 'SET_USER', payload: {
        user: user,
      }});
    }
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Interests);