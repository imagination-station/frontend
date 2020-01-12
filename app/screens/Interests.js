
import React, { Component } from 'react';
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  FlatList,
  SafeAreaView,
  Platform,
  StatusBar
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { connect } from 'react-redux';
import * as firebase from 'firebase';

import { PRIMARY, ACCENT, BABY_POWDER, GREY, DARKER_GREY } from '../config/styles.js';
import { TAGS, TEST_SERVER_ADDR } from '../config/settings.js';

const styles = StyleSheet.create({
  header: {
    marginTop: Platform.OS === 'ios' ? 0 : StatusBar.currentHeight,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 5
  },
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 30
  },
  box: {
    borderWidth: 1,
    paddingHorizontal: 20,
    paddingVertical: 10,
    marginBottom: 5,
    marginRight: 5,
    borderColor: 'grey',
    borderRadius: 15
  },
  highlighted: {
    borderWidth: 1,
    paddingHorizontal: 20,
    paddingVertical: 10,
    marginBottom: 5,
    marginRight: 5,
    borderColor: ACCENT,
    borderRadius: 15
  },
  nextButton: {
    backgroundColor: ACCENT,
    borderRadius: 45 / 2,
    marginRight: 10
  },
  nextButtonDisabled: {
    backgroundColor: GREY,
    borderRadius: 45 / 2,
    marginRight: 10
  }
});

class Interests extends Component {

  static navigationOptions = () => {
    return {
      header: null
    };
  }

  state = {
    interests: new Set()
  };

  onToggleInterestBox = item => {
    let updatedInterests = new Set(this.state.interests);

    if (this.state.interests.has(item)) {
      updatedInterests.delete(item);
    } else {
      updatedInterests.add(item);
    }

    this.setState({interests: updatedInterests});
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
            interests: [...this.state.interests]
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
      <SafeAreaView style={{flex: 1}}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => this.props.navigation.goBack()}>
            <Icon name='keyboard-arrow-left' size={45} />
          </TouchableOpacity>
          <TouchableOpacity
            style={this.state.interests.size > 0 ? styles.nextButton : styles.nextButtonDisabled}
            onPress={this.onPressNext}
          >
            <Icon
              name='keyboard-arrow-right'
              size={45}
              color={'white'}
            />
          </TouchableOpacity>
        </View>
      <View style={styles.container}>
        <Text style={{fontSize: 32, fontWeight: 'bold', marginBottom: 5}}>
          What are you{'\n'}interested in?
        </Text>
        <Text style={{fontSize: 18, marginBottom: 45}}>
          We will customize your feed based on them.
        </Text>
        <FlatList
          style={{width: '100%'}}
          data={TAGS}
          renderItem={({ item }) => <TouchableWithoutFeedback onPress={() => this.onToggleInterestBox(item)}>
            <View style={this.state.interests.has(item) ? styles.highlighted : styles.box}>
              <Text style={{fontSize: 18, textAlign: 'center', color: this.state.interests.has(item) ? ACCENT : 'black'}}>{item}</Text>
            </View>
          </TouchableWithoutFeedback>}
          numColumns={3}
          keyExtractor={item => item}
        />
      </View>
    </SafeAreaView>
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